import { FunctionComponent, useCallback, useState, useEffect } from 'react';
import styles from './ProfilePage.module.css';
import Sidebar from '../SideBar/Sidebar';
import PageHeader from '../PageHeader/PageHeader';
import ProfileHeader from './Components/ProfileHeader';
import RecentMatches from './Components/RecentMatches';
import Statistics from './Components/Statistics';
import MatchHistory from './Components/MatchHistory';
import { Helmet } from 'react-helmet';
import { challengeService } from '../../services/api';
import { toast } from 'react-toastify';

// Import game images
import fc24Image from '../../images/Games/fc24.jpeg';
import fc25Image from '../../images/Games/fc25.jpeg';
import nba2k24Image from '../../images/Games/nba2k24.png';
import nba2k25Image from '../../images/Games/nba2k25.jpeg';

// Mock veri
const mockUserData = {
  username: "username",
  userId: "123456",
  balance: 200
};

// Mock maç verileri
const mockMatchesData = [
  {
    id: "1",
    player1: {
      username: "Username",
      console: "PS5",
      avatar: "/avatar.png"
    },
    player2: {
      username: "Username",
      console: "PS5",
      avatar: "/avatar.png"
    },
    result: "win", // win, lose, draw
    game: {
      name: "NBA 2K25",
      icon: "Ellipse 45.png"
    },
    prize: 90
  },
  {
    id: "2",
    player1: {
      username: "Username",
      console: "PS5",
      avatar: "/avatar.png"
    },
    player2: {
      username: "Username",
      console: "PS5",
      avatar: "/avatar.png"
    },
    result: "draw",
    game: {
      name: "FC25",
      icon: "Ellipse 45.png"
    },
    prize: 350
  },
  // Diğer maçlar için benzer yapı...
];

// Mock istatistik verileri
const mockStatsData = [
  {
    id: "1",
    name: "FC25",
    icon: "Ellipse 45.png",
    stats: {
      wins: 5,
      losses: 2,
      draws: 2
    }
  },
  {
    id: "2",
    name: "NBA 2K25",
    icon: "Ellipse 45.png",
    stats: {
      wins: 0,
      losses: 0,
      draws: 0
    }
  },
  {
    id: "3",
    name: "FC24",
    icon: "Ellipse 45.png",
    stats: {
      wins: 3,
      losses: 2,
      draws: 1
    }
  },
  {
    id: "4",
    name: "NBA 2K24",
    icon: "Ellipse 45.png",
    stats: {
      wins: 0,
      losses: 0,
      draws: 0
    }
  }
];

// Mock maç geçmişi verileri
const mockHistoryData = [
  {
    id: "1",
    date: "12/12/2024 - 12:24",
    game: "FC 24",
    opponent: "username",
    prize: 90,
    result: "win" // win, lose, draw
  },
  {
    id: "2",
    date: "12/12/2024 - 12:24",
    game: "FC 24",
    opponent: "username",
    prize: 900,
    result: "lose"
  },
  {
    id: "3",
    date: "12/12/2024 - 12:24",
    game: "FC 24",
    opponent: "username",
    prize: 180,
    result: "win"
  },
  {
    id: "4",
    date: "12/12/2024 - 12:24",
    game: "FC 24",
    opponent: "username",
    prize: 350,
    result: "win"
  },
  {
    id: "5",
    date: "12/12/2024 - 12:24",
    game: "FC 24",
    opponent: "username",
    prize: 1800,
    result: "draw"
  }
];

const Profil = () => {
  const [userData, setUserData] = useState(mockUserData);
  const [matchesData, setMatchesData] = useState([]);
  const [statsData, setStatsData] = useState(mockStatsData);
  const [historyData, setHistoryData] = useState(mockHistoryData);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(3);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    handleResize();
    
    // Listen for window resize
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Get game icon helper function
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

  // Get user ID helper function
  const getUserId = () => {
    const userData = localStorage.getItem('user');
    if (!userData) return null;
    return JSON.parse(userData).id;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user data from localStorage
        const userStr = localStorage.getItem('user');
        let currentUsername = '';
        if (userStr) {
          try {
            const parsedData = JSON.parse(userStr);
            if (parsedData.user) {
              currentUsername = parsedData.user.username;
              setUserData({
                username: parsedData.user.username,
                userId: parsedData.user.id,
                balance: parsedData.balance || 0
              });
            }
          } catch (error) {
            console.error('LocalStorage veri parse hatası:', error);
          }
        }

        // Fetch recent matches
        const response = await challengeService.getMyActiveMatches('completed');
        if (response.success) {
          const { matches } = response.data;
          console.log('API Response - Matches:', matches); // Debug için eklendi
          
          // Format matches for the RecentMatches component
          const formattedMatches = matches
            .filter(match => match.status === 'completed')
            .map(match => {
              console.log('Processing match:', match); // Her maç için detayları görelim
              console.log('Current username:', currentUsername); // Mevcut kullanıcı adını görelim
              
              const isWinner = match.winner === currentUsername;
              console.log('Is winner?', isWinner); // Kazanan kontrolünü görelim
              
              return {
                id: match.id,
                result: isWinner ? 'win' : 'lose',
                player1: {
                  username: match.host.username,
                  console: match.host.platform,
                  avatar: match.host.avatarUrl || '/avatar.png'
                },
                player2: {
                  username: match.opponent.username,
                  console: match.opponent.platform,
                  avatar: match.opponent.avatarUrl || '/avatar.png'
                },
                game: {
                  name: match.game,
                  icon: getGameIcon(match.game)
                },
                prize: match.prize
              };
            })
            .slice(0, 10); // Get only the last 10 matches

          // Sort matches by completedAt date if available
          formattedMatches.sort((a, b) => {
            if (a.completedAt && b.completedAt) {
              return new Date(b.completedAt) - new Date(a.completedAt);
            }
            return 0;
          });

          console.log('Formatted Matches:', formattedMatches); // Son formatlanmış veriyi görelim
          setMatchesData(formattedMatches);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Veriler yüklenirken bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);
  
  // Sayfa değiştiğinde yeni verileri çek
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    // Gerçek API kullanımında:
    // fetchHistoryData(page);
  }, []);
  
  const onButonContainerClick = useCallback(() => {
    // Add your code here
  }, []);
  
  const onUserTopBarClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='ellipse']");
    if(anchor) {
      anchor.scrollIntoView({"block":"start","behavior":"smooth"})
    }
  }, []);

  const handleFriendsClick = useCallback(() => {
    console.log("Arkadaşlarım butonuna tıklandı");
    // Arkadaşlar sayfasına yönlendirme veya modal açma işlemi
  }, []);
  
  const handleSettingsClick = useCallback(() => {
    console.log("Ayarlar butonuna tıklandı");
    // Ayarlar sayfasına yönlendirme veya modal açma işlemi
  }, []);
  
  return (
    <div className={styles.profil}>
      <div className={styles.profilChild} data-scroll-to="ellipse" />
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      <Sidebar />
      <div className={styles.container}>
        <PageHeader headerTitle="Profilim"/>
        <div className={styles.containerInner}>
          <div className={styles.frameGroup}>
            <ProfileHeader 
              userData={userData} 
              onFriendsClick={handleFriendsClick}
              onSettingsClick={handleSettingsClick}
            />
            {loading ? (
              <div style={{ textAlign: 'center', padding: '20px', color: '#fff' }}>
                Veriler yükleniyor...
              </div>
            ) : (
              <>
                <RecentMatches matchesData={matchesData} />
                <Statistics statsData={statsData} />
                <MatchHistory 
                  historyData={historyData}
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profil;
