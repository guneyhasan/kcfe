import axios from 'axios';

const API_URL = 'http://localhost:8090';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor'ı güncelleyelim
api.interceptors.request.use((config) => {
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        return config;
    }

    try {
        const user = JSON.parse(userStr);
        if (user.access_token) {
            config.headers.Authorization = `Bearer ${user.access_token}`;
        }
    } catch (error) {
        console.error('Token parsing error:', error);
    }
    
    return config;
});

// Hata interceptor'ını düzeltelim
api.interceptors.response.use(
    (response) => response,
    (error) => {
        // 401 hatası durumunda localStorage'ı temizle ve ana sayfaya yönlendir
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            if (window.location.pathname !== '/') {
                window.location.href = '/';
            }
        }
        return Promise.reject(error);
    }
);

export const authService = {
    register: async (userData) => {
        try {
            // API'ye gönderilecek veriyi hazırla
            const registerData = {
                fullName: userData.fullName,
                username: userData.username,
                email: userData.email,
                phoneNumber: userData.phoneNumber,
                password: userData.password
            };

            console.log('API\'ye gönderilen veriler:', registerData);

            const response = await api.post('/auth/register', registerData);
            
            console.log('API yanıtı:', response.data);
            
            if (response.data) {
                if (response.data.access_token) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                }
                return response.data;
            }
            throw new Error('Kayıt işlemi başarısız oldu');
        } catch (error) {
            console.error('API Error:', error);
            if (error.response && error.response.data) {
                console.log('Backend hata mesajı:', error.response.data);
                throw new Error(error.response.data.message || 'Kayıt işlemi başarısız oldu');
            }
            throw new Error('Sunucuya bağlanılamadı. Lütfen daha sonra tekrar deneyin.');
        }
    },

    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', {
                username: credentials.username,
                password: credentials.password
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    logout: () => {
        localStorage.removeItem('user');
    },

    forgotPassword: async (email) => {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            const response = await api.post('/auth/reset-password', {
                token,
                newPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    googleLogin: async (googleToken) => {
        try {
            const response = await api.post('/auth/google', { token: googleToken });
            if (response.data.access_token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

export const challengeService = {
    // Token alma yardımcı fonksiyonu
    getToken: () => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            throw new Error('Kullanıcı bilgisi bulunamadı');
        }
        const token = JSON.parse(userData).access_token;
        if (!token) {
            throw new Error('Token bulunamadı');
        }
        return token;
    },

    getChallenges: async (params = {}) => {
        try {
            const userData = localStorage.getItem('user');
            const token = JSON.parse(userData).access_token;
            const response = await api.get('http://localhost:8090/challenges', { 
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    page: params.page || 1,
                    limit: params.limit || 10,
                    status: params.status || 'pending',
                    category: params.category || undefined,
                    difficulty: params.difficulty || undefined,
                    search: params.search || undefined,
                    game: params.game || undefined,
                    platform: params.platform || undefined
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get Challenges Error:', error);
            throw error;
        }
    },

    // Yeni meydan okuma oluştur
    createChallenge: async (challengeData) => {
        try {
            const response = await api.post('/challenges', challengeData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Meydan okuma kabul et
    acceptChallenge: async (challengeId) => {
        try {
            const response = await api.post(`/challenges/${challengeId}/accept`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    // Sonuç bildir
    completeChallenge: async (challengeId, winnerId) => {
        try {
            const response = await api.post(`/challenges/${challengeId}/complete`, { winnerId });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    },

    sendChallengeRequest: async (challengeId) => {
        try {
            const userData = localStorage.getItem('user');
            const token = JSON.parse(userData).access_token;
            console.log(token);
            
            if (!token) {
                throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
            }

            const response = await axios.post(
                `${API_URL}/challenges/${challengeId}/requests`,
                {
                    message: "Merhaba, bu meydan okumaya katılmak istiyorum!",
                    platform: "Steam",
                    platformUsername: "player123_steam"
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                return response.data.data.request;
            }
        } catch (error) {
            if (error.response?.status === 401) {
                localStorage.removeItem('user'); // Token geçersizse sil
                throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
            }
            if (error.response) {
                throw new Error(error.response.data.message);
            }
            throw error;
        }
    },

    // Gelen istekleri getir
    getChallengeRequests: async (challengeId) => {
        try {
            const userData = localStorage.getItem('user');
            const token = JSON.parse(userData).access_token;
          
            const response = await axios.get(
                `${API_URL}/challenges/${challengeId}/requests`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            console.log(555);
            return response.data.data.requests;
        } catch (error) {
            console.error('Gelen istekler alınamadı:', error);
            throw error;
        }
    },

    // Gönderilen istekleri getir
    getSentRequests: async () => {
        try {
            const token = challengeService.getToken();
            const response = await axios.get(`${API_URL}/challenges/my-sent-requests`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                return {
                    success: true,
                    data: {
                        total: response.data.data.total,
                        requests: {
                            pending: response.data.data.requests.pending.map(request => ({
                                id: request.id,
                                username: request.challenge.creator.username,
                                avatarUrl: request.challenge.creator.avatarUrl,
                                challenge: {
                                    title: request.challenge.title,
                                    game: request.challenge.game,
                                    entryFee: request.challenge.entryFee,
                                    reward: request.challenge.reward,
                                    duration: request.challenge.duration
                                }
                            })),
                            accepted: response.data.data.requests.accepted.map(request => ({
                                id: request.id,
                                username: request.challenge.creator.username,
                                avatarUrl: request.challenge.creator.avatarUrl,
                                challenge: {
                                    title: request.challenge.title,
                                    game: request.challenge.game,
                                    entryFee: request.challenge.entryFee,
                                    reward: request.challenge.reward,
                                    duration: request.challenge.duration
                                }
                            }))
                        }
                    }
                };
            }
            return response.data;
        } catch (error) {
            console.error('Gönderilen istekler alınamadı:', error);
            throw error;
        }
    },

    // Gelen istekleri getir
    getMyRequests: async () => {
        try {
            const token = challengeService.getToken();
            const response = await axios.get(`${API_URL}/challenges/my-requests`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (response.data.success) {
                const { challenges } = response.data.data;
                
                // Debug için
                challenges.forEach(item => {
                    console.log(`\nMeydan Okuma: ${item.challenge.title}`);
                    console.log('Gelen İstekler:', item.requests.length);
                    item.requests.forEach(request => {
                        console.log(`- ${request.username}: ${request.message}`);
                    });
                });

                return {
                    success: true,
                    data: {
                        challenges: challenges.map(item => ({
                            challenge: {
                                id: item.challenge.id,
                                title: item.challenge.title,
                                game: item.challenge.game,
                                entryFee: item.challenge.entryFee,
                                reward: item.challenge.reward,
                                duration: item.challenge.duration
                            },
                            requests: item.requests.map(request => ({
                                id: request.id,
                                username: request.username,
                                avatarUrl: request.avatarUrl,
                                message: request.message,
                                status: request.status
                            }))
                        }))
                    }
                };
            }
            return response.data;
        } catch (error) {
            console.error('Gelen istekler alınamadı:', error);
            throw error;
        }
    },

    // İstek kabul etme
    acceptRequest: async (requestId) => {
        try {
            const token = challengeService.getToken();
            console.log('İstek kabul ediliyor:', requestId);

            const response = await axios.post(
                `${API_URL}/challenges/requests/${requestId}/accept`,
                {}, // boş body
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                const { match } = response.data.data;
                
                // Detaylı log
                console.log('Maç oluşturuldu:', {
                    matchId: match.id,
                    game: match.game,
                    host: {
                        username: match.host.username,
                        id: match.host.id
                    },
                    opponent: {
                        username: match.opponent.username,
                        id: match.opponent.id
                    },
                    entryFee: match.entryFee,
                    prize: match.prize,
                    pendingTime: match.pendingTime,
                    status: match.status
                });

                // Başarılı yanıt
                return {
                    success: true,
                    data: {
                        match: {
                            id: match.id,
                            game: match.game,
                            host: {
                                id: match.host.id,
                                username: match.host.username
                            },
                            opponent: {
                                id: match.opponent.id,
                                username: match.opponent.username
                            },
                            entryFee: match.entryFee,
                            prize: match.prize,
                            pendingTime: match.pendingTime,
                            status: match.status
                        }
                    }
                };
            }

            throw new Error(response.data.message || 'İstek kabul edilirken bir hata oluştu');
        } catch (error) {
            console.error('İstek kabul edilirken hata:', error.response?.data);
            
            if (error.response?.status === 401) {
                localStorage.removeItem('user');
                throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
            }

            // Hata mesajını fırlat
            throw new Error(
                error.response?.data?.message || 
                error.message || 
                'İstek kabul edilirken bir hata oluştu'
            );
        }
    },

    // İstek reddetme
    declineRequest: async (requestId) => {
        try {
            const token = challengeService.getToken();
            const response = await axios.post(`${API_URL}/challenges/requests/${requestId}/decline`, {}, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('İstek reddedilemedi:', error);
            throw error;
        }
    },

    // İstek iptal etme
    cancelRequest: async (requestId) => {
        try {
            const token = challengeService.getToken();
            const response = await axios.delete(`${API_URL}/challenges/requests/${requestId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        } catch (error) {
            console.error('İstek iptal edilemedi:', error);
            throw error;
        }
    },

    declareMatchResult: async (matchId, winnerId) => {
        try {
            const token = challengeService.getToken();
            const response = await axios.post(
                `${API_URL}/challenges/matches/${matchId}/result`,
                {
                    winnerId
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                return {
                    success: true,
                    data: {
                        match: response.data.data.match
                    }
                };
            }
            return response.data;
        } catch (error) {
            console.error('Sonuç bildirilemedi:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('user');
                throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
            }
            throw error;
        }
    },

    getMyActiveMatches: async (status) => {
        try {
            const token = challengeService.getToken();
            const response = await axios.get(
                `${API_URL}/challenges/my-active-matches`,
                {
                    params: status ? { status } : undefined,
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                return {
                    success: true,
                    data: {
                        matches: response.data.data.matches,
                        total: response.data.data.total
                    }
                };
            }
            return response.data;
        } catch (error) {
            console.error('Aktif maçlar alınamadı:', error);
            if (error.response?.status === 401) {
                localStorage.removeItem('user');
                throw new Error('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
            }
            throw error;
        }
    }
};

export const matchService = {
    // Meydan okumaya katılma isteği gönder
    sendChallengeRequest: async (challengeId) => {
        try {
            const response = await api.post(`${API_URL}/challenges/${challengeId}/requests`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('user')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Send Challenge Request Error:', error);
            throw error;
        }
    },

    // Gelen istekleri listele
    getChallengeRequests: async (challengeId) => {
        try {
            const response = await api.get(`${API_URL}/challenges/${challengeId}/requests`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('user')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get Challenge Requests Error:', error);
            throw error;
        }
    },

    // İsteği kabul et
    acceptChallengeRequest: async (challengeId, requestId) => {
        try {
            const response = await api.post(`${API_URL}/challenges/${challengeId}/requests/${requestId}/accept`, null, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('user')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Accept Challenge Request Error:', error);
            throw error;
        }
    },

    // Aktif maçları listele
    getMatches: async (status = 'active') => {
        try {
            const response = await api.get(`${API_URL}/matches?status=${status}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('user')}`
                }
            });
            return response.data;
        } catch (error) {
            console.error('Get Matches Error:', error);
            throw error;
        }
    }
};
