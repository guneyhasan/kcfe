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

const MalarmSalon = () => {
  const { matchId } = useParams();
  const navigate = useNavigate();
  const [matchStarted, setMatchStarted] = useState(false);
  const [showSendResult, setShowSendResult] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [matchData, setMatchData] = useState({
    id: null,
    gameName: "",
    remainingTime: "",
    player1: {
      username: "",
      avatarUrl: null,
      ps5Id: ""
    },
    player2: {
      username: "",
      avatarUrl: null,
      ps5Id: ""
    },
    entryFee: 0,
    prize: 0
  });

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
          
          setMatchData({
            id: matchData.id,
            gameName: matchData.game || "",
            remainingTime: "37", // Sabit değer
            player1: {
              username: matchData.host.username || "",
              avatarUrl: matchData.host.avatarUrl || null,
              ps5Id: ""
            },
            player2: {
              username: matchData.opponent.username || "",
              avatarUrl: matchData.opponent.avatarUrl || null,
              ps5Id: ""
            },
            entryFee: matchData.entryFee || "0.00",
            prize: matchData.prize || "0.00"
          });

          console.log('💰 Finansal Detaylar:', {
            'Katılım Ücreti': matchData.entryFee,
            'Ödül': matchData.prize,
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
      <div className={styles.navLinkssidebarOne}>
        <Sidebar />
      </div>
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
