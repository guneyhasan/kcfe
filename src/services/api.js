import axios from 'axios';

const API_URL = 'http://localhost:8090'; // Port numarasını 8090 olarak güncelledik

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

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

    login: async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            if (response.data.access_token) {
                localStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
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