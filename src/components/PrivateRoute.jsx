import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
            console.log('No user data found in localStorage');
            return <Navigate to="/" />;
        }

        const user = JSON.parse(userStr);
        if (!user.access_token) {
            console.log('No access token found in user data');
            localStorage.removeItem('user'); // Geçersiz veriyi temizle
            return <Navigate to="/" />;
        }

        // Token varsa içeriği göster
        return children;
        
    } catch (error) {
        console.error('Error in PrivateRoute:', error);
        localStorage.removeItem('user'); // Hata durumunda temizle
        return <Navigate to="/" />;
    }
};

export default PrivateRoute; 