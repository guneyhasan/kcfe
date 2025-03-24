import { useState, useEffect } from 'react';
import styles from './Matches.module.css';
import Sidebar from '../SideBar/Sidebar';
import PageHeader from '../PageHeader/PageHeader';
import declineIcone from '../../images/Maclarım/declineCross.svg';
import { challengeService } from '../../services/api';
import { toast } from 'react-toastify';

const Matches = () => {
    const [gelenIstekler, setGelenIstekler] = useState([]);
    const [gidenIstekler, setGidenIstekler] = useState([]);
    const [selectedTab, setSelectedTab] = useState('gelen');
    const [loading, setLoading] = useState(true);
    const [challenges, setChallenges] = useState([]);
    const [selectedChallenge, setSelectedChallenge] = useState(null);

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
                toast.success('İstek başarıyla kabul edildi');
                loadRequests();
            }
        } catch (error) {
            console.error('İstek kabul edilirken hata:', error);
            toast.error('İstek kabul edilirken bir hata oluştu');
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
                        const requestsWithChallenge = item.requests.map(request => ({
                            id: request.id,
                            message: request.message,
                            status: request.status,
                            createdAt: request.createdAt,
                            user: {
                                id: request.user.id,
                                username: request.user.username,
                                avatarUrl: request.user.avatarUrl
                            },
                            challenge: {
                                id: item.challenge.id,
                                title: item.challenge.title,
                                status: item.challenge.status,
                                createdAt: item.challenge.createdAt
                            }
                        }));
                        return [...acc, ...requestsWithChallenge];
                    }, []);

                    console.log('İşlenmiş gelen istekler:', allRequests);
                    setGelenIstekler(allRequests);
                }
            } else if (selectedTab === 'giden') {
                const response = await challengeService.getSentRequests();
                console.log('Giden istekler response:', response);

                if (response.success) {
                    const { requests } = response.data;
                    setGidenIstekler([
                        ...requests.pending,
                        ...requests.accepted
                    ]);
                }
            }
        } catch (error) {
            console.error('İstekler yüklenirken hata:', error);
            toast.error('İstekler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    // İstekleri yükle
    useEffect(() => {
        loadRequests();
    }, [selectedTab]); // eslint-disable-line react-hooks/exhaustive-deps

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
            <div className={styles.tableHeaderRow}>
                <div className={styles.headerCell}>Kullanıcı</div>
                <div className={styles.headerCell}>Meydan Okuma</div>
                <div className={styles.headerCell}>Oyun</div>
                <div className={styles.headerCell}>Platform</div>
                <div className={styles.headerCell}>Mesaj</div>
                <div className={styles.headerCell}>Durum</div>
                <div className={styles.headerCell}></div>
            </div>
            {requests.map((request) => (
                <div key={request.id} className={styles.tableRow}>
                    {/* Kullanıcı */}
                    <div className={styles.cell}>
                        <div className={styles.tableuser}>
                            <img 
                                className={styles.avatarIcon5} 
                                alt={request.username || 'Kullanıcı'} 
                                src={request.avatarUrl || 'default-avatar.png'} 
                            />
                            <div className={styles.usernameWrapper}>
                                <div className={styles.username6}>
                                    {request.username || 'İsimsiz Kullanıcı'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Meydan Okuma */}
                    <div className={styles.cell}>
                        <div className={styles.challengeTitle}>
                            {request.challenge?.title || 'Başlık Yok'}
                        </div>
                    </div>

                    {/* Oyun */}
                    <div className={styles.cell}>
                        <div className={styles.fc25Wrapper}>
                            <div className={styles.div}>
                                {request.challenge?.game || 'Oyun Belirtilmemiş'}
                            </div>
                        </div>
                    </div>

                    {/* Platform */}
                    <div className={styles.cell}>
                        <div className={styles.badgeBase4}>
                            <div className={styles.badgeBase7}>
                                <div className={styles.text3}>
                                    {request.challenge?.platform || 'Platform Belirtilmemiş'}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Mesaj */}
                    <div className={styles.cell}>
                        <div className={styles.message}>
                            {request.message || 'Mesaj yok'}
                        </div>
                    </div>

                    {/* Durum */}
                    <div className={styles.cell}>
                        <div className={styles.status}>
                            {request.status || 'Beklemede'}
                        </div>
                    </div>

                    {/* Aksiyonlar */}
                    <div className={styles.cell}>
                        <div className={styles.buttonBaseParent}>
                            {selectedTab === 'gelen' ? (
                                <>
                                    <div className={styles.buttonBase2} onClick={() => handleAcceptRequest(request.id)}>
                                        <div className={styles.text1}>Onayla</div>
                                    </div>
                                    <div className={styles.buttonDecline} onClick={() => handleDeclineRequest(request.id)}>
                                        <img 
                                            className={styles.declineButtonImage} 
                                            alt="" 
                                            src={declineIcone} 
                                            style={{width: '20px', height: '20px'}} 
                                        />
                                    </div>
                                </>
                            ) : (
                                <div className={styles.buttonCancel} onClick={() => handleCancelRequest(request.id)}>
                                    İptal Et
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

  	return (<>
    		<div className={styles.malarmGelenStekler}>
      			<Sidebar />
      			<div className={styles.container}>
        				<PageHeader />
        				<div className={styles.containerInner}>
          					<div className={styles.frameWrapper}>
            						<div className={styles.headerMaTekliflerimParent}>
              							<div className={styles.headerMaTekliflerim}>
                								<div className={styles.stekler}>İstekler</div>
                								<div className={styles.headerMaTekliflerimChild} />
                								<div className={styles.frameGroup}>
                  									<div 
                  										className={styles.gelenIsteklerWrapper} 
                  										onClick={() => handleTabChange('gelen')}
                  									>
                    										<div className={`${styles.gelenIstekler} ${selectedTab === 'gelen' ? styles.activeTab : ''}`}>
                                                                Gelen istekler
                                                            </div>
                  									</div>
                  									<div 
                  										className={styles.gidenIsteklerWrapper} 
                  										onClick={() => handleTabChange('giden')}
                  									>
                    										<div className={`${styles.gelenIstekler} ${selectedTab === 'giden' ? styles.activeTab : ''}`}>
                                                                Giden istekler
                                                            </div>
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
            {/* Debug bilgileri */}
            <div style={{padding: '20px', background: '#f5f5f5', margin: '20px'}}>
                <h3>Debug Bilgileri:</h3>
                <div>Loading: {loading.toString()}</div>
                <div>Seçili Tab: {selectedTab}</div>
                <div>Meydan Okuma Sayısı: {challenges.length}</div>
                <div>Gelen İstek Sayısı: {gelenIstekler.length}</div>
                <div>Giden İstek Sayısı: {gidenIstekler.length}</div>
            </div>
    		</>);
};

export default Matches;
