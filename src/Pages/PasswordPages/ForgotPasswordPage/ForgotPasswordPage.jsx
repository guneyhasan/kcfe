import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../../services/api';
import styles from './ForgotPasswordPage.module.css';
import LogoYazi from '../../../images/konsolclub_logo_beyaz_yazi.svg';
import LogoMavi from '../../../images/konsolclub_logo_mavi.png';

const ForgotPasswordPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleNavLoginClick = () => {
        navigate('/landing');
    };

    const handleNavSignupClick = () => {
        navigate('/register');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await authService.forgotPassword(email);
            setSuccess(true);
            // 3 saniye sonra login sayfasına yönlendir
            setTimeout(() => {
                navigate('/landing');
            }, 3000);
        } catch (err) {
            setError(err.message || 'E-posta gönderilemedi. Lütfen tekrar deneyin.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.ifremiUnuttum}>
            <div className={styles.landingPageHeader}>
                <div className={styles.logoSvg} >
                    <img className={styles.vectorIcon} alt="" src={LogoYazi} />
                </div>
                <div className={styles.textButtonParent}>
                    <div className={styles.textButton}>
                        <div className={styles.buttonBase}>
                            <div 
                                className={styles.text}
                                onClick={handleNavLoginClick}
                            >
                                Log in
                            </div>
                        </div>
                    </div>
                    <div className={styles.textButton}>
                        <div className={styles.buttonBase1}>
                            <div 
                                className={styles.text}
                                onClick={handleNavSignupClick}
                            >
                                Sign up
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.section1}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <img className={styles.image1Icon} alt="" src={LogoMavi} />
                            <div className={styles.textAndSupportingText}>
                                <div className={styles.text2}>Şifreni mi unuttun?</div>
                                <div className={styles.supportingText}>
                                    {success 
                                        ? 'E-posta gönderildi! Spam klasörünü kontrol etmeyi unutma.'
                                        : 'Email adresinizi giriniz.'
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={styles.inputFieldBase}>
                            <div className={styles.inputWithLabel}>
                                <div className={styles.label}>Email</div>
                                <div className={styles.input}>
                                    <div className={styles.content1}>
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            placeholder="isim@mail.com"
                                            className={styles.emailInput}
                                            disabled={loading || success}
                                        />
                                    </div>
                                </div>
                            </div>
                            {error && <div className={styles.error}>{error}</div>}
                            <div className={styles.hintText}>
                                Spam kutunuzu kontrol etmeyi unutmayın.
                            </div>
                        </div>
                        <div className={styles.content2}>
                            <div className={styles.actions}>
                                <div className={styles.buttonL1}>
                                    <button
                                        className={styles.resetPasswordButton}
                                        onClick={handleSubmit}
                                        disabled={loading || success || !email}
                                    >
                                        {loading ? 'Gönderiliyor...' : 'Şifre Sıfırlama Bağlantısı Gönder'}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.text5}>Hesabınız yok mu?</div>
                            <div className={styles.button}>
                                <div className={styles.buttonBase3}>
                                    <button
                                        className={styles.signupButton}
                                        onClick={handleNavSignupClick}
                                    >
                                        Kayıt ol
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.section1Child} />
        </div>
    );
};

export default ForgotPasswordPage;
