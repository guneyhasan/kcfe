import { useState, useEffect } from 'react';
import styles from './Matches.module.css';
import Sidebar from '../SideBar/Sidebar';
import PageHeader from '../PageHeader/PageHeader';
import declineIcone from '../../images/Maclarım/declineCross.svg';
import checkIcon from '../../images/icons/check-icon.svg';
import { challengeService } from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

//import consol logos
import PSLogo from '../../images/konsolLogoları/PSlogo.png';
import XBOXLogo from '../../images/konsolLogoları/XBOXlogo.png';

// Import game images
import fc24Image from '../../images/Games/fc24.jpeg';
import fc25Image from '../../images/Games/fc25.jpeg';
import nba2k24Image from '../../images/Games/nba2k24.png';
import nba2k25Image from '../../images/Games/nba2k25.jpeg';

const Matches = () => {
    const [gelenIstekler, setGelenIstekler] = useState([]);
    const [gidenIstekler, setGidenIstekler] = useState([]);
    const [selectedTab, setSelectedTab] = useState('gelen');
    const [loading, setLoading] = useState(true);
    const [challenges, setChallenges] = useState([]);
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [activeMatches, setActiveMatches] = useState([]);
    const [completedMatches, setCompletedMatches] = useState([]);
    const navigate = useNavigate();

    // İstek iptal etme fonksiyonu
    const handleCancelRequest = async (requestId) => {
        try {
            const response = await challengeService.cancelRequest(requestId);
            if (response.success) {
                toast.success('İstek başarıyla iptal edildi');
                loadRequests();
            }
        } catch (error) {
            console.error('İstek iptal edilirken hata:', error);
            toast.error('İstek iptal edilirken bir hata oluştu');
        }
    };

    // İstek kabul etme fonksiyonu
    const handleAcceptRequest = async (requestId) => {
        try {
            const response = await challengeService.acceptRequest(requestId);
            if (response.success) {
                const { match } = response.data;
                console.log('Maç oluşturuldu:', {
                    id: match.id,
                    game: match.game,
                    host: match.host.username,
                    opponent: match.opponent.username,
                    prize: match.prize
                });
                toast.success('İstek başarıyla kabul edildi ve maç oluşturuldu');
                
                // Sayfayı yenile
                setTimeout(() => {
                    window.location.reload();
                }, 1000);
            }
        } catch (error) {
            console.error('İstek kabul edilirken hata:', error);
            toast.error(error.message || 'İstek kabul edilirken bir hata oluştu');
        }
    };

    // İstek reddetme fonksiyonu
    const handleDeclineRequest = async (requestId) => {
        try {
            const response = await challengeService.declineRequest(requestId);
            if (response.success) {
                toast.success('İstek başarıyla reddedildi');
                loadRequests();
            }
        } catch (error) {
            console.error('İstek reddedilirken hata:', error);
            toast.error('İstek reddedilirken bir hata oluştu');
        }
    };

    // İstekleri yükleme fonksiyonu
    const loadRequests = async () => {
        try {
            setLoading(true);
            console.log('İstekler yükleniyor... Tab:', selectedTab);

            if (selectedTab === 'gelen') {
                const response = await challengeService.getMyRequests();
                console.log('Gelen istekler response:', response);

                if (response.success) {
                    const { challenges } = response.data;
                    
                    const allRequests = challenges.reduce((acc, item) => {
                        if (!item.requests || !Array.isArray(item.requests)) return acc;
                        
                        // API yanıtını konsola yazdır
                        console.log("Challenge item:", JSON.stringify(item, null, 2));
                        
                        const requestsWithChallenge = item.requests.map(request => {
                            // Finansal bilgileri alın (entryFee ve prize)
                            const entryFee = item.challenge?.financials?.entryFee || 0;
                            const platform = item.challenge?.platform;
                            
                            // Prize her zaman entryFee'nin 1.8 katı olacak
                            const prize = entryFee * 1.8;
                            
                            return {
                                id: request.id,
                                username: request.user?.username || request.username || 'İsimsiz Kullanıcı',
                                avatar: request.user?.avatarUrl || '/avatar.png',
                                message: request.message || '',
                                status: request.status || 'pending',
                                game: item.challenge?.game || 'Oyun Belirtilmemiş',
                                platform: platform || '',
                                entryFee: entryFee,
                                prize: prize,
                                duration: item.challenge?.duration || '0',
                                // Yeni API yapısı için ek alanlar
                                difficulty: item.challenge?.difficulty || '',
                                category: item.challenge?.category || '',
                                points: item.challenge?.points || 0,
                                maxParticipants: item.challenge?.maxParticipants || 0,
                                communicationLink: item.challenge?.communicationLink || '',
                                challengeId: item.challenge?.id || 0,
                                creatorName: item.challenge?.creator?.username || '',
                                creatorAvatar: item.challenge?.creator?.avatarUrl || null,
                                // İstek için aksiyonlar
                                onAcceptClick: () => handleAcceptRequest(request.id),
                                onDeclineClick: () => handleDeclineRequest(request.id)
                            };
                        });
                        return [...acc, ...requestsWithChallenge];
                    }, []);

                    console.log('İşlenmiş gelen istekler:', allRequests);
                    setGelenIstekler(allRequests);
                }
            } else if (selectedTab === 'giden') {
                const response = await challengeService.getSentRequests();
                console.log('Giden istekler response:', response);

                if (response.success) {
                    const { challenges } = response.data;
                    
                    const allRequests = challenges.reduce((acc, item) => {
                        if (!item.requests || !Array.isArray(item.requests)) return acc;
                        
                        // API yanıtını konsola yazdır
                        console.log("Giden istek challenge item:", JSON.stringify(item, null, 2));
                        
                        const requestsWithChallenge = item.requests.map(request => {
                            // Finansal bilgileri alın (entryFee ve prize)
                            const entryFee = item.challenge?.financials?.entryFee || 0;
                            const platform = item.challenge?.platform;
                            
                            // Prize her zaman entryFee'nin 1.8 katı olacak
                            const prize = entryFee * 1.8;
                            
                            return {
                                id: request.id,
                                username: item.challenge?.creator?.username || 'İsimsiz Kullanıcı',
                                avatar: item.challenge?.creator?.avatarUrl || '/avatar.png',
                                message: request.message || '',
                                status: request.status || 'pending',
                                game: item.challenge?.game || 'Oyun Belirtilmemiş',
                                platform: platform || '',
                                entryFee: entryFee,
                                prize: prize,
                                duration: item.challenge?.duration || '0',
                                // Yeni API yapısı için ek alanlar
                                difficulty: item.challenge?.difficulty || '',
                                category: item.challenge?.category || '',
                                points: item.challenge?.points || 0,
                                maxParticipants: item.challenge?.maxParticipants || 0,
                                communicationLink: item.challenge?.communicationLink || '',
                                challengeId: item.challenge?.id || 0,
                                // İstek için aksiyonlar
                                onCancelClick: () => handleCancelRequest(request.id)
                            };
                        });
                        return [...acc, ...requestsWithChallenge];
                    }, []);

                    console.log('İşlenmiş giden istekler:', allRequests);
                    setGidenIstekler(allRequests);
                }
            }
        } catch (error) {
            console.error('İstekler yüklenirken hata:', error);
            toast.error('İstekler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    // Aktif maçları getirme fonksiyonu
    const loadActiveMatches = async () => {
        try {
            setLoading(true);
            const response = await challengeService.getMyActiveMatches();
            
            if (response.success) {
                const { matches, total } = response.data;
                console.log(`Toplam ${total} maç bulundu`);
                
                // Process all matches and calculate prize as 1.8 times entry fee
                const processedMatches = matches.map(match => {
                    const entryFee = match.entryFee || 0;
                    const prize = Math.round(entryFee * 1.8);
                    
                    return {
                        ...match,
                        prize: prize
                    };
                });
                
                // Filter active matches
                const active = processedMatches.filter(match => match.status !== 'completed');
                setActiveMatches(active);
                
                // Filter completed matches
                const completed = processedMatches.filter(match => match.status === 'completed');
                setCompletedMatches(completed);
            }
        } catch (error) {
            console.error('Maçlar yüklenirken hata:', error);
            toast.error('Maçlar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    // Kullanıcı ID'sini al
    const getUserId = () => {
        const userData = localStorage.getItem('user');
        if (!userData) return null;
        
        try {
            const parsedData = JSON.parse(userData);
            return parsedData.user?.id;
        } catch (error) {
            console.error('localStorage user verisi parse edilemedi:', error);
            return null;
        }
    };

    // Kullanıcı username'ini al
    const getUserUsername = () => {
        const userData = localStorage.getItem('user');
        if (!userData) return null;
        
        try {
            const parsedData = JSON.parse(userData);
            return parsedData.user?.username;
        } catch (error) {
            console.error('localStorage user verisi parse edilemedi:', error);
            return null;
        }
    };

    // Oyun ikonunu getir
    const getGameIcon = (gameName) => {
        switch (gameName) {
            case 'FC24':
                return fc24Image;
            case 'FC25':
                return fc25Image;
            case 'NBA2K24':
                return nba2k24Image;
            case 'NBA2K25':
                return nba2k25Image;
            default:
                return null;
        }
    };

    // Kalan süre formatı: 59:59
    const formatTime = (timeInSeconds) => {
        const minutes = Math.floor(timeInSeconds / 60);
        const seconds = timeInSeconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    };
    
    // Kalan süreyi hesapla
    const calculateRemainingTime = (createdAt) => {
        if (!createdAt) return '00:00';
        
        const createdAtDate = new Date(createdAt);
        const now = new Date();
        
        // Oluşturulma zamanından bu yana geçen süreyi hesapla (saniye cinsinden)
        const elapsedTimeInSeconds = Math.floor((now - createdAtDate) / 1000);
        
        // 1 saat = 3600 saniye, kalan süreyi hesapla
        const remainingTime = Math.max(3600 - elapsedTimeInSeconds, 0);
        
        return formatTime(remainingTime);
    };

    // Check if time is low (less than 5 minutes)
    const isLowTime = (timeString) => {
        if (!timeString) return false;
        
        // If format is MM:SS, check if minutes is less than 5
        const parts = timeString.split(':');
        if (parts.length === 2) {
            const minutes = parseInt(parts[0], 10);
            return minutes < 5;
        }
        
        return false;
    };

    // İstekleri yükle
    useEffect(() => {
        loadRequests();
    }, [selectedTab]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        loadActiveMatches();
    }, []);

    // Calculate and update remaining time for all matches
    useEffect(() => {
        if (activeMatches.length > 0 || completedMatches.length > 0) {
            // Update active matches with remaining time
            const updateMatchesWithTime = (matches) => {
                return matches.map(match => ({
                    ...match,
                    remainingTime: calculateRemainingTime(match.createdAt)
                }));
            };
            
            // Initial update
            setActiveMatches(updateMatchesWithTime(activeMatches));
            setCompletedMatches(updateMatchesWithTime(completedMatches));
            
            // Set up timer to update remaining time every second
            const timer = setInterval(() => {
                setActiveMatches(prevMatches => updateMatchesWithTime(prevMatches));
                setCompletedMatches(prevMatches => updateMatchesWithTime(prevMatches));
            }, 1000); // Update every second for continuous countdown
            
            return () => clearInterval(timer);
        }
    }, [activeMatches.length, completedMatches.length]);

    // Tab değiştirme fonksiyonu
    const handleTabChange = (tab) => {
        console.log('Tab değişti:', tab);
        setSelectedTab(tab);
    };

    // Meydan okuma seçme fonksiyonu
    const handleChallengeSelect = (challengeId) => {
        setSelectedChallenge(challengeId);
        // Meydan okuma değiştiğinde loading state'ini true yap
        setLoading(true);
    };

    const renderCard = (card, index) => {
        // Önceden iki farklı stil kullanılmıştı: mobileCard & mobileCard1, buttonBase & buttonBase1
    // Dinamik içerikte örneğin index'e göre ya da veri üzerinden farklı stil verilebilir.
    // Burada örnek olması açısından index değerine göre farklı className atanıyor.
    const cardClass = index % 2 === 0 ? styles.mobileCard : styles.mobileCard1;
    const buttonClass = index % 2 === 0 ? styles.buttonBase : styles.buttonBase1;

    return (
      <div key={card.id} className={cardClass}>
        <div className={styles.cardImageWrapper}>
          <div className={styles.cardImage}>
            <div className={styles.oyunAd}>
              <img
                className={styles.oyunAdChild}
                alt={card.gameTitle}
                src={card.gameImage}
              />
              <div className={styles.nba2k25}>{card.gameTitle}</div>
            </div>
            <div className={styles.dakikaWrapper}>
              <div className={styles.dakika}>{`⏱ ${card.duration}`}</div>
            </div>
          </div>
        </div>
        <div className={styles.header}>
          <div className={styles.oyuncu2Parent}>
            <div className={styles.oyuncu2}>
              <div className={styles.oyuncu1Info}>
                <div className={styles.username2}>{card.player1.username}</div>
                <div className={styles.konsol}>{card.player1.platform}</div>
              </div>
              <img
                className={styles.avatarIcon1}
                alt={card.player1.username}
                src={card.player1.avatar}
              />
            </div>
            <div className={styles.vs}>
              <div className={styles.vs1}>VS</div>
            </div>
            <div className={styles.oyuncu3}>
              <img
                className={styles.avatarIcon1}
                alt={card.player2.username}
                src={card.player2.avatar}
              />
              <div className={styles.oyuncu1Info1}>
                <div className={styles.username3}>{card.player2.username}</div>
                <div className={styles.konsol1}>{card.player2.platform}</div>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.cret}>
            <div className={styles.badgeBaseWrapper}>
              <div className={styles.badgeBase}>
                <div className={styles.katlmCreti}>{card.entryFee}</div>
              </div>
            </div>
            <div className={styles.badgeBaseContainer}>
              <div className={styles.badgeBase}>
                <div className={styles.bakiye250Tl}>{card.reward}</div>
              </div>
            </div>
          </div>
          <div className={buttonClass}>
            <div className={styles.text1}>{card.buttonText}</div>
          </div>
        </div>
      </div>
    );
  };

    const renderTable = (requests) => (
        <div className={styles.tabloMaTekliflerim}>
            <div className={styles.headMeydanOkumalar}>
                <div className={styles.kullaniciBilgi}>Kullanıcı</div>
                <div className={styles.oyunBilgi}>Oyun</div>
                <div className={styles.katilimUcreti}>Katılım Ücreti</div>
                <div className={styles.odul}>Ödül</div>
                <div className={styles.aksiyon}></div>
            </div>
            {(requests || []).map((request) => (
                <div key={request.id} className={styles.rowMeydanOkumalar}>
                    <div className={styles.kullaniciBilgi}>
                        <img 
                            className={styles.avatarIcon} 
                            alt={request.user?.username || request.username || 'Kullanıcı'} 
                            src={request.user?.avatarUrl || request.avatar || '/avatar.png'} 
                        />
                        <span className={styles.username}>{request.user?.username || request.username || 'İsimsiz Kullanıcı'}</span>
                    </div>
                    <div className={styles.oyunBilgi}>
                        <div className={styles.oyunPlatform}>
                            <span className={styles.gameNameSpan}>{request.game || 'Oyun Belirtilmemiş'}</span>
                            {request.platform ? (
                                <div className={`${styles.platformContainer} ${(request.platform || '').includes('XBOX') ? styles.xboxContainer : ''}`}>
                                    {(request.platform || '').includes('PS') ? (
                                        <img src={PSLogo} alt={request.platform} />
                                    ) : (request.platform || '').includes('XBOX') ? (
                                        <img src={XBOXLogo} alt={request.platform} />
                                    ) : (
                                        <span className={styles.platformIcon}>🎮</span>
                                    )}
                                    <span>{request.platform}</span>
                                </div>
                            ) : null}
                        </div>
                    </div>
                    <div className={styles.katilimUcreti}>{typeof request.entryFee === 'number' ? `${request.entryFee}₺` : '0₺'}</div>
                    <div className={styles.odul}>{typeof request.prize === 'number' ? `${Math.round(request.prize)}₺` : '0₺'}</div>
                    <div className={styles.aksiyon}>
                        {selectedTab === 'gelen' ? (
                            <div className={styles.buttonBaseParent}>
                                <button 
                                    className={styles.istekGonder} 
                                    onClick={request.onAcceptClick}
                                    disabled={request.status === 'accepted'}
                                >
                                    <img 
                                        className={styles.checkIcon} 
                                        alt="" 
                                        src={checkIcon} 
                                    />
                                    <span className={styles.buttonText}>
                                        {request.status === 'accepted' ? 'Onaylandı' : 'Onayla'}
                                    </span>
                                </button>
                                <button 
                                    className={styles.buttonDecline} 
                                    onClick={request.onDeclineClick}
                                    disabled={request.status === 'accepted' || request.status === 'rejected'}
                                >
                                    <img 
                                        className={styles.declineButtonImage} 
                                        alt="" 
                                        src={declineIcone} 
                                    />
                                </button>
                            </div>
                        ) : (
                            <button 
                                className={styles.buttonCancel} 
                                onClick={request.onCancelClick}
                                disabled={request.status === 'accepted' || request.status === 'rejected'}
                            >
                                {request.status === 'accepted' ? 'Onaylandı' : request.status === 'rejected' ? 'Reddedildi' : 'İptal Et'}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );

    const renderMatchCard = (match) => {
        // Get current user data
        const currentUsername = getUserUsername();
        const currentUserId = getUserId();
        
        return (
            <div key={match.id} className={styles.mobileCard}>
                <div className={styles.cardImageWrapper}>
                    <div className={styles.cardImage}>
                        {/* Arka plan olarak oyun resmi ekle */}
                        <div 
                            className={styles.gameBackgroundImage} 
                            style={{ 
                                backgroundImage: `url(${
                                    match.game === 'FC 25' ? fc25Image : 
                                    match.game === 'FC 24' ? fc24Image :
                                    match.game === 'NBA 2K24' ? nba2k24Image :
                                    match.game === 'NBA 2K25' ? nba2k25Image :
                                    (match.gameImage || 'default-game.png')
                                })` 
                            }}>
                            <div className={styles.darkenOverlay}></div>
                            <div className={styles.vignetteOverlay}></div>
                            <div className={styles.contentWrapper}>
                                <div className={styles.oyunAd}>
                                    <img
                                        className={styles.oyunAdChild}
                                        alt={match.game}
                                        src={
                                            match.game === 'FC 25' ? fc25Image : 
                                            match.game === 'FC 24' ? fc24Image :
                                            match.game === 'NBA 2K24' ? nba2k24Image :
                                            match.game === 'NBA 2K25' ? nba2k25Image :
                                            (match.gameImage || 'default-game.png')
                                        }
                                    />
                                    <div className={styles.nba2k25}>{match.game}</div>
                                </div>
                                <div className={styles.dakikaWrapper}>
                                    <div 
                                        className={`${styles.dakika} ${isLowTime(match.remainingTime) ? styles.lowTime : ''}`} 
                                        style={{ 
                                            color: (match.remainingTime && match.remainingTime.startsWith("00")) ? '#ff6b6b' : '#fff' 
                                        }}
                                    >
                                        ⏱ {match.remainingTime || calculateRemainingTime(match.createdAt)} dakika
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.header}>
                    <div className={styles.oyuncu2Parent}>
                        <div className={styles.oyuncu2}>
                            <div className={styles.oyuncu1Info}>
                                <div className={styles.username2}>{match.host.username}</div>
                                <div className={styles.konsol}>{match.platform}</div>
                            </div>
                            <img
                                className={styles.avatarIcon1}
                                alt={match.host.username}
                                src={match.host.avatarUrl || '/avatar.png'}
                            />
                        </div>
                        <div className={styles.vs}>
                            <div className={styles.vs1}>VS</div>
                        </div>
                        <div className={styles.oyuncu3}>
                            <img
                                className={styles.avatarIcon1}
                                alt={match.opponent.username}
                                src={match.opponent.avatarUrl || '/avatar.png'}
                            />
                            <div className={styles.oyuncu1Info1}>
                                <div className={styles.username3}>{match.opponent.username}</div>
                                <div className={styles.konsol1}>{match.platform}</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.row}>
                    <div className={styles.cret}>
                        <div className={styles.badgeBaseWrapper}>
                            <div className={styles.badgeBase}>
                                <div className={styles.katlmCreti}>{match.entryFee}₺ Katılım Ücreti</div>
                            </div>
                        </div>
                        <div className={styles.badgeBaseContainer}>
                            <div className={styles.badgeBase}>
                                <div className={styles.bakiye250Tl}>{match.prize}₺ Ödül</div>
                            </div>
                        </div>
                    </div>
                    {match.status !== 'completed' && (
                        <>
                            {match.results && (
                                // Kullanıcı maçı raporladıysa
                                ((currentUsername === match.host.username && match.results.hostDeclared !== null) || 
                                (currentUsername === match.opponent.username && match.results.opponentDeclared !== null))
                            ) ? (
                                <div className={`${styles.buttonBase} ${styles.pendingVerification}`}>
                                    <div className={styles.text1}>Doğrulama bekleniyor</div>
                                </div>
                            ) : (
                                <div 
                                    className={styles.buttonBase}
                                    onClick={() => navigate(`/salon/${match.id}`)}
                                >
                                    <div className={styles.text1}>Salona Git</div>
                                </div>
                            )}
                        </>
                    )}
                </div>
                {match.status === 'completed' && (
                    <div className={styles.matchResult}>
                        <div className={styles.winner}>
                            Kazanan: {match.results.hostDeclared === match.host.id ? 
                                match.host.username : match.opponent.username}
                        </div>
                    </div>
                )}
            </div>
        );
    };

  	return (
    <>
      <div className={styles.malarmGelenStekler}>
        <Helmet>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        </Helmet>
        <Sidebar />
        <div className={styles.container}>
          <PageHeader />
          <div className={styles.mobileCardParent}>
            {loading ? (
              <div className={styles.loading}>Yükleniyor...</div>
            ) : activeMatches.length > 0 ? (
              activeMatches.map(match => renderMatchCard(match))
            ) : (
              <div className={styles.noMatches}>Aktif maç bulunamadı</div>
            )}
          </div>
          <div className={styles.containerInner}>
            <div className={styles.frameContainer}>
              <div className={styles.headerMaTekliflerimParent}>
                <div className={styles.headerMaTekliflerim}>
                  <div className={styles.stekler}>İstekler</div>
                  <div className={styles.frameGroup}>
                    <div 
                      className={`${styles.gelenIsteklerWrapper} ${selectedTab === 'gelen' ? styles.activeTab : ''}`} 
                      onClick={() => handleTabChange('gelen')}
                    >
                      <div className={styles.gelenIstekler}>Gelen istekler</div>
                    </div>
                    <div 
                      className={`${styles.gidenIsteklerWrapper} ${selectedTab === 'giden' ? styles.activeTab : ''}`} 
                      onClick={() => handleTabChange('giden')}
                    >
                      <div className={styles.gelenIstekler}>Giden istekler</div>
                    </div>
                  </div>
                </div>
                {loading ? (
                  <div className={styles.loading}>Yükleniyor...</div>
                ) : (
                  selectedTab === 'gelen' ? renderTable(gelenIstekler) : renderTable(gidenIstekler)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Matches;
