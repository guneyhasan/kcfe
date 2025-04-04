import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './LandingPage.module.css';
import { authService } from '../../services/api';
import { useGoogleLogin } from '@react-oauth/google';

// Import Inter font
import { Helmet } from 'react-helmet';

// Görselleri import ediyoruz
import ps5Image from '../../images/ps5.png';
import ps4Image from '../../images/ps4.png';
import xboxOneImage from '../../images/XboxOne.png';
import xboxSeriesxImage from '../../images/xboxSeriesX.png';
import xboxSeriesSImage from '../../images/xboxSeriesS.png';
import fc25Image from '../../images/fc25.png';
import fc24Image from '../../images/fc24.png';
import nba2k25Image from '../../images/nba2k25.png';
import nba2k24Image from '../../images/nba2k24.png';
import konumImage from '../../images/konum.png';
import phoneImage from '../../images/phone.png';
import mailImage from '../../images/mail.png';
import wpImage from '../../images/wp.svg';
import xImage from '../../images/x.svg';
import discordImage from '../../images/discord.svg';
import instagramImage from '../../images/instagram.png';
import blueLogoImage from '../../images/konsolclub_logo_mavi.png';
import googleLogoImage from '../../images/googleIcon.png';
import konsolclubLogo from '../../images/konsolclub/konsolclub.png';
import chevronDownIcon from '../../images/chevron-down.svg';

