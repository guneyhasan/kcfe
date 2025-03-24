import { useState, useEffect } from 'react';
import styles from './Matches.module.css';
import Sidebar from '../SideBar/Sidebar';
import PageHeader from '../PageHeader/PageHeader';
import declineIcone from '../../images/Maclarım/declineCross.svg';
import { challengeService } from '../../services/api';
import { toast } from 'react-toastify';

const Matches = () => {
    const [cards, setCards] = useState([]);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectedTab] = useState('gelen');
    const [gelenIstekler, setGelenIstekler] = useState([]);

    useEffect(() => {
        // Burada verilerinizi database'den çekmek için API çağrınızı gerçekleştirebilirsiniz.
        // Örnek olması açısından sabit veri kullanıyoruz.
        async function fetchCards() {
          const fetchedCards = [
            {
              id: 1,
              gameImage: "Ellipse 45.png",
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
              buttonText: "Salona Git"
            },
            {
              id: 2,
              gameImage: "Ellipse 45.png",
              gameTitle: "FC25",
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
              buttonText: "Salona Git"
            }
            // İstediğiniz kadar kart ekleyebilirsiniz...
          ];
    
          setCards(fetchedCards);
        }
        fetchCards();
    }, []);

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
                // ... giden istekler kısmı aynı kalacak ...
            }
        } catch (error) {
            console.error('İstekler yüklenirken hata:', error);
            toast.error('İstekler yüklenirken bir hata oluştu');
        } finally {
            setLoading(false);
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
                  										onClick={() => setSelectedTab('gelen')}
                  									>
                    										<div className={styles.gelenIstekler}>Gelen istekler</div>
                  									</div>
                  									<div 
                  										className={styles.gidenIsteklerWrapper}
                  										onClick={() => setSelectedTab('giden')}
                  									>
                    										<div className={styles.gelenIstekler}>Giden istekler</div>
                  									</div>
                								</div>
              							</div>
              							<div className={styles.tabloMaTekliflerim}>
                								<div className={styles.tableHeaderRow}>
                  									<div className={styles.headerCell}>Kullanıcı</div>
                  									<div className={styles.headerCell}>Oyun</div>
                  									<div className={styles.headerCell}>Katılım Ücreti</div>
                  									<div className={styles.headerCell}>Ödül</div>
                  									<div className={styles.headerCell}>Kalan Süre</div>
                  									<div className={styles.headerCell}></div>
                								</div>
                								{loading ? (
                                                    <div className={styles.loading}>Yükleniyor...</div>
                                                ) : (
                                                    selectedTab === 'gelen' ? (
                                                        gelenIstekler.map((request) => (
                                                            <div key={request.id} className={styles.tableRow}>
                                                                <div className={styles.cell}>
                                                                    <div className={styles.tableuser}>
                                                                        <img 
                                                                            className={styles.avatarIcon5} 
                                                                            alt={request.user.username} 
                                                                            src={request.user.avatarUrl} 
                                                                        />
                                                                        <div className={styles.usernameWrapper}>
                                                                            <div className={styles.username6}>{request.user.username}</div>
                                                                        </div>
                                                                    </div>
                                                                    <div className={styles.message}>{request.message}</div>
                                                                </div>
                                                                <div className={styles.cell}>
                                                                    <div className={styles.challengeTitle}>
                                                                        <div className={styles.title}>{request.challenge.title}</div>
                                                                    </div>
                                                                    <div className={styles.status}>{request.status}</div>
                                                                </div>
                                                                <div className={styles.cell}>
                                                                    <div className={styles.createdAt}>
                                                                        {new Date(request.createdAt).toLocaleDateString('tr-TR')}
                                                                    </div>
                                                                </div>
                                                                <div className={styles.cell}>
                                                                    <div className={styles.buttonBaseParent}>
                                                                        <div 
                                                                            className={styles.buttonBase2}
                                                                            onClick={() => handleAcceptRequest(request.id)}
                                                                        >
                                                                            <div className={styles.text1}>Onayla</div>
                                                                        </div>
                                                                        <div 
                                                                            className={styles.buttonDecline}
                                                                            onClick={() => handleDeclineRequest(request.id)}
                                                                        >
                                                                            <img 
                                                                                className={styles.declineButtonImage} 
                                                                                alt="" 
                                                                                src={declineIcone} 
                                                                                style={{width: '20px', height: '20px'}} 
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ))
                                                    ) : (
                                                        gidenIstekler.map((request) => (
                                                            <div key={request.id} className={styles.tableRow}>
                                                                {/* Giden istekler için render kısmı */}
                                                            </div>
                                                        ))
                                                    )
                                                )}
              							</div>
            						</div>
          					</div>
        				</div>
      			</div>
    		</div>
    		</>);
};

export default Matches;
