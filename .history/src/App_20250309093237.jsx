import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import LandingPage from './Pages/LandingPage/LandingPage';
import RegisterPage from './Pages/RegisterPage/RegisterPage';
import ForgotPasswordPage from './Pages/PasswordPages/ForgotPasswordPage/ForgotPasswordPage';
import SetNewPasswordPage from './Pages/PasswordPages/SetNewPasswordPage/SetNewPasswordPage';
import PasswordResetSuccesfulPage from './Pages/PasswordPages/PasswordResetPage/PasswordResetSuccesfulPage';
import EmailConfirmationPage from './Pages/EmailConfirmationPage/EmailConfirmationPage';
import MainDashboard from './Pages/MainDashboard/MainDashboard';
import MeydanOkumalar from './Pages/MeydanOkumalar/MeydanOkumalar';
import PrivateRoute from './components/PrivateRoute';
import MatchesPage from './Pages/Matches/Matches';
import SalonPage from './Pages/SalonPage/Salon';
import HizliMeydanOkuPage from './Pages/HizliMeydanOkuPage/HizliMeydanOku';
import RulesAndFAQPage from './Pages/RulesAndFAQPage/RulesAndFAQPage';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  // Google Cloud Console'dan aldığınız Client ID'yi buraya ekleyin
  const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID";

  return (
    <div>
      <ToastContainer position="top-right" autoClose={3000} />
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Router>
          <Routes>
            {/* Ana sayfa yönlendirmesi */}
            <Route path="/" element={<LandingPage/>} />
            <Route path="/salon" element={<SalonPage/>} />
            
            {/* Diğer sayfalar */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<SetNewPasswordPage />} />
            <Route path="/reset-success" element={<PasswordResetSuccesfulPage />} />
            <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
            <Route path="/dashboard" element={<MainDashboard />} />
            <Route path="/meydanokumalar" element={
              <PrivateRoute>
                <MeydanOkumalar />
              </PrivateRoute>
            } />
            <Route path="/matches" element={
              <PrivateRoute>
                <MatchesPage />
              </PrivateRoute>
            } />
            <Route path="/salon/:matchId" element={
              <PrivateRoute>
                <SalonPage />
              </PrivateRoute>
            } />
            <Route path="/hizlimeydanoku" element={
              <PrivateRoute>
                <HizliMeydanOkuPage />
              </PrivateRoute>
            } />
            <Route path="/kurallar-ve-sss" element={<RulesAndFAQPage />} />
          </Routes>
        </Router>
      </GoogleOAuthProvider>
    </div>
  );
}

export default App;
