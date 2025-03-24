import { FunctionComponent, useCallback, useState, useEffect } from 'react';
import styles from './EmailConfirmationPage.module.css';
import logoYazi from '../../images/konsolclub_logo_beyaz_yazi.svg'
import logoMavi from '../../images/konsolclub_logo_mavi.png'
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';


const EmailConfirmationPage = () => {
    const [countdown, setCountdown] = useState(75);

    useEffect(() => {
        // Sayaç 0'dan büyükse her saniye azalt
        const timer = countdown > 0 && setInterval(() => {
            setCountdown(current => current - 1);
        }, 1000);

        // Component unmount olduğunda timer'ı temizle
        return () => clearInterval(timer);
    }, [countdown]);

    // Sayacı formatla (örn: "75 sn")
    const formatTime = (time) => {
        return `${time} sn`;
    };

    return (
        <div className={styles.dorulama}>
            <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Helmet>
            <div className={styles.landingPageHeader}>
                <div className={styles.logoSvg} >
                    <img className={styles.vectorIcon} alt="" src={logoYazi} />
                </div>
                <div className={styles.textButtonParent}>
                    <div className={styles.textButton}>
                        <div className={styles.buttonBase}>
                            <button
                                className={styles.loginHeaderButton}
                            >
                                Log in
                            </button>
                        </div>
                    </div>
                    <div className={styles.textButton}>
                        <div className={styles.buttonBase1}>
                            <button
                                className={styles.signupHeaderButton}
                            >
                                Sign up
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.section1}>
                <div className={styles.container}>
                    <div className={styles.content}>
                        <div className={styles.header}>
                            <img className={styles.image1Icon} alt="" src={logoMavi} />
                            <div className={styles.textAndSupportingText}>
                                <div className={styles.text2}>Doğrulama Kodu</div>
                            </div>
                        </div>
                        <div className={styles.signUpWithEmail}>
                            <div className={styles.textAndSupportingText}>
                                <div className={styles.tableHeader}>
                                    <div className={styles.emailAdresinizeKod}>Email adresinize kod gönderildi.</div>
                                </div>
                            </div>
                            <div className={styles.digits}>
                                <input
                                    type="text"
                                    maxLength="1"
                                    className={styles.digitInput}
                                    onChange={(e) => {
                                        if (e.target.value && e.target.nextElementSibling) {
                                            e.target.nextElementSibling.focus();
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Backspace' && !e.target.value && e.target.previousElementSibling) {
                                            e.target.previousElementSibling.focus();
                                        }
                                    }}
                                />
                                <input
                                    type="text"
                                    maxLength="1"
                                    className={styles.digitInput}
                                    onChange={(e) => {
                                        if (e.target.value && e.target.nextElementSibling) {
                                            e.target.nextElementSibling.focus();
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Backspace' && !e.target.value && e.target.previousElementSibling) {
                                            e.target.previousElementSibling.focus();
                                        }
                                    }}
                                />
                                <input
                                    type="text"
                                    maxLength="1"
                                    className={styles.digitInput}
                                    onChange={(e) => {
                                        if (e.target.value && e.target.nextElementSibling) {
                                            e.target.nextElementSibling.focus();
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Backspace' && !e.target.value && e.target.previousElementSibling) {
                                            e.target.previousElementSibling.focus();
                                        }
                                    }}
                                />
                                <input
                                    type="text"
                                    maxLength="1"
                                    className={styles.digitInput}
                                    onChange={(e) => {
                                        if (e.target.value && e.target.nextElementSibling) {
                                            e.target.nextElementSibling.focus();
                                        }
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Backspace' && !e.target.value && e.target.previousElementSibling) {
                                            e.target.previousElementSibling.focus();
                                        }
                                    }}
                                />
                            </div>
                            <div className={styles.tableTitleEmphasized1}>
                                <div className={styles.tableHeader1}>
                                    <div className={styles.emailAdresinizeKod}>
                                        {formatTime(countdown)}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.content1}>
                            <div className={styles.textAndSupportingText}>
                                <div className={styles.buttonL1}>
                                    <div className={styles.buttonBase2}>
                                        <button
                                            className={styles.verifyButton}
                                        >
                                            Doğrula
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.row}>
                            <div className={styles.text4}>Kod almadınız mı?</div>
                            <div className={styles.button}>
                                <div className={styles.buttonBase3}>
                                    <button
                                        className={styles.resendButton}
                                    >
                                        Tekrar Gönder
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

export default EmailConfirmationPage;
