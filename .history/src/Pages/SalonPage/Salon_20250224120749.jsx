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
import { useParams } from 'react-router-dom';

const MalarmSalon = () => {
  const { matchId } = useParams();
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
    if (matchId) {
      loadMatchDetails(matchId);
    }
  }, [matchId]);

  const loadMatchDetails = async (id) => {
    try {
      setLoading(true);
      const response = await challengeService.getMatchDetails(id);
      
      if (response.success) {
        const match = response.data.match;
        console.log('Match Data:', match);

        setMatchData({
          id: match.id,
          gameName: match.game || "",
          remainingTime: match.pendingTime || "37",
          player1: {
            username: match.host.username || "",
            avatarUrl: match.host.avatarUrl || null,
            ps5Id: match.host.gamerId || ""
          },
          player2: {
            username: match.opponent.username || "",
            avatarUrl: match.opponent.avatarUrl || null,
            ps5Id: match.opponent.gamerId || ""
          },
          entryFee: match.financials.entryFee || 0,
          prize: match.financials.prize || 0
        });
      }
    } catch (error) {
      console.error('Maç detayları yüklenemedi:', error);
      toast.error('Maç detayları yüklenirken bir hata oluştu');
    } finally {
      setLoading(false);
    }
  };

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
