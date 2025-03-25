import { FunctionComponent, useCallback, useState, useEffect } from 'react';
import styles from './Salon.module.css';
import Sidebar from '../SideBar/Sidebar';
import PageHeader from '../PageHeader/PageHeader';
import HeadphoneImage from '../../images/Salon/headphones.svg';
import SendImage from '../../images/Salon/send.svg';
import MatchDetails from '../../components/MatchDetails/MatchDetails';
import SendResult from '../../components/SendResult/SendResult';
import { challengeService } from '../../services/api';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import PSlogo from '../../images/konsolLogoları/PSlogo.png';
import Xboxlogo from '../../images/konsolLogoları/XBOXlogo.png';

// Import game images
import fc24Image from '../../images/Games/fc24.jpeg';
import fc25Image from '../../images/Games/fc25.jpeg';
import nba2k24Image from '../../images/Games/nba2k24.png';
import nba2k25Image from '../../images/Games/nba2k25.jpeg';

const MalarmSalon = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [matchStarted, setMatchStarted] = useState(false);
  const [showSendResult, setShowSendResult] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [remainingTimeInSeconds, setRemainingTimeInSeconds] = useState(3600); // 1 saat = 3600 saniye
  const [matchData, setMatchData] = useState({
    id: null,
    gameName: "",
    remainingTime: "",
    createdAt: null,
    player1: {
      username: "",
      avatarUrl: null,
      ps5Id: "",
      consoleImage: PSlogo
    },
    player2: {
      username: "",
      avatarUrl: null,
      ps5Id: "",
      consoleImage: PSlogo
    },
    entryFee: 0,
    prize: 0
  });

  // Kalan süre formatı: 59:59
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    const fetchMatchDetails = async () => {
      try {
        setLoading(true);
        const response = await challengeService.getMatchDetails(matchId);
        
        if (response.success) {
          const matchData = response.data.match;
          
          // Eğer maç tamamlanmışsa, maçlar sayfasına yönlendir
          if (matchData.status === 'completed') {
            toast.info('Bu maç tamamlanmış. Tamamlanmış maçların salonlarına erişilemez.');
            navigate('/matches');
            return;
          }
          
          // Eğer maç sonucu kullanıcı tarafından zaten raporlanmışsa salondan çık
          if (matchData.results) {
            const { userRole, hostReported, opponentReported } = matchData.results;
            
            // Kullanıcı kendi rolüne göre rapor gönderdiyse erişimi engelle
            if ((userRole === 'host' && hostReported) || (userRole === 'opponent' && opponentReported)) {
              toast.info('Bu maç için sonuç bildirdiniz. Karşı tarafın onayı bekleniyor veya sonuç doğrulanıyor.');
              navigate('/matches');
              return;
            }
          }

          // Maçın oluşturulma zamanını al
          const createdAt = new Date(matchData.createdAt);
          const now = new Date();
          
          // Oluşturulma zamanından bu yana geçen süreyi hesapla (saniye cinsinden)
          const elapsedTimeInSeconds = Math.floor((now - createdAt) / 1000);
          
          // 1 saat = 3600 saniye, kalan süreyi hesapla
          const remainingTime = Math.max(3600 - elapsedTimeInSeconds, 0);
          setRemainingTimeInSeconds(remainingTime);
          
          // Katılım ücretini al ve ödülü hesapla (1.8 katı)
          const entryFee = matchData.entryFee || 0;
          const calculatedPrize = entryFee * 1.8;
          
          setMatchData({
            id: matchData.id,
            gameName: matchData.game || "",
            remainingTime: formatTime(remainingTime),
            createdAt: createdAt,
            player1: {
              username: matchData.host.username || "",
              avatarUrl: matchData.host.avatarUrl || null,
              ps5Id: matchData.host.ps5Id || "",
              consoleImage: PSlogo
            },
            player2: {
              username: matchData.opponent.username || "",
              avatarUrl: matchData.opponent.avatarUrl || null,
              ps5Id: matchData.opponent.ps5Id || "",
              consoleImage: PSlogo
            },
            entryFee: entryFee,
            prize: calculatedPrize // Hesaplanan ödül değerini kullan
          });

          console.log('💰 Finansal Detaylar:', {
            'Katılım Ücreti': entryFee,
            'Ödül': calculatedPrize,
            'Toplam Havuz': matchData.totalPrizePool
          });
        } else {
          toast.error('Maç bilgileri alınamadı');
          navigate('/matches');
        }
      } catch (error) {
        console.error('Maç detayları yüklenirken hata:', error);
        toast.error('Maç bilgileri alınamadı');
        navigate('/matches');
      } finally {
        setLoading(false);
      }
    };

    fetchMatchDetails();
  }, [matchId, navigate]);

  // Kalan süreyi azaltan sayaç
  useEffect(() => {
    // Eğer yükleme durumunda ise veya kalan süre 0 ise, sayaç başlatma
    if (loading || remainingTimeInSeconds <= 0) return;

    const timer = setInterval(() => {
      setRemainingTimeInSeconds(prevTime => {
        const newTime = prevTime - 1;
        
        // Kalan süreyi güncelle
        setMatchData(prevData => ({
          ...prevData,
          remainingTime: formatTime(newTime)
        }));
        
        // Süre bittiyse sayacı durdur ve kullanıcıyı bilgilendir
        if (newTime <= 0) {
          clearInterval(timer);
          toast.warning('Maç süresi doldu! Sonuç bildirmediyseniz maç otomatik olarak iptal edilecek.');
          setTimeout(() => {
            navigate('/matches');
          }, 3000);
          return 0;
        }
        
        return newTime;
      });
    }, 1000);

    // Component unmount olduğunda sayacı temizle
    return () => clearInterval(timer);
  }, [loading, remainingTimeInSeconds, navigate]);

  const onButonContainerClick = () => {
    setMatchStarted(true);
  };
  
  const onCancelRequestClick = () => {
    // İptal talebi gönderme işlemi
  };

  const onReportResultClick = () => {
    setShowSendResult(true);
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log('Gönderilen mesaj:', message);
      setMessage('');
    }
  };

  // Maç sonucu bildirme fonksiyonu
  const handleDeclareResult = async (matchId, winnerId) => {
    try {
      setLoading(true);
      const response = await challengeService.declareMatchResult(matchId, winnerId);
      
      if (response.success) {
        const { match } = response.data;
        console.log('Sonuç bildirildi:', {
          status: match.status,
          hostDeclaredWinner: match.hostDeclaredWinner,
          opponentDeclaredWinner: match.opponentDeclaredWinner
        });
        
        toast.success('Maç sonucu başarıyla bildirildi');
        setShowSendResult(false); // Sonuç gönderme ekranını kapat
        
        // Maç durumuna göre kullanıcıya bilgi ver
        if (match.status === 'disputed') {
          toast.warning('Rakibiniz farklı bir sonuç bildirdi. İtiraz süreci başlatıldı.');
        } else if (match.status === 'completed') {
          toast.success('Maç sonucu onaylandı!');
        }
        
        // Sonuç bildirildikten sonra maçlarım sayfasına yönlendir
        setTimeout(() => {
          navigate('/matches');
        }, 1500);
      }
    } catch (error) {
      console.error('Sonuç bildirilirken hata:', error);
      toast.error(error.message || 'Sonuç bildirilirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div className={styles.malarmSalon}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      
      <Sidebar />
      
      <div className={styles.container}>
        <PageHeader headerTitle="Maç Salonu"/>
        <div className={styles.frameGroup}>
          {!showSendResult ? (
            <MatchDetails 
              matchData={matchData}
              matchStarted={matchStarted}
              onButonContainerClick={onButonContainerClick}
              onCancelRequestClick={onCancelRequestClick}
              onReportResultClick={onReportResultClick}
            />
          ) : (
            <SendResult 
              matchData={matchData}
              onBack={() => setShowSendResult(false)}
              onSubmitResult={(winnerId) => handleDeclareResult(matchData.id, winnerId)}
              loading={loading}
            />
          )}
          <div className={styles.frameParent4}>
            <div className={styles.headphonesParent}>
              <img className={styles.headphonesIcon} alt="" src={HeadphoneImage} />
              <div className={styles.maSalonu}>Maç Salonu</div>
            </div>
            <div className={styles.frameChild} />
            <div className={styles.footerWrapper}>
              <div className={styles.footer}>
                <div className={styles.divider} />
                <div className={styles.content}>
                  <div className={styles.actions}>
                    <div className={styles.inputField}>  
                      <input
                        type="text"
                        value={message}
                        onChange={handleMessageChange}
                        className={styles.content1}
                        placeholder="Mesajınızı yazın..."
                      />
                    </div>
                    <div className={styles.button} onClick={handleSendMessage}>
                      <div className={styles.buttonBase2}>
                        <img className={styles.sendIcon} alt="" src={SendImage} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.malarmSalonChild} />
    </div>);
};

export default MalarmSalon;
