import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './Pages/LandingPage/LandingPage';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import ForgotPasswordPage from './Pages/PasswordPages/ForgotPasswordPage/ForgotPasswordPage';
import SetNewPasswordPage from './Pages/PasswordPages/SetNewPasswordPage/SetNewPasswordPage';
import PasswordResetSuccesfulPage from './Pages/PasswordPages/PasswordResetPage/PasswordResetSuccesfulPage';
import EmailConfirmationPage from './Pages/EmailConfirmationPage/EmailConfirmationPage';
import MainDashboard from './Pages/MainDashboard/MainDashboard';

function App() {
  // Google Cloud Console'dan aldığınız Client ID'yi buraya ekleyin
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          {/* Ana sayfa yönlendirmesi */}
          <Route path="/" element={<Navigate to="/landing" />} />
          <Route path="/landing" element={<LandingPage />} />
          
          {/* Diğer sayfalar */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<SetNewPasswordPage />} />
          <Route path="/reset-success" element={<PasswordResetSuccesfulPage />} />
          <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
          <Route path="/dashboard" element={<MainDashboard />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
