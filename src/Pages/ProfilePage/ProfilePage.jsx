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
import { StatisticsService } from '../../services/statisticsService';
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
  const [statsData, setStatsData] = useState([]);
  const [historyData, setHistoryData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [allHistoryData, setAllHistoryData] = useState([]);
  const [itemsPerPage] = useState(5);
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
    // Normalize game name for more reliable matching
    const normalizedName = String(gameName).toUpperCase();
    
    if (normalizedName.includes('FC24') || normalizedName.includes('FIFA 24') || normalizedName.includes('FIFA24')) {
      return fc24Image;
    } else if (normalizedName.includes('FC25') || normalizedName.includes('FIFA 25') || normalizedName.includes('FIFA25')) {
      return fc25Image;
    } else if (normalizedName.includes('NBA2K24') || normalizedName.includes('NBA 2K24') || normalizedName.includes('NBA24')) {
      return nba2k24Image;
    } else if (normalizedName.includes('NBA2K25') || normalizedName.includes('NBA 2K25') || normalizedName.includes('NBA25')) {
      return nba2k25Image;
    } else {
      // Fallback to first available image if no match
      console.log(`No matching icon found for game: ${gameName}`);
      return fc25Image;
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
        let userId = null;
        if (userStr) {
          try {
            const parsedData = JSON.parse(userStr);
            console.log('Raw localStorage user data:', parsedData);
            
            // Extract username consistently for all localStorage formats
            if (parsedData.user && parsedData.user.username) {
              currentUsername = parsedData.user.username;
              userId = parsedData.user.id;
              setUserData({
                username: parsedData.user.username,
                userId: parsedData.user.id,
                balance: parsedData.balance || 0
              });
            } else if (parsedData.username) {
              currentUsername = parsedData.username;
              userId = parsedData.id;
              setUserData({
                username: parsedData.username,
                userId: parsedData.id,
                balance: parsedData.balance || 0
              });
            }
            
            console.log('Extracted username from localStorage:', currentUsername);
          } catch (error) {
            console.error('LocalStorage veri parse hatası:', error);
          }
        }

        // Fetch statistics from the API
        try {
          const statsResponse = await StatisticsService.getUserProfileStats();
          console.log('Statistics API Response:', statsResponse);
          
          if (statsResponse.success) {
            const { gameStats } = statsResponse.data;
            
            if (Array.isArray(gameStats) && gameStats.length > 0) {
              // Format stats data for the Statistics component
              const formattedStatsData = gameStats.map((gameStat, index) => {
                // API returns challengeId, not game object with title
                // We'll use a generic game name based on challengeId
                const gameTitle = `Oyun ${gameStat.challengeId || index + 1}`;
                
                return {
                  id: String(gameStat.challengeId || index + 1),
                  name: gameTitle,
                  icon: getGameIcon('FC25'), // Default to FC25 since we don't have game name
                  stats: {
                    wins: gameStat.wins || 0,
                    losses: gameStat.losses || 0,
                    draws: gameStat.draws || 0
                  }
                };
              });
              
              console.log('Formatted Stats Data:', formattedStatsData);
              setStatsData(formattedStatsData);
            } else {
              console.warn('No game stats found in API response:', statsResponse);
              // Show default placeholder
              setStatsData([{
                id: "1",
                name: "FC 25",
                icon: fc25Image,
                stats: {
                  wins: 0,
                  losses: 0,
                  draws: 0
                }
              }]);
            }
          } else {
            console.error('Statistics API returned an error:', statsResponse);
            toast.error('İstatistikler yüklenemedi');
          }
        } catch (statsError) {
          console.error('Error fetching statistics:', statsError);
          toast.error('İstatistikler yüklenirken bir hata oluştu');
          
          // In case of error, we can still show some placeholder data
          setStatsData([{
            id: "1",
            name: "FC 25",
            icon: fc25Image,
            stats: {
              wins: 0,
              losses: 0,
              draws: 0
            }
          }]);
        }

        // Fetch recent matches
        const response = await challengeService.getMyActiveMatches('completed');
        if (response.success) {
          const { matches } = response.data;
          console.log('API Response - Matches:', matches); // Debug için eklendi
          console.log('Current user from localStorage:', currentUsername);
          
          // Log full raw match data for the first match to help debugging
          if (matches && matches.length > 0) {
            console.log('Full raw data structure of first match:', JSON.stringify(matches[0], null, 2));
            console.log('Available fields on first match:', Object.keys(matches[0]));
            
            // Check if specific fields we're interested in exist
            const firstMatch = matches[0];
            console.log('Host declared exists?', 'hostDeclared' in firstMatch, firstMatch.hostDeclared);
            console.log('Opponent declared exists?', 'opponentDeclared' in firstMatch, firstMatch.opponentDeclared);
            console.log('Winner exists?', 'winner' in firstMatch, firstMatch.winner);
            console.log('Result exists?', 'result' in firstMatch, firstMatch.result);
          }
          
          // First get all completed matches
          const completedMatches = matches.filter(match => match.status === 'completed');
          
          // Sort by timestamp (newest first)
          completedMatches.sort((a, b) => {
            const getTimestamp = (match) => {
              // Tarihi önce completedAt, yoksa createdAt, yoksa updatedAt olarak al
              const dateStr = match.completedAt || match.createdAt || match.updatedAt;
              if (!dateStr) return 0;
              
              // Tarih string'i varsa Date objesine çevir
              try {
                return new Date(dateStr).getTime();
              } catch (e) {
                console.error('Date parsing error:', e);
                return 0;
              }
            };
            
            return getTimestamp(b) - getTimestamp(a); // En yeni maçlar önce
          });
          
          console.log('Raw API matches sorted by date (newest first):', 
            completedMatches.map(m => ({
              id: m.id, 
              date: m.completedAt || m.createdAt || m.updatedAt
            }))
          );
          
          // İlk 10 maçı formatla (en yeni 10 maç)
          const topTenMatches = completedMatches.slice(0, 10);
          
          // Format matches for the RecentMatches component
          const formattedMatches = topTenMatches
            .map(match => {
              // Get current username from localStorage consistently
              const userStr = localStorage.getItem('user');
              let currentUsername = '';
              
              try {
                const parsedData = JSON.parse(userStr);
                // Handle both possible user data structures
                currentUsername = parsedData.user?.username || parsedData.username || '';
              } catch (error) {
                console.error('LocalStorage parsing error:', error);
              }
              
              // Comprehensive logging for debugging
              console.log('------ Match ID:', match.id, '------');
              console.log('Host username:', match.host.username);
              console.log('Opponent username:', match.opponent.username);
              console.log('Winner from API:', match.winner);
              console.log('Match result:', match.result);
              console.log('Match completedAt:', match.completedAt);
              console.log('Match createdAt:', match.createdAt);
              console.log('Current localStorage username:', currentUsername);
              
              // Check if the current user participated in this match
              const isCurrentUserHost = match.host.username === currentUsername;
              const isCurrentUserOpponent = match.opponent.username === currentUsername;
              let isWinner = false;
              let actualWinner = '';
              let matchResult = 'draw'; // Default result değerini tanımla
              
              // First check if the API explicitly declares the winner
              if (match.winner && typeof match.winner === 'string') {
                actualWinner = match.winner;
                if (actualWinner === currentUsername) {
                  matchResult = 'win';
                  isWinner = true;
                } else if (actualWinner === 'Draw' || actualWinner.toLowerCase() === 'draw') {
                  matchResult = 'draw';
                  isWinner = false;
                } else {
                  matchResult = 'lose';
                  isWinner = false;
                }
              }
              // If winner is undefined but we have hostDeclared and opponentDeclared fields
              else if (match.hostDeclared && match.opponentDeclared) {
                console.log('Host declared:', match.hostDeclared);
                console.log('Opponent declared:', match.opponentDeclared);
                
                // If both players declared the same winner
                if (match.hostDeclared === match.opponentDeclared) {
                  actualWinner = match.hostDeclared;
                  if (actualWinner === currentUsername) {
                    matchResult = 'win';
                    isWinner = true;
                  } else if (actualWinner === 'Draw' || actualWinner.toLowerCase() === 'draw') {
                    matchResult = 'draw';
                    isWinner = false;
                  } else {
                    matchResult = 'lose';
                    isWinner = false;
                  }
                  console.log('Both players declared the same winner:', actualWinner);
                }
                // If declarations don't match, use special logic
                else {
                  // Use the opponent's declaration as a fallback (based on API data pattern)
                  actualWinner = match.opponentDeclared;
                  if (actualWinner === currentUsername) {
                    matchResult = 'win';
                    isWinner = true;
                  } else if (actualWinner === 'Draw' || actualWinner.toLowerCase() === 'draw') {
                    matchResult = 'draw';
                    isWinner = false;
                  } else {
                    matchResult = 'lose';
                    isWinner = false;
                  }
                  console.log('Declarations differ, using opponent declared winner:', actualWinner);
                }
              }
              // Use result field if available
              else if (match.result) {
                // The "result" field indicates if the host won or lost
                if (match.result === 'win') {
                  // Host won
                  actualWinner = match.host.username;
                  if (isCurrentUserHost) {
                    matchResult = 'win';
                    isWinner = true;
                  } else {
                    matchResult = 'lose';
                    isWinner = false;
                  }
                  console.log('Using result field: host won');
                } else if (match.result === 'lose') {
                  // Host lost, opponent won
                  actualWinner = match.opponent.username;
                  if (isCurrentUserOpponent) {
                    matchResult = 'win';
                    isWinner = true;
                  } else {
                    matchResult = 'lose';
                    isWinner = false;
                  }
                  console.log('Using result field: opponent won');
                } else {
                  // Draw or other result
                  actualWinner = 'Draw';
                  matchResult = 'draw';
                  isWinner = false;
                  console.log('Using result field: match was a draw');
                }
              }
              // If all else fails, check for results in the match
              else if (match.results) {
                console.log('Found results field:', match.results);
                // Use the winner field from results if it exists
                if (match.results.winner) {
                  actualWinner = match.results.winner;
                  if (actualWinner === currentUsername) {
                    matchResult = 'win';
                    isWinner = true;
                  } else if (actualWinner === 'Draw' || actualWinner.toLowerCase() === 'draw') {
                    matchResult = 'draw';
                    isWinner = false;
                  } else {
                    matchResult = 'lose';
                    isWinner = false;
                  }
                  console.log('Using winner from results field:', actualWinner);
                }
                // If no winner in results, check hostDeclared and opponentDeclared
                else if (match.results.hostDeclared && match.results.opponentDeclared) {
                  if (match.results.hostDeclared === match.results.opponentDeclared) {
                    actualWinner = match.results.hostDeclared;
                    if (actualWinner === currentUsername) {
                      matchResult = 'win';
                      isWinner = true;
                    } else if (actualWinner === 'Draw' || actualWinner.toLowerCase() === 'draw') {
                      matchResult = 'draw';
                      isWinner = false;
                    } else {
                      matchResult = 'lose';
                      isWinner = false;
                    }
                    console.log('Using declared winner from results field:', actualWinner);
                  }
                }
              } 
              // If no winner can be determined, just mark as unknown/draw
              else {
                actualWinner = 'Unknown';
                matchResult = 'draw';
                isWinner = false;
                console.log('Could not determine winner, marking as unknown');
              }
              
              console.log('Determined winner:', actualWinner || 'Unknown');
              console.log('Is current user the winner?', matchResult === 'win');
              console.log('---------------------------');
              
              // Always set the current user as player1 and the opponent as player2 for clearer UI
              // This ensures the current user always appears on the left in the match display
              const isUserHost = match.host.username === currentUsername;
              
              return {
                id: match.id,
                result: matchResult,
                player1: {
                  username: isUserHost ? match.host.username : match.opponent.username,
                  console: isUserHost ? match.host.platform : match.opponent.platform,
                  avatar: isUserHost ? (match.host.avatarUrl || '/avatar.png') : (match.opponent.avatarUrl || '/avatar.png')
                },
                player2: {
                  username: isUserHost ? match.opponent.username : match.host.username,
                  console: isUserHost ? match.opponent.platform : match.host.platform,
                  avatar: isUserHost ? (match.opponent.avatarUrl || '/avatar.png') : (match.host.avatarUrl || '/avatar.png')
                },
                game: {
                  name: match.game,
                  icon: getGameIcon(match.game)
                },
                prize: match.prize,
                isWinner: matchResult === 'win',
                winnerUsername: actualWinner || '',
                isDraw: matchResult === 'draw',
                winner: match.winner
              };
            });

          // Son 10 maç zaten sıralanmış durumda
          console.log('Recent 10 matches (newest first):', formattedMatches);
          setMatchesData(formattedMatches);
          
          // Format the same match data for history view - use the already sorted completedMatches
          const formattedHistoryData = completedMatches
            .map(match => {
              // Get current username from localStorage
              const userStr = localStorage.getItem('user');
              let currentUsername = '';
              
              try {
                const parsedData = JSON.parse(userStr);
                // Handle both possible user data structures
                currentUsername = parsedData.user?.username || parsedData.username || '';
              } catch (error) {
                console.error('LocalStorage parsing error:', error);
              }
              
              // Determine if current user is host or opponent
              const isCurrentUserHost = match.host.username === currentUsername;
              const isCurrentUserOpponent = match.opponent.username === currentUsername;
              
              // Set opponent as the other user (not the current user)
              const opponent = isCurrentUserHost ? match.opponent.username : match.host.username;
              
              let actualWinner = '';
              let result = 'draw'; // Default to draw
              
              // First check if the API explicitly declares the winner
              if (match.winner && typeof match.winner === 'string') {
                actualWinner = match.winner;
                if (actualWinner === currentUsername) {
                  result = 'win';
                } else if (actualWinner === 'Draw' || actualWinner.toLowerCase() === 'draw') {
                  result = 'draw';
                } else {
                  result = 'lose';
                }
              }
              // If winner is undefined but we have hostDeclared and opponentDeclared fields
              else if (match.hostDeclared && match.opponentDeclared) {
                // If both players declared the same winner
                if (match.hostDeclared === match.opponentDeclared) {
                  actualWinner = match.hostDeclared;
                  if (actualWinner === currentUsername) {
                    result = 'win';
                  } else if (actualWinner === 'Draw' || actualWinner.toLowerCase() === 'draw') {
                    result = 'draw';
                  } else {
                    result = 'lose';
                  }
                }
              }
              // Check for results field that contains winner information
              else if (match.results) {
                console.log('History: Found results field:', match.results);
                // Use the winner field from results if it exists
                if (match.results.winner) {
                  actualWinner = match.results.winner;
                  if (actualWinner === currentUsername) {
                    result = 'win';
                  } else if (actualWinner === 'Draw' || actualWinner.toLowerCase() === 'draw') {
                    result = 'draw';
                  } else {
                    result = 'lose';
                  }
                  console.log('History: Using winner from results field:', actualWinner);
                }
                // If no winner in results, check hostDeclared and opponentDeclared
                else if (match.results.hostDeclared && match.results.opponentDeclared) {
                  if (match.results.hostDeclared === match.results.opponentDeclared) {
                    actualWinner = match.results.hostDeclared;
                    if (actualWinner === currentUsername) {
                      result = 'win';
                    } else if (actualWinner === 'Draw' || actualWinner.toLowerCase() === 'draw') {
                      result = 'draw';
                    } else {
                      result = 'lose';
                    }
                    console.log('History: Using declared winner from results field:', actualWinner);
                  }
                }
              }
              // Use result field if available
              else if (match.result) {
                if (match.result === 'win') {
                  // Host won
                  actualWinner = match.host.username;
                  result = isCurrentUserHost ? 'win' : 'lose';
                  console.log('History: Using result field - host won');
                } else if (match.result === 'lose') {
                  // Host lost
                  actualWinner = match.opponent.username;
                  result = isCurrentUserOpponent ? 'win' : 'lose';
                  console.log('History: Using result field - opponent won');
                } else {
                  // Draw
                  result = 'draw';
                  console.log('History: Using result field - draw');
                }
              }
              
              console.log(`History: Match ${match.id} - Winner: ${actualWinner}, Result for ${currentUsername}: ${result}`);
              
              // Format date (assuming completedAt or createdAt exists in the API response)
              const date = match.completedAt ? new Date(match.completedAt) : new Date(match.createdAt || Date.now());
              const formattedDate = `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} - ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`;
              
              return {
                id: match.id,
                date: formattedDate,
                game: match.game,
                opponent: opponent,
                prize: match.prize,
                result: result
              };
            });
          
          // History data already sorted by the API data sorting
          console.log('Formatted History Data (newest first):', formattedHistoryData);
          setAllHistoryData(formattedHistoryData);
          
          // Calculate total pages
          const calculatedTotalPages = Math.ceil(formattedHistoryData.length / itemsPerPage);
          setTotalPages(calculatedTotalPages > 0 ? calculatedTotalPages : 1);
          
          // Set initial page data
          const startIndex = (currentPage - 1) * itemsPerPage;
          const endIndex = startIndex + itemsPerPage;
          setHistoryData(formattedHistoryData.slice(startIndex, endIndex));
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
  
  // Update page data when page changes
  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    
    // Update displayed history data based on selected page
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setHistoryData(allHistoryData.slice(startIndex, endIndex));
  }, [allHistoryData, itemsPerPage]);
  
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
