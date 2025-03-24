import { FunctionComponent, useState, useCallback,useEffect } from 'react';
import styles from './Matches.module.css';
import Sidebar from '../SideBar/Sidebar';
import PageHeader from '../PageHeader/PageHeader';
import declineIcone from '../../images/Maclarım/declineCross.svg'
import nba2k25 from '../../images/Cards/2k25Card.png'
import { matchService, challengeService } from '../../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Matches = () => {
    const [cards, setCards] = useState([]);
    const [gelenIstekler, setGelenIstekler] = useState([]);
    const [gidenIstekler, setGidenIstekler] = useState([]);
    const [selectedTab, setSelectedTab] = useState('gelen');
    const [activeMatches, setActiveMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('active');
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [challenges, setChallenges] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Burada verilerinizi database'den çekmek için API çağrınızı gerçekleştirebilirsiniz.
        // Örnek olması açısından sabit veri kullanıyoruz.
        async function fetchCards() {
          const fetchedCards = [
            {
              id: 1,
              gameImage: nba2k25,
              gameTitle: "NBA 2K25",
              duration: "37 dakika",
              player1: {
                username: "Username",
                platform: "PS5",
                avatar: "Avatar.png"
              },
              player2: {
                username: "Username",
                platform: "PS5",
                avatar: "Avatar.png"
              },
              entryFee: "50₺ Katılım Ücreti",
              reward: "90₺ Ödül",
            },
            {
              id: 2,
              gameImage: nba2k25,
              gameTitle: "NBA 2K25",
              duration: "37 dakika",
              player1: {
                username: "Username",
                platform: "PS5",
                avatar: "Avatar.png"
              },
              player2: {
                username: "Username",
                platform: "PS5",
                avatar: "Avatar.png"
              },
              entryFee: "50₺ Katılım Ücreti",
              reward: "90₺ Ödül",
            },
            {
              id: 3,
              gameImage: nba2k25,
              gameTitle: "NBA 2K25",
              duration: "37 dakika",
              player1: {
                username: "Username",
                platform: "PS5",
                avatar: "Avatar.png"
              },
              player2: {
                username: "Username",
                platform: "PS5",
                avatar: "Avatar.png"
              },
              entryFee: "50₺ Katılım Ücreti",
              reward: "90₺ Ödül",
            },
            {
              id: 4,
              gameImage: nba2k25,
              gameTitle: "NBA 2K25",
              duration: "37 dakika",
              player1: {
                username: "Username",
                platform: "PS5",
                avatar: "Avatar.png"
              },
              player2: {
                username: "Username",
                platform: "PS5",
                avatar: "Avatar.png"
              },
              entryFee: "50₺ Katılım Ücreti",
              reward: "90₺ Ödül",
            },
            
            // İstediğiniz kadar kart ekleyebilirsiniz...
          ];

          setCards(fetchedCards);
        }
        fetchCards();
    }, []);

    useEffect(() => {
        async function fetchUserChallenges() {
            try {
                const response = await challengeService.getChallenges({ status: 'active' });
                console.log('fetchUserChallenges Meydan Okumalar:', response);
                
                if (response.success) {
                    setChallenges(response.data.challenges);
                    if (response.data.challenges.length > 0) {
                        const firstChallengeId = response.data.challenges[0].id;
                        setSelectedChallenge(firstChallengeId);
                    }
                }
            } catch (error) {
                console.error('Meydan okumalar yüklenirken hata:', error);
                toast.error('Meydan okumalar yüklenemedi');
            }
        }

        fetchUserChallenges();
    }, []);

    useEffect(() => {
        loadRequests();
    }, [selectedTab]);

    const loadRequests = async () => {
        try {
            setLoading(true);
            console.log('İstekler yükleniyor... Tab:', selectedTab);

            if (selectedTab === 'gelen') {
                const response = await challengeService.getMyRequests();
                if (response.success) {
                    const allRequests = response.data.challenges.reduce((acc, item) => {
                        const requestsWithChallenge = item.requests.map(request => ({
                            ...request,
                            challenge: item.challenge
                        }));
                        return [...acc, ...requestsWithChallenge];
                    }, []);
                    setGelenIstekler(allRequests);
                }
            } else if (selectedTab === 'giden') {
                const response = await challengeService.getSentRequests();
                if (response.success) {
                    const { requests } = response.data;
                    const allRequests = [
                        ...requests.pending.map(request => ({
                            ...request,
                            status: 'Beklemede'
                        })),
                        ...requests.accepted.map(request => ({
                            ...request,
                            status: 'Kabul Edildi'
                        }))
                    ];
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

    const fetchMatches = async () => {
        try {
            setLoading(true);
            const response = await matchService.getMatches(selectedStatus);
            if (response.success) {
                setActiveMatches(response.data.matches);
            }
        } catch (error) {
            console.error('Maçlar yüklenemedi:', error);
            toast.error('Maçlar yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
        }
    };

    const handleCompleteMatch = async (matchId, winnerId) => {
        try {
            const response = await matchService.completeMatch(matchId, winnerId);
            if (response.success) {
                toast.success('Maç sonucu başarıyla bildirildi');
                fetchMatches(); // Listeyi güncelle
            }
        } catch (error) {
            console.error('Maç sonucu bildirilemedi:', error);
            toast.error('Maç sonucu bildirilirken bir hata oluştu');
        }
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
                <div className={styles.enteryFeeText}>{card.entryFee}</div>
              </div>
            </div>
            <div className={styles.badgeBaseContainer}>

              <div className={styles.badgeBase}>
                <div className={styles.rewardText}>{card.reward}</div>
              </div>
            </div>
          </div>
          <div className={styles.buttonBase}>
            <button className={styles.buttonText}>Salona Git</button>
          </div>
        </div>
      </div>
    );
  };

  const renderTable = (requests) => (
    <div className={styles.tabloMaTekliflerim}>
      <div className={styles.tableHeaderRow}>
        <div className={styles.headerCell}>Kullanıcı</div>
        <div className={styles.headerCell}>Oyun</div>
        <div className={styles.headerCell}>Katılım Ücreti</div>
        <div className={styles.headerCell}>Ödül</div>
        <div className={styles.headerCell}>Kalan Süre</div>
        <div className={styles.headerCell}></div>
      </div>
      {requests.map((request) => (
        <div key={request.id} className={styles.tableRow}>
          <div className={styles.cell}>
            <div className={styles.tableuser}>
              <img className={styles.avatarIcon5} src={request.user.avatar} />
              <div className={styles.usernameWrapper}>
                <div className={styles.username6}>{request.user.username}</div>
              </div>
            </div>
            <div className={styles.name}>{request.user.name}</div>
          </div>
          <div className={styles.cell}>
            <div className={styles.fc25Wrapper}>
              <div className={styles.div}>{request.game.title}</div>
            </div>
            <div className={styles.badgeBase4}>
              <div className={styles.badgeBase7}>
                <img className={styles.avatarIcon8} alt={request.game.title} src={request.game.image} />
                <div className={styles.text3}>{request.game.platform}</div>
              </div>
            </div>
          </div>
          <div className={styles.cell}>
            <div className={styles.badgeBaseWrapper1}>
              <div className={styles.badgeBase10}>
                <div className={styles.div}>{request.participationFee}</div>
              </div>
            </div>
            <div className={styles.name6}>{request.user.name}</div>
          </div>
          <div className={styles.cell}>
            <div className={styles.badgeBaseWrapper1}>
              <div className={styles.badgeBase10}>
                <div className={styles.div}>{request.reward}</div>
              </div>
            </div>
            <div className={styles.name3}>{request.user.name}</div>
          </div>
          <div className={styles.cell}>
            <div className={styles.dakikaFrame}>
              <div className={styles.dakika}>{`⏱ ${request.remainingTime}`}</div>
            </div>
            <div className={styles.name12}>{request.user.name}</div>
          </div>
          <div className={styles.cell}>
            <div className={styles.buttonBaseParent}>
              {selectedTab === 'gelen' ? (
                <>
                  <div className={styles.buttonBase2}>
                    <div className={styles.text1}>Onayla</div>
                  </div>
                  <div className={styles.buttonDecline}>
                    <img className={styles.declineButtonImage} alt="" src={declineIcone} style={{width: '20px', height: '20px'}} />
                  </div>
                </>
              ) : (
                <div className={styles.buttonCancel}>
                  İptal Et
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const handleTabChange = (tab) => {
    setSelectedTab(tab);
  };

  const handleChallengeSelect = (challengeId) => {
    setSelectedChallenge(challengeId);
  };

  // İstek kabul etme
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

  // İstek reddetme
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

  // İstek iptal etme
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
                                    className={`${styles.gelenIsteklerWrapper} ${selectedTab === 'gelen' ? styles.activeTab : ''}`}
                                    onClick={() => setSelectedTab('gelen')}
                                >
                                    <div className={styles.gelenIstekler}>Gelen istekler</div>
                                </div>
                                <div 
                                    className={`${styles.gidenIsteklerWrapper} ${selectedTab === 'giden' ? styles.activeTab : ''}`}
                                    onClick={() => setSelectedTab('giden')}
                                >
                                    <div className={styles.gelenIstekler}>Giden istekler</div>
                                </div>
                            </div>
                        </div>
                        {loading ? (
                            <div className={styles.loading}>Yükleniyor...</div>
                        ) : (
                            <div className={styles.tabloMaTekliflerim}>
                                <div className={styles.tableHeaderRow}>
                                    <div className={styles.headerCell}>Kullanıcı</div>
                                    <div className={styles.headerCell}>Oyun</div>
                                    <div className={styles.headerCell}>Katılım Ücreti</div>
                                    <div className={styles.headerCell}>Ödül</div>
                                    <div className={styles.headerCell}>Kalan Süre</div>
                                    <div className={styles.headerCell}></div>
                                </div>
                                {(selectedTab === 'gelen' ? gelenIstekler : gidenIstekler).map((request) => (
                                    <div key={request.id} className={styles.tableRow}>
                                        <div className={styles.cell}>
                                            <div className={styles.tableuser}>
                                                <img className={styles.avatarIcon5} alt={request.username} src={request.avatarUrl} />
                                                <div className={styles.usernameWrapper}>
                                                    <div className={styles.username6}>{request.username}</div>
                                                </div>
                                            </div>
                                            <div className={styles.name}>{request.name}</div>
                                        </div>
                                        <div className={styles.cell}>
                                            <div className={styles.fc25Wrapper}>
                                                <div className={styles.div}>{request.challenge?.game}</div>
                                            </div>
                                            <div className={styles.badgeBase4}>
                                                <div className={styles.badgeBase7}>
                                                    <img className={styles.avatarIcon8} alt="" src={request.challenge?.image} />
                                                    <div className={styles.text3}>{request.challenge?.platform}</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.cell}>
                                            <div className={styles.badgeBaseWrapper1}>
                                                <div className={styles.badgeBase10}>
                                                    <div className={styles.div}>{request.challenge?.entryFee}₺</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.cell}>
                                            <div className={styles.badgeBaseWrapper1}>
                                                <div className={styles.badgeBase10}>
                                                    <div className={styles.div}>{request.challenge?.reward}₺</div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={styles.cell}>
                                            <div className={styles.dakikaFrame}>
                                                <div className={styles.dakika}>⏱ {request.challenge?.duration} dakika</div>
                                            </div>
                                        </div>
                                        <div className={styles.cell}>
                                            {selectedTab === 'gelen' ? (
                                                <div className={styles.buttonBaseParent}>
                                                    <div className={styles.buttonBase2} onClick={() => handleAcceptRequest(request.id)}>
                                                        <div className={styles.text1}>Onayla</div>
                                                    </div>
                                                    <div className={styles.buttonDecline} onClick={() => handleDeclineRequest(request.id)}>
                                                        <img className={styles.declineButtonImage} alt="" src={declineIcone} style={{width: '20px', height: '20px'}} />
                                                    </div>
                                                </div>
                                            ) : (
                                                request.status === 'Beklemede' && (
                                                    <div className={styles.buttonCancel} onClick={() => handleCancelRequest(request.id)}>
                                                        İptal Et
                                                    </div>
                                                )
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
    {challenges.length > 0 && (
      <div className={styles.challengeSelect}>
        <select 
          value={selectedChallenge} 
          onChange={(e) => handleChallengeSelect(Number(e.target.value))}
        >
          {challenges.map(challenge => (
            <option key={challenge.id} value={challenge.id}>
              {challenge.title}
            </option>
          ))}
        </select>
      </div>
    )}
    <div>
      <div>Debug Bilgileri:</div>
      <div>Seçili Tab: {selectedTab}</div>
      <div>Seçili Meydan Okuma: {selectedChallenge}</div>
      <div>Toplam Meydan Okuma: {challenges.length}</div>
      <div>Gelen İstek Sayısı: {gelenIstekler.length}</div>
    </div>
  </>);
};

export default Matches;
