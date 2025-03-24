import { FunctionComponent, useCallback, useState } from 'react';
import styles from './Salon.module.css';
import Sidebar from '../SideBar/Sidebar';
import PageHeader from '../PageHeader/PageHeader';
import HeadphoneImage from '../../images/Salon/headphones.svg';
import SendImage from '../../images/Salon/send.svg';
import MatchDetails from '../../components/MatchDetails/MatchDetails';
import SendResult from '../../components/SendResult/SendResult';
import { challengeService } from '../../services/api';
import { toast } from 'react-toastify';

const MalarmSalon = () => {
  const [matchStarted, setMatchStarted] = useState(false);
  const [showSendResult, setShowSendResult] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // State veya prop olarak gelen veriler
  const matchData = {
    gameName: "FC2K24_v1",
    remainingTime: "37",
    player1: {
      username: "@cagri",
      avatarUrl: "Avatar.png",
      ps5Id: "gamer_2002"
    },
    player2: {
      username: "@hasan",
      avatarUrl: "Avatar.png",
      ps5Id: "gamer_2000"
    },
    entryFee: "50",
    prize: "90"
  };

  const onButonContainerClick = useCallback(() => {
    setMatchStarted(true);
  }, []);
  
  const onCancelRequestClick = useCallback(() => {
    // Add your code here
  }, []);

  const onReportResultClick = useCallback(() => {
    setShowSendResult(true);
  }, []);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      // Mesaj gönderme işlemi burada yapılacak
      console.log('Gönderilen mesaj:', message);
      setMessage(''); // Mesaj gönderildikten sonra input'u temizle
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
