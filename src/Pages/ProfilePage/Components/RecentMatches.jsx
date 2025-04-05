import React, { useState, useEffect } from 'react';
import styles from '../ProfilePage.module.css';
import { Helmet } from 'react-helmet';

// Import game images
import fc24Image from '../../../images/Games/fc24.jpeg';
import fc25Image from '../../../images/Games/fc25.jpeg';
import nba2k24Image from '../../../images/Games/nba2k24.png';
import nba2k25Image from '../../../images/Games/nba2k25.jpeg';

const RecentMatches = ({ matchesData }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [currentUsername, setCurrentUsername] = useState('');
  
  // Get current user from localStorage
  useEffect(() => {
    try {
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const parsedData = JSON.parse(userStr);
        // Handle both possible user data structures
        setCurrentUsername(parsedData.user?.username || parsedData.username || '');
      }
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
    }
  }, []);
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Check on window resize
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  useEffect(() => {
    // Debug logging for match data
    if (matchesData && matchesData.length > 0) {
      console.log('RecentMatches received data:', matchesData);
      console.log('Current username:', currentUsername);
    }
  }, [matchesData, currentUsername]);

  // Get game icon helper function with more robust handling
  const getGameIcon = (gameName) => {
    if (!gameName) return '/avatar.png';
    
    const name = gameName.toString().toLowerCase().trim();
    
    if (name.includes('fc24') || name.includes('fc 24') || name.includes('fifa24')) {
      return fc24Image;
    } else if (name.includes('fc25') || name.includes('fc 25') || name.includes('fifa25')) {
      return fc25Image;
    } else if (name.includes('nba2k24') || name.includes('nba 2k24') || name.includes('2k24')) {
      return nba2k24Image;
    } else if (name.includes('nba2k25') || name.includes('nba 2k25') || name.includes('2k25')) {
      return nba2k25Image;
    }
    
    return '/avatar.png'; // Fallback image
  };

  // Inline stil tanımları
  const scrollContainerStyle = {
    overflowX: 'auto',
    whiteSpace: 'nowrap',
    WebkitOverflowScrolling: 'touch',
    width: '100%'
  };
  
  const matchesRowStyle = {
    display: 'flex',
    flexDirection: 'row',
    gap: isMobile ? '10px' : '16px',
    width: 'max-content'
  };

  // Function to truncate usernames for mobile display
  const truncateUsername = (username, maxLength = 8) => {
    if (!username) return 'Unknown';
    if (isMobile && username.length > maxLength) {
      return `${username.substring(0, maxLength)}...`;
    }
    return username;
  };

  // Function to get appropriate background and border styling based on match result
  const getResultStyle = (match) => {
    // Draw condition - check all possible draw indicators
    if (match.isDraw || match.result === 'draw' || match.winner === 'draw') {
      return {
        backgroundColor: '#1A1A1A',
        boxShadow: '0 0 20px rgba(255, 202, 44, 0.5), 0 0 10px rgba(255, 202, 44, 0.7)',
        border: '1px solid rgba(255, 202, 44, 0.6)',
      };
    }
    
    // Win condition
    if (match.result === 'win') {
      return {
        backgroundColor: '#1A1A1A',
        boxShadow: '0 0 20px rgba(76, 175, 80, 0.5), 0 0 10px rgba(76, 175, 80, 0.7)',
        border: '1px solid rgba(76, 175, 80, 0.6)',
      };
    }
    
    // Loss condition
    return {
      backgroundColor: '#1A1A1A',
      boxShadow: '0 0 20px rgba(255, 77, 77, 0.5), 0 0 10px rgba(255, 77, 77, 0.7)',
      border: '1px solid rgba(255, 77, 77, 0.6)',
    };
  };

  // Function to get player styling based on match result
  const getPlayerStyle = (isWinner, isDraw) => {
    // Check for draw condition
    if (isDraw) {
      return {
        backgroundColor: '#7d6b22', 
        borderRadius: '8px', 
        padding: '4px', 
        opacity: '0.9', 
        border: 'none',
        boxShadow: 'none'
      };
    }
    
    return isWinner ? 
      {
        backgroundColor: '#2a4d2a', 
        borderRadius: '8px', 
        padding: '4px', 
        position: 'relative',
        boxShadow: 'none'
      } : 
      {
        backgroundColor: '#772222', 
        borderRadius: '8px', 
        padding: '4px', 
        opacity: '0.9', 
        border: 'none',
        boxShadow: 'none'
      };
  };

  return (
    <div className={styles.recentMatchesContainer}>
      <div className={styles.son10Ma}>Son 10 Maç</div>
      
      {/* No matches message */}
      {(!matchesData || matchesData.length === 0) && (
        <div style={{ textAlign: 'center', color: '#fff', padding: '20px' }}>
          Henüz tamamlanmış maçınız bulunmamaktadır.
        </div>
      )}
      
      {/* Mobil için kaydırma ipucu */}
      {isMobile && matchesData && matchesData.length > 0 && (
        <div className={styles.mobileScrollHint} style={{marginBottom: '10px'}}>
          Sağa ve sola kaydırabilirsiniz
        </div>
      )}
      
      {matchesData && matchesData.length > 0 && (
        <div 
          className={styles.matchesScrollContainer} 
          style={scrollContainerStyle}
        >
          <div 
            className={styles.winParent}
            style={matchesRowStyle}
          >
            {[...matchesData].reverse().map((match, index) => {
              // Determine if this player is the winner
              const player1IsWinner = match.player1.username === match.winnerUsername;
              const player2IsWinner = match.player2.username === match.winnerUsername;
              // Check for draw from multiple possible sources
              const isDraw = match.isDraw || match.result === 'draw' || match.winner === 'draw' || match.winnerUsername === 'Draw';
              
              const resultStyle = getResultStyle(match);
              
              return (
                <div 
                  key={match.id || index}
                  style={{
                    padding: '8px',
                    borderRadius: '12px',
                    margin: isMobile ? '5px' : '8px',
                    transition: 'all 0.3s ease',
                    ...resultStyle
                  }}
                >
                  <div 
                    className={`${styles.matchCard}`}
                    style={{ 
                      flex: '0 0 auto', 
                      minWidth: isMobile ? '240px' : '280px',
                      maxWidth: isMobile ? '280px' : '320px',
                      position: 'relative',
                      boxShadow: 'none',
                      borderRadius: '10px',
                      overflow: 'visible',
                      border: 'none'
                    }}
                  >
                    <div className={styles.header}>
                      <div className={`${styles.oyuncu2Parent}`} style={{ overflow: 'visible', position: 'relative' }}>
                        {/* İlk oyuncu (her zaman giriş yapan kullanıcı) */}
                        <div 
                          className={`${styles.oyuncu2}`} 
                          style={getPlayerStyle(player1IsWinner, isDraw)}
                        >
                          <div className={styles.oyuncu1Info}>
                            <div className={styles.username4} style={{ color: !player1IsWinner && !isDraw ? '#ff9999' : isDraw ? '#ffd580' : '#ffffff' }}>
                              {truncateUsername(match.player1.username)}
                            </div>
                            <div className={styles.konsol}>{match.player1.console !== "Unknown" ? match.player1.console : "PlayStation"}</div>
                          </div>
                          <img className={styles.avatarIcon2} alt="" src={match.player1.avatar || '/avatar.png'} />
                        </div>
                        
                        {/* VS */}
                        <div className={styles.vs}>
                          <div className={styles.vs1}>VS</div>
                        </div>
                        
                        {/* İkinci oyuncu (rakip) */}
                        <div 
                          className={`${styles.oyuncu3}`} 
                          style={getPlayerStyle(player2IsWinner, isDraw)}
                        >
                          <img className={styles.avatarIcon2} alt="" src={match.player2.avatar || '/avatar.png'} />
                          <div className={styles.oyuncu1Info1}>
                            <div className={styles.username5} style={{ color: !player2IsWinner && !isDraw ? '#ff9999' : isDraw ? '#ffd580' : '#ffffff' }}>
                              {truncateUsername(match.player2.username)}
                            </div>
                            <div className={styles.konsol1}>{match.player2.console !== "Unknown" ? match.player2.console : "PlayStation"}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Alt kısım - Oyun ve ödül bilgisi */}
                    <div className={styles.row}>
                      <div className={styles.gameAndPrizeContainer}>
                        <div className={styles.oyunAd}>
                          <img 
                            className={styles.oyunAdChild} 
                            alt={match.game ? match.game.name : 'Game Icon'} 
                            src={match.game?.icon || getGameIcon(match.game?.name)}
                            onError={(e) => {
                              e.target.onerror = null; // Prevent infinite loop
                              e.target.src = getGameIcon(match.game?.name);
                            }}
                          />
                          <div className={styles.nba2k25}>{match.game ? match.game.name : 'Oyun'}</div>
                        </div>
                        <div className={styles.cret}>
                          <div className={styles.badgeBaseWrapper}>
                            <div className={styles.badgeBase}>
                              <div 
                                className={styles.bakiye250Tl}
                                style={isDraw ? { color: '#ffca2c' } : !match.isWinner ? { color: '#ff4d4d' } : {}}
                              >
                                {Math.floor(match.prize || 0)}₺ Ödül
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default RecentMatches; 