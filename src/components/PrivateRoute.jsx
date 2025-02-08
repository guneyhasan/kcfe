import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        // Kullanıcı giriş yapmamışsa landing sayfasına yönlendir
        return <Navigate to="/landing" />;
    }

    // Kullanıcı giriş yapmışsa istenen sayfayı göster
    return children;
};

export default PrivateRoute; 