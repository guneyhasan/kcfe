import axios from 'axios';
import { compressImage } from '../utils/imageCompression';

const API_URL = '/api';
//const API_URL = 'http://localhost:8090';

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
            
            // Debug: API'ye gönderilen parametreleri görüntüle
            console.log("API filtreleme parametreleri:", params);
            
            // Parametreleri kopyalayıp, gerekirse düzelt
            const queryParams = {
                page: params.page || 1,
                limit: params.limit || 10,
                status: params.status || 'pending',
                category: params.category || undefined,
                difficulty: params.difficulty || undefined,
                search: params.search || undefined,
                platform: params.platform || undefined,
                creatorId: params.creatorId || undefined
            };
            
            // game parametresini kontrol et ve doğru formatta olduğunu garantile
            if (params.game) {
                queryParams.game = params.game;
            }
            
            const response = await api.get('/challenges', { 
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: queryParams
            });
            
            // Debug: API yanıtını görüntüle
            console.log("API yanıtı (getChallenges):", response.data);
            
            return response.data;
        } catch (error) {
            console.error('Get Challenges Error:', error);
            throw error;
        }
    },

    // Kullanıcının kendi meydan okumalarını getir
    getMyChallenges: async (params = {}) => {
        try {
            const userData = localStorage.getItem('user');
            const parsedData = JSON.parse(userData);
            const token = parsedData.access_token;
            const userId = parsedData.user?.id || parsedData.id;
            
            if (!userId) {
                throw new Error('Kullanıcı ID bilgisi bulunamadı');
            }
            
            // Mevcut getChallenges metodunu çağırarak, creatorId parametresini ekleyerek kullanıyoruz
            return await challengeService.getChallenges({
                ...params, 
                creatorId: userId
            });
        } catch (error) {
            console.error('Kendi meydan okumalarını getirme hatası:', error);
            throw error;
        }
    },

    // Yeni meydan okuma oluştur
    createChallenge: async (challengeData) => {
        try {
            const token = challengeService.getToken();
            const requestData = {
                title: challengeData.title,
                game: challengeData.game,
                platform: challengeData.platform,
                entryFee: Number(challengeData.entryFee),
                prize: Number(challengeData.prize),
                duration: Number(challengeData.duration),
                description: challengeData.description,
                difficulty: "medium", // Şimdilik sabit
                category: "fps", // Şimdilik sabit
                maxParticipants: 2, // 1v1 için sabit
                communicationLink: challengeData.communicationLink || null,
                points: 100 // Varsayılan puan değeri
            };

            const response = await axios.post(
                `${API_URL}/challenges`,
                requestData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                const { challenge } = response.data.data;
                return {
                    success: true,
                    data: {
                        challenge: {
                            id: challenge.id,
                            title: challenge.title,
                            game: challenge.game,
                            platform: challenge.platform,
                            entryFee: challenge.entryFee,
                            prize: challenge.prize,
                            duration: challenge.duration,
                            description: challenge.description,
                            difficulty: challenge.difficulty,
                            category: challenge.category,
                            maxParticipants: challenge.maxParticipants,
                            communicationLink: challenge.communicationLink,
                            points: challenge.points
                        }
                    }
                };
            }

            return response.data;
        } catch (error) {
            console.error('Meydan okuma oluşturulamadı:', error.response?.data);
            const errorMessages = Array.isArray(error.response?.data?.message) 
                ? error.response.data.message.join('\n')
                : error.response?.data?.message || 'Meydan okuma oluşturulurken bir hata oluştu';
            throw new Error(errorMessages);
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

    // Challenge iptal etme
    cancelChallenge: async (challengeId) => {
        try {
            const token = challengeService.getToken();
            const response = await axios.post(
                `${API_URL}/challenges/${challengeId}/cancel`,
                {},
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Challenge iptal edilemedi:', error);
            if (error.response) {
                // Sunucudan dönen hata
                throw new Error(error.response.data.message || 'İptal işlemi başarısız oldu');
            } else if (error.request) {
                // İstek yapıldı ama yanıt alınamadı
                throw new Error('Sunucudan yanıt alınamadı');
            } else {
                // İstek oluşturulurken bir hata oldu
                throw new Error('İstek oluşturulurken hata: ' + error.message);
            }
        }
    },

    sendChallengeRequest: async (challengeId, { message, entryFee, prize }) => {
        try {
            const token = challengeService.getToken();
            const response = await axios.post(
                `${API_URL}/challenges/${challengeId}/requests`,
                {
                    message,
                    financials: {
                        entryFee,
                        prize
                    }
                },
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                const { request } = response.data.data;
                
                console.log('İstek gönderildi:', {
                    id: request.id,
                    message: request.message,
                    username: request.username,
                    katılımÜcreti: request.financials?.entryFee,
                    ödül: request.financials?.prize,
                    toplamHavuz: request.financials?.totalPrizePool
                });

                return {
                    success: true,
                    data: {
                        request: {
                            id: request.id,
                            message: request.message,
                            username: request.username,
                            financials: request.financials || {
                                entryFee: 0,
                                prize: 0,
                                totalPrizePool: 0
                            }
                        }
                    }
                };
            }

            return response.data;
        } catch (error) {
            console.error('İstek gönderilemedi:', error);
            throw new Error(
                error.response?.data?.message || 
                'İstek gönderilirken bir hata oluştu'
            );
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
                const { challenges } = response.data.data;
                
                // Debug için
                console.log('Gönderilen İstekler API Yanıtı:', challenges);
                
                return {
                    success: true,
                    data: {
                        challenges: challenges.map(item => ({
                            challenge: {
                                id: item.challenge.id,
                                title: item.challenge.title,
                                game: item.challenge.game,
                                platform: item.challenge.platform,
                                description: item.challenge.description,
                                difficulty: item.challenge.difficulty,
                                category: item.challenge.category,
                                points: item.challenge.points,
                                duration: item.challenge.duration,
                                maxParticipants: item.challenge.maxParticipants,
                                communicationLink: item.challenge.communicationLink,
                                status: item.challenge.status,
                                endDate: item.challenge.endDate,
                                creator: {
                                    id: item.challenge.creator.id,
                                    username: item.challenge.creator.username,
                                    avatarUrl: item.challenge.creator.avatarUrl
                                },
                                financials: {
                                    entryFee: item.challenge.financials?.entryFee || 0,
                                    prize: item.challenge.financials?.prize || 0,
                                    totalPrizePool: item.challenge.financials?.totalPrizePool || 0
                                },
                                participants: (item.challenge.participants || []).map(participant => ({
                                    id: participant.id,
                                    username: participant.username,
                                    avatarUrl: participant.avatarUrl,
                                    status: participant.status,
                                    joinedAt: participant.joinedAt
                                }))
                            },
                            requests: item.requests.map(request => ({
                                id: request.id,
                                message: request.message,
                                username: request.username || request.user?.username,
                                status: request.status || 'pending',
                                createdAt: request.createdAt,
                                user: {
                                    id: request.user?.id,
                                    username: request.user?.username,
                                    avatarUrl: request.user?.avatarUrl
                                }
                            }))
                        }))
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
                        console.log(`- ${request.username || request.user?.username}: ${request.message}`);
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
                                platform: item.challenge.platform,
                                description: item.challenge.description,
                                difficulty: item.challenge.difficulty,
                                category: item.challenge.category,
                                points: item.challenge.points,
                                duration: item.challenge.duration,
                                maxParticipants: item.challenge.maxParticipants,
                                communicationLink: item.challenge.communicationLink,
                                status: item.challenge.status,
                                endDate: item.challenge.endDate,
                                creator: {
                                    id: item.challenge.creator.id,
                                    username: item.challenge.creator.username,
                                    avatarUrl: item.challenge.creator.avatarUrl
                                },
                                financials: {
                                    entryFee: item.challenge.financials?.entryFee || 0,
                                    prize: item.challenge.financials?.prize || 0,
                                    totalPrizePool: item.challenge.financials?.totalPrizePool || 0
                                },
                                participants: (item.challenge.participants || []).map(participant => ({
                                    id: participant.id,
                                    username: participant.username,
                                    avatarUrl: participant.avatarUrl,
                                    status: participant.status,
                                    joinedAt: participant.joinedAt
                                }))
                            },
                            requests: item.requests.map(request => ({
                                id: request.id,
                                message: request.message,
                                username: request.username || request.user?.username,
                                status: request.status || 'pending',
                                createdAt: request.createdAt,
                                user: {
                                    id: request.user?.id,
                                    username: request.user?.username,
                                    avatarUrl: request.user?.avatarUrl
                                }
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

    declareMatchResult: async (matchId, resultData) => {
        try {
            const token = challengeService.getToken();

            // Ekran görüntüsünü sıkıştır (artık File/Blob objesi alıyor)
            const compressedScreenshot = await compressImage(resultData.screenshot);

            const payload = {
                matchId,
                result: {
                    ...resultData,
                    screenshot: compressedScreenshot, // Sıkıştırılmış ve base64 header'ı olmayan string
                    winnerUsername: resultData.outcome === 'win' ? resultData.winnerUsername : undefined
                }
            };

            const response = await axios.post(
                `${API_URL}/challenges/matches/${matchId}/result`,
                payload,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error('Sonuç bildirimi hatası:', error);
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
    },

    getMatchDetails: async (matchId) => {
        try {
            const token = challengeService.getToken();
            const response = await axios.get(
                `${API_URL}/challenges/matches/${matchId}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            if (response.data.success) {
                const matchData = response.data.data.match;
                console.log('Raw Match Data:', matchData);

                return {
                    success: true,
                    data: {
                        match: {
                            id: matchData.id,
                            game: matchData.game,
                            host: {
                                username: matchData.host.username,
                                avatarUrl: matchData.host.avatarUrl
                            },
                            opponent: {
                                username: matchData.opponent.username,
                                avatarUrl: matchData.opponent.avatarUrl
                            },
                            entryFee: matchData.financials.entryFee,
                            prize: matchData.financials.prize,
                            status: matchData.status,
                            pendingTime: matchData.pendingTime,
                            createdAt: matchData.createdAt,
                            results: matchData.results
                        }
                    }
                };
            }
            return response.data;
        } catch (error) {
            console.error('Maç detayları alınamadı:', error);
            throw error;
        }
    },

    // Yardımcı fonksiyon: Dosyayı base64'e çevirme
    convertFileToBase64: (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Base64 stringinin data:image/jpeg;base64, kısmını kaldır
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = (error) => reject(error);
        });
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

export const walletService = {
    getBalance: async () => {
        try {
            const response = await api.get('/balance');
            return response.data;
        } catch (error) {
            console.error('Bakiye bilgisi alınamadı:', error);
            throw error;
        }
    }
};