const LandingPage = () => {
    const navigate = useNavigate();

    // Her bir akordiyonun durumunu takip etmek için state
    const [openAccordion, setOpenAccordion] = useState(null);
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showMobileLoginForm, setShowMobileLoginForm] = useState(false);

    // Akordiyonları ve içeriklerini tanımlayalım
    const accordionItems = [
        {
            id: 1,
            question: "Hangi oyunlar ve konsollar destekleniyor?",
            answer: "PlayStation 4, PlayStation 5, Xbox One ve Xbox Series X/S konsolları desteklenmektedir. FIFA, NBA 2K, Mortal Kombat gibi popüler oyunlar platformumuzda yer almaktadır."
        },
        {
            id: 2,
            question: "Maç sonuçlarını nasıl kaydedebilirim?",
            answer: "Maç bitiminde sonuç ekranının fotoğrafını çekerek sisteme yüklemeniz gerekmektedir."
        },
        {
            id: 3,
            question: "KONSOLCLUB'da param güvende mi?",
            answer: "Maç bitiminde sonuç ekranının fotoğrafını çekerek sisteme yüklemeniz gerekmektedir."
        },
        {
            id: 4,
            question: "Maç sonuçları hakkında bir anlaşmazlık olursa bu sorun nasıl giderilir??",
            answer: "Maç bitiminde sonuç ekranının fotoğrafını çekerek sisteme yüklemeniz gerekmektedir."
        },
        {
            id: 5,
            question: "Rakibim sonucu raporlamazsa ne olur?",
            answer: "Maç bitiminde sonuç ekranının fotoğrafını çekerek sisteme yüklemeniz gerekmektedir."
        },
        {
            id: 6,
            question: "Kazandığım ödülleri banka hesabıma çekebilir miyim?",
            answer: "Maç bitiminde sonuç ekranının fotoğrafını çekerek sisteme yüklemeniz gerekmektedir."
        },
        {
            id: 7,
            question: "Oynamak için ücret ödemem gerekiyor mu?",
            answer: "Maç bitiminde sonuç ekranının fotoğrafını çekerek sisteme yüklemeniz gerekmektedir."
        },
        {
            id: 8,
            question: "Maçlara katılabilmek için nelere sahip olmam lazım?",
            answer: "Maç bitiminde sonuç ekranının fotoğrafını çekerek sisteme yüklemeniz gerekmektedir."
        },
        {
            id: 9,
            question: "Bonuslar ile maça katılabilir miyim?",
            answer: "Maç bitiminde sonuç ekranının fotoğrafını çekerek sisteme yüklemeniz gerekmektedir."
        },
        {
            id: 10,
            question: "Bonus miktarlarını banka hesabıma çekebilir miyim?",
            answer: "Maç bitiminde sonuç ekranının fotoğrafını çekerek sisteme yüklemeniz gerekmektedir."
        },
    ];

    // Akordiyonu açıp kapatan fonksiyon
    const toggleAccordion = (id) => {
        setOpenAccordion(openAccordion === id ? null : id);
    };

    const handleNavLoginClick = () => {
        // Hem desktop hem de mobil görünüm için formu popup olarak göster
        setShowMobileLoginForm(!showMobileLoginForm);
    };

    const handleNavSignupClick = () => {
        navigate('/register');
    };

    const handleForgotPasswordClick = () => {
        navigate('/forgot-password');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(formData);
            if (response) {
                localStorage.setItem('user', JSON.stringify(response));
                navigate('/meydanokumalar');
            }
        } catch (err) {
            setError(err.message || 'Giriş başarısız oldu');
        } finally {
            setLoading(false);
        }
    };

    // Input değişikliklerini takip eden fonksiyon
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSignupClick = () => {
        navigate('/register');
    };

    // Google login fonksiyonu
    const googleLogin = useGoogleLogin({
        onSuccess: async (response) => {
            try {
                const result = await authService.googleLogin(response.credential);
                if (result.data) {
                    localStorage.setItem('user', JSON.stringify(result.data));
                    navigate('/meydanokumalar');
                }
            } catch (err) {
                setError('Google ile giriş başarısız oldu');
            }
        },
        onError: () => {
            setError('Google ile giriş başarısız oldu');
        }
    });

    // Overlay'e tıklama işleyicisi
    const handleOverlayClick = (e) => {
        // Overlay'e tıklandığında (formun kendisine değil) form kapanacak
        if (e.target.classList.contains(styles.overlay)) {
            setShowMobileLoginForm(false);
        }
    };

    return (
        <div className={styles.desktop}>
            <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Helmet>
            <div className={styles.dropdownHeaderNavigation}>
                <div className={styles.header}>
                    <div className={styles.container}>
                        <div className={styles.logoContainer}>
                            <b
                                className={styles.headerLogo}
                                onClick={() => navigate('/landing')}
                                style={{ cursor: 'pointer' }}
                            >
                                konsolclub
                            </b>
                        </div>
                        <div className={styles.navigationActions}>
                            <div className={styles.button}>
                                <div className={styles.buttonBase}>
                                    <div
                                        className={styles.text}
                                        onClick={handleNavLoginClick}
                                    >
                                        Giriş Yap
                                    </div>
                                </div>
                            </div>
                            <div className={styles.button1}>
                                <div className={styles.buttonBase1}>
                                    <div
                                        className={styles.text}
                                        onClick={handleNavSignupClick}
                                    >
                                        Kayıt Ol
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.headerSection}>
                <div className={styles.logIn}>
                    <div className={`${styles.content1} ${showMobileLoginForm ? styles.showMobileLogin : ''}`}>
                        <div className={styles.header1}>
                            <div className={styles.logo}>
                                <img className={styles.contentIcon1} alt="" src={konsolclubLogo} />
                            </div>
                            <div className={styles.textAndSupportingText}>
                                <div className={styles.text2}>Giriş Yap</div>
                                <div className={styles.supportingText}>Hoş Geldin! Lütfen giriş yapınız.</div>
                            </div>
                        </div>
                        <div className={styles.content2}>
                            <div className={styles.form}>
                                <div className={styles.inputField}>
                                    <div className={styles.inputWithLabel}>
                                        <div className={styles.label}>Kullanıcı Adı</div>
                                        <input
                                            type="text"
                                            name="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            placeholder="@kullanıcıadı"
                                        />
                                    </div>
                                </div>
                                <div className={styles.inputField}>
                                    <div className={styles.inputWithLabel}>
                                        <div className={styles.label}>Şifre</div>
                                        <input
                                            type="password"
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            className={styles.input}
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>
                            {error && <div className={styles.errorMessage}>{error}</div>}
                            <div className={styles.row}>
                                <div className={styles.checkbox}>
                                    <input
                                        type="checkbox"
                                        id="remember-me"
                                        className={styles.checkboxBase}
                                    />
                                    <label htmlFor="remember-me" className={styles.label}>Beni Hatırla</label>
                                </div>
                                <button
                                    className={styles.forgotPassword}
                                    onClick={handleForgotPasswordClick}
                                >
                                    Şifremi Unuttum
                                </button>
                            </div>
                            <div className={styles.actions}>
                                <button
                                    className={styles.signInButton}
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
                                </button>
                                <button
                                    className={styles.socialButton}
                                    onClick={() => googleLogin()}
                                    disabled={loading}
                                >
                                    <img className={styles.socialIcon} alt="" src={googleLogoImage} />
                                    {loading ? 'Giriş yapılıyor...' : 'Sign in with Google'}
                                </button>
                            </div>
                        </div>
                        <div className={styles.row1}>
                            <div className={styles.text9}>Hesabınız yok mu?</div>
                            <div className={styles.button2}>
                                <button
                                    className={styles.signupButton}
                                    onClick={handleSignupClick}
                                >
                                    <div className={styles.text6}>Kayıt ol</div>
                                </button>
                            </div>
                        </div>
                    </div>
                    {showMobileLoginForm && (
                        <div className={styles.overlay} onClick={handleOverlayClick}></div>
                    )}
                    <div className={styles.oyunYetenekIdirContainer}>
                        <p className={styles.oyunYetenekIdir}>Oyun Yetenek İşidir! Yeteneğini Göster Ödülleri Kap!</p>
                    </div>
                </div>
                <div className={styles.container1}>
                    <div className={styles.content5}>
                        <div className={styles.headingAndSupportingText}>
                            <div className={styles.inputField}>
                                <div className={styles.heading}>Senin Oyunun Senin Konsolun</div>
                            </div>
                            <div className={styles.supportingText1}>
                                <p className={styles.konsolunuSeOyununu}>KONSOLUNU SEÇ, OYUNUNU SEÇ,</p>
                                <p className={styles.blankLine}>OYUNA BAŞLA, SONUCU RAPORLA ve ÖDÜLÜ AL!</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.component2}>
                    <img className={styles.ps5white1Icon} alt="" src={ps5Image} />
                    <img className={styles.ps4white2Icon} alt="" src={ps4Image} />
                    <img className={styles.xboxOneWhite1} alt="" src={xboxOneImage} />
                    <img className={styles.xboxSeriesXSLogoWhite1} alt="" src={xboxSeriesxImage} />
                    <img className={styles.image10Icon} alt="" src={xboxSeriesSImage} />
                </div>
                <div className={styles.component1variant3}>
                    <img className={styles.image13Icon} alt="" src={fc25Image} />
                    <img className={styles.image12Icon} alt="" src={fc24Image} />
                    <img className={styles.image15Icon} alt="" src={nba2k25Image} />
                    <img className={styles.maxresdefault11} alt="" src={nba2k24Image} />
                </div>
            </div>
            <div className={styles.howItWork11}>
                <div className={styles.container2}>
                    <div className={styles.data01}>
                        <div className={styles.naslAlr}>Nasıl Çalışır?</div>
                        <div className={styles.maIlanlarOluturun}>Maç ilanları oluşturun, rakiplerinizle eşleşin ve kazandığınız ödülleri anında alın!</div>
                    </div>
                    <div className={styles.data02}>
                        <div className={styles.card01}>
                            <div className={styles.frame}>
                                <div className={styles.wrapper}>
                                    <b className={styles.b}>1</b>
                                </div>
                                <div className={styles.frameChild} />
                            </div>
                            <div className={styles.sitemizeYeOlun}>Sitemize üye olun ve kendi adınıza kayıtlı bir banka hesabından IBAN ile kolayca para yatırın.</div>
                        </div>
                        <div className={styles.card01}>
                            <div className={styles.frame}>
                                <div className={styles.frameDiv}>
                                    <b className={styles.b}>2</b>
                                </div>
                                <div className={styles.frameChild} />
                            </div>
                            <div className={styles.sitemizeYeOlun}>Yeni bir maç ilanı oluşturun ya da mevcut maç ilanlarından birine katılım isteği gönderin.</div>
                        </div>
                        <div className={styles.card01}>
                            <div className={styles.frame}>
                                <div className={styles.frameDiv}>
                                    <b className={styles.b}>3</b>
                                </div>
                                <div className={styles.frameChild} />
                            </div>
                            <div className={styles.sitemizeYeOlun}>Rakibinizle eşleşin ve maça başlayınç Canlı chat imkanıyla maç anında iletişim kurabilirsiniz.</div>
                        </div>
                        <div className={styles.card01}>
                            <div className={styles.frame}>
                                <div className={styles.frameDiv}>
                                    <b className={styles.b}>4</b>
                                </div>
                                <div className={styles.frameChild} />
                            </div>
                            <div className={styles.sitemizeYeOlun}>Maç bitiminde sonucu rapor edin, ödülünüz anında hesabınıza yüklensin. İstediğiniz zaman bakiyenizi kendi banka hesabınıza çekebilirsiniz.</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.divider} />
            <div className={styles.howItWork14}>
                <div className={styles.container2}>
                    <div className={styles.data011}>
                        <div className={styles.gvenlk}>GÜVENLİK</div>
                        <div className={styles.maSonularnnGvenlii}>Maç Sonuçlarının Güvenliği?</div>
                    </div>
                    <div className={styles.data021}>
                        <div className={styles.frame4}>
                            <div className={styles.card011}>
                                <div className={styles.parent}>
                                    <div className={styles.div}>
                                        <b className={styles.b4}>1</b>
                                    </div>
                                    <div className={styles.doruRaporParent}>
                                        <div className={styles.doruRapor}>DOĞRU RAPOR</div>
                                        <div className={styles.herIkiOyuncu}>Her iki oyuncu da kazananı raporladığında iki raporda aynı ise ödül kazananın hesabına hemen yansıtılır.</div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.card011}>
                                <div className={styles.parent}>
                                    <div className={styles.div}>
                                        <b className={styles.b4}>2</b>
                                    </div>
                                    <div className={styles.doruRaporParent}>
                                        <div className={styles.doruRapor}>EKSİK RAPOR</div>
                                        <div className={styles.herIkiOyuncu}>1 saat içerisinde kullanıcılardan sadece birisi sonucu raporlarsa o rapora göre ödül sahibi belirlenir.</div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.card011}>
                                <div className={styles.parent}>
                                    <div className={styles.div}>
                                        <b className={styles.b4}>3</b>
                                    </div>
                                    <div className={styles.doruRaporParent}>
                                        <div className={styles.doruRapor}>RAPOR YOK</div>
                                        <div className={styles.herIkiOyuncu}>1 saat içerisinde kullanıcılardan ikiside sonucu raporlamazsa maç berabere bitmiş sayılır.</div>
                                    </div>
                                </div>
                            </div>
                            <div className={styles.card011}>
                                <div className={styles.parent}>
                                    <div className={styles.div}>
                                        <b className={styles.b4}>4</b>
                                    </div>
                                    <div className={styles.doruRaporParent}>
                                        <div className={styles.doruRapor}>YANLIŞ RAPOR!</div>
                                        <div className={styles.herIkiOyuncu}>EĞER HER İKİ KULLANICI DA KAZANDIĞINI BEYAN EDERSE EKİBİMİZ HER İKİ KULLANICIYI GÖRÜNTÜLÜ OLARAK ARAYIP KONSOL EKRANINDA MAÇ GEÇMİŞİNİ GÖSTERMESİNİ İSTEYECEKİR. DOĞRULAMA YAPILIP KAZANAN BELİRLENİR. YANLIŞ RAPORDA BULUNAN KULLANICININ HESABI KAPATILIR VE HESAP BAKİYESİNE EL KONUR.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.divider1}>
                <div className={styles.container4}>
                    <img className={styles.dividerIcon} alt="" src="Divider.svg" />
                </div>
            </div>
            <div className={styles.contactUs24}>
                <div className={styles.container5}>
                    <div className={styles.textAndSupportingText}>
                        <div className={styles.skaSorulanSorular}>Sıkça Sorulan Sorular</div>
                        <div className={styles.yourQuestionsAnd}>Your questions and concerns are important to us, and we're dedicated to providing you with prompt and helpful responses. Whether you're inquiring about a service, need assistance with a product, or simply want to share your thoughts,</div>
                    </div>
                    <div className={styles.accordionParent}>
                        {accordionItems.map((item) => (
                            <div
                                key={item.id}
                                className={styles.inputField}
                                onClick={() => toggleAccordion(item.id)}
                            >
                                <div className={styles.header2}>
                                    <div className={styles.hangiOyunlarVeContainer}>
                                        <ol className={styles.hangiOyunlarVeKonsollarDes}>
                                            <li>{item.question}</li>
                                        </ol>
                                    </div>
                                    <img
                                        className={`${styles.chevronDownIcon} ${openAccordion === item.id ? styles.rotate : ''}`}
                                        alt=""
                                        src={chevronDownIcon}
                                    />
                                </div>
                                {openAccordion === item.id && (
                                    <div className={styles.accordionContent}>
                                        <p>{item.answer}</p>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.contactUs24}>
                <div className={styles.container6}>
                    <div className={styles.data01}>
                        <div className={styles.skaSorulanSorular}>Kurallar</div>
                        <div className={styles.yourQuestionsAnd}>Sizi ve karşı tarafı koruyan kurallar</div>
                    </div>
                    <div className={styles.buttonBase5}>
                        <div className={styles.text}>Kuralları Gör</div>
                    </div>
                </div>
            </div>
            <div className={styles.contactUs25}>
                <div className={styles.container5}>
                    <div className={styles.textAndSupportingText}>
                        <div className={styles.contactUs}>Contact Us</div>
                        <div className={styles.reachOutTo}>Reach Out To Us</div>
                        <div className={styles.yourQuestionsAnd1}>Your questions and concerns are important to us, and we're dedicated to providing you with prompt and helpful responses. Whether you're inquiring about a service, need assistance with a product, or simply want to share your thoughts,</div>
                    </div>
                    <div className={styles.data2}>
                        <div className={styles.card1}>
                            <div className={styles.frame5}>
                                <div className={styles.form}>
                                    <img className={styles.mapPin01LocationPlaceM} alt="" src={konumImage} />
                                    <div className={styles.frame7}>
                                        <div className={styles.address}>Address</div>
                                        <div className={styles.wedBeDelighted}>We'd be delighted to welcome you to our Head Office.</div>
                                    </div>
                                </div>
                                <div className={styles.frame8}>
                                    <div className={styles.frameChild1} />
                                    <div className={styles.oakLaneLakeside}>789 Oak Lane, Lakeside, TX 54321</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.card1}>
                            <div className={styles.frame5}>
                                <div className={styles.form}>
                                    <img className={styles.callPhoneTelephoneMobile} alt="" src={phoneImage} />
                                    <div className={styles.frame7}>
                                        <div className={styles.address}>WhatsApp</div>
                                        <div className={styles.wedBeDelighted}>We'd be delighted to welcome you to our Head Office.</div>
                                    </div>
                                </div>
                                <div className={styles.frame8}>
                                    <div className={styles.frameChild1} />
                                    <div className={styles.oakLaneLakeside}>1800-2541-2541, 1800-14-0147</div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.card1}>
                            <div className={styles.frame5}>
                                <div className={styles.form}>
                                    <img className={styles.mapPin01LocationPlaceM} alt="" src={mailImage} />
                                    <div className={styles.frame7}>
                                        <div className={styles.address}>Email Address</div>
                                        <div className={styles.wedBeDelighted}>Email us using our online chat system for quick and efficient support.</div>
                                    </div>
                                </div>
                                <div className={styles.frame8}>
                                    <div className={styles.frameChild1} />
                                    <div className={styles.oakLaneLakeside}>pagedone1234@gmail.com</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.footer16}>
                <div className={styles.container8}>
                    <div className={styles.row}>
                        <div className={styles.pagedoneLogoParent}>
                            <img className={styles.pagedoneLogoIcon} alt="" src={konsolclubLogo} />
                            <div className={styles.text}>© 2023 KONSOLCLUB. Tüm hakları saklıdır.</div>
                        </div>
                        <div className={styles.frameParent}>
                            <div className={styles.socialMediaWrapper}>
                                <img className={styles.socialMediaIcon} alt="" src={wpImage} />
                            </div>
                            <div className={styles.socialMediaContainer}>
                                <img className={styles.socialMediaIcon1} alt="" src={xImage} />
                            </div>
                            <div className={styles.logoWrapper}>
                                <img className={styles.logoIcon} alt="" src={discordImage} />
                            </div>
                            <div className={styles.socialMediaContainer}>
                                <img className={styles.socialMediaIcon1} alt="" src={instagramImage} />
                            </div>
                        </div>
                    </div>
                    <div className={styles.data21}>

                        <div className={styles.mavesports2025All}>©mavesports 2025, All rights reserved.</div>
                    </div>
                </div>
            </div>
        </div>);
};

export default LandingPage;
