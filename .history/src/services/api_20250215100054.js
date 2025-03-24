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
    getChallenges: async (params = {}) => {
        try {
            const response = await api.get('http://localhost:8090/challenges', { 
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
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
            const token = localStorage.getItem('token');
            const response = await axios.post(
                `/challenges/${challengeId}/requests`,
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
            if (error.response) {
                throw new Error(error.response.data.message);
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
                    Authorization: `Bearer ${localStorage.getItem('token')}`
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
                    Authorization: `Bearer ${localStorage.getItem('token')}`
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
                    Authorization: `Bearer ${localStorage.getItem('token')}`
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
            const response = await api.get(`${API_URL}/matches`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                },
                params: { status }
            });
            return response.data;
        } catch (error) {
            console.error('Get Matches Error:', error);
            throw error;
        }
    },

    // Maç sonucunu bildir
    completeMatch: async (matchId, winnerId) => {
        try {
            const response = await api.post(`${API_URL}/matches/${matchId}/complete`, 
                { winnerId },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Complete Match Error:', error);
            throw error;
        }
    }
}; 