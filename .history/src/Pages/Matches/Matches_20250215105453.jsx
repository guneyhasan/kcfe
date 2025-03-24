import { FunctionComponent, useState, useCallback,useEffect } from 'react';
import styles from './Matches.module.css';
import Sidebar from '../SideBar/Sidebar';
import PageHeader from '../PageHeader/PageHeader';
import declineIcone from '../../images/Maclarım/declineCross.svg'
import nba2k25 from '../../images/Cards/2k25Card.png'
import { matchService, challengeService } from '../../services/api';
import { toast } from 'react-toastify';

const MalarmGelenStekler = () => {
    const [cards, setCards] = useState([]);
    const [gelenIstekler, setGelenIstekler] = useState([]);
    const [gidenIstekler, setGidenIstekler] = useState([]);
    const [selectedTab, setSelectedTab] = useState('gelen');
    const [activeMatches, setActiveMatches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedStatus, setSelectedStatus] = useState('active');
    const [selectedChallenge, setSelectedChallenge] = useState(null);
    const [challenges, setChallenges] = useState([]);

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
                if (response.success) {
                    setChallenges(response.data.challenges);
                    // İlk meydan okumayı seç
                    if (response.data.challenges.length > 0) {
                        setSelectedChallenge(response.data.challenges[0].id);
                    }
                }
            } catch (error) {
                toast.error('Meydan okumalar yüklenemedi');
                console.error('Meydan okumalar yüklenemedi:', error);
            }
        }

        fetchUserChallenges();
    }, []);

    useEffect(() => {
        async function fetchGelenIstekler() {
            try {
                setLoading(true);
                if (selectedChallenge) {
                    const requests = await challengeService.getChallengeRequests(selectedChallenge);
                    setGelenIstekler(requests);
                }
            } catch (error) {
                toast.error(error.message);
                console.error('Gelen istekler yüklenemedi:', error);
            } finally {
                setLoading(false);
            }
        }

        if (selectedTab === 'Gelen istekler' && selectedChallenge) {
            fetchGelenIstekler();
        }
    }, [selectedTab, selectedChallenge]);

    useEffect(() => {
        fetchMatches();
    }, [selectedStatus]);

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
              <img className={styles.avatarIcon5} alt={request.user.username} src={request.user.avatar} />
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

  return (<>
    <div className={styles.malarmGelenStekler}>
      <Sidebar setActiveTab={1} />
      <div className={styles.container}>
        <PageHeader headerTitle="Maçlarım"/>
        <div className={styles.mobileCardParent}>
          {cards.map((card, index) => renderCard(card, index))}
        </div>
        <div className={styles.containerInner}>
          <div className={styles.frameWrapper}>
            <div className={styles.headerMaTekliflerimParent}>
              <div className={styles.headerMaTekliflerim}>
                <div className={styles.stekler}>İstekler</div>
                <div className={styles.headerMaTekliflerimChild} />
                <div className={styles.frameGroup}>
                  <div className={styles.gelenIsteklerWrapper} onClick={() => handleTabChange('gelen')}>
                    <div className={`${styles.gelenIstekler} ${selectedTab === 'gelen' ? styles.activeTab : ''}`}>Gelen istekler</div>
                  </div>
                  <div className={styles.gidenIsteklerWrapper} onClick={() => handleTabChange('giden')}>
                    <div className={`${styles.gelenIstekler} ${selectedTab === 'giden' ? styles.activeTab : ''}`}>Giden istekler</div>
                  </div>
                </div>
              </div>
              {selectedTab === 'gelen' ? renderTable(gelenIstekler) : renderTable(gidenIstekler)}
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
  </>);
};

export default MalarmGelenStekler;
