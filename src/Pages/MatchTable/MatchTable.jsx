import React, { useState, useEffect } from 'react';
import styles from './MatchTable.module.css';
import { Helmet } from 'react-helmet';

//import consol logos
import PSLogo from '../../images/konsolLogoları/PSlogo.png';
import XBOXLogo from '../../images/konsolLogoları/XBOXlogo.png';

const useWindowWidth = () => {
    const [width, setWidth] = useState(window.innerWidth);
    
    useEffect(() => {
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    return width;
};

const MatchTable = ({ matches, loading }) => {
    const windowWidth = useWindowWidth();
    const isMobile = windowWidth <= 768;

    if (loading) {
        return <div>Yükleniyor...</div>;
    }

    return (
        <div className={`${styles.tabloMaTekliflerim} ${isMobile ? styles.mobileTable : ''}`}>
            <Helmet>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
            </Helmet>
            <div className={styles.headMeydanOkumalar}>
                <div className={styles.kullaniciBilgi}>Kullanıcı</div>
                <div className={styles.oyunBilgi}>Oyun</div>
                <div className={styles.katilimUcreti}>Katılım Ücreti</div>
                <div className={styles.odul}>Ödül</div>
                <div className={styles.aksiyon}></div>
            </div>

            <div className={styles.tableRows}>
                {matches.map((match, index) => (
                    <div className={styles.rowMeydanOkumalar} key={index}>
                        <div className={styles.kullaniciBilgi}>
                            {!isMobile && (
                                <img 
                                    className={styles.avatarIcon} 
                                    src={match.avatar || '/avatar.png'} 
                                    alt={match.username} 
                                />
                            )}
                            <div className={styles.usernameWrapper}>
                                <div className={styles.username}>{match.username}</div>
                            </div>
                        </div>
                        <div className={styles.oyunBilgi}>
                            <div className={`${styles.oyunPlatform} ${isMobile ? styles.oyunPlatformMobile : ''}`}>
                                <span className={styles.gameNameSpan}>{match.game}</span>
                                <div className={`${styles.platformContainer} ${match.platform.includes('XBOX') ? styles.xboxContainer : ''}`}>
                                    {match.platform === 'PS5' || match.platform === 'PS4' ? (
                                        <img src={PSLogo} alt={match.platform} />
                                    ) : match.platform.includes('XBOX') ? (
                                        <img src={XBOXLogo} alt={match.platform} />
                                    ) : (
                                        <img src={match.platformImg} alt={match.platform} />
                                    )}
                                    <span>{match.platform}</span>
                                </div>
                            </div>
                        </div>
                        <div className={styles.katilimUcreti}>{match.entryFee}₺</div>
                        <div className={styles.odul}>{match.prize}₺</div>
                        <div className={styles.aksiyon}>
                            <button 
                                className={`${styles.istekGonder} ${isMobile ? styles.istekGonderMobile : ''}`}
                                onClick={match.onRequestClick}
                            >
                                İstek Gönder
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MatchTable; 