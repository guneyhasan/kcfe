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

  // Get game icon helper function
  const getGameIcon = (gameName) => {
    if (!gameName) return '/avatar.png';
    
    switch (gameName.toLowerCase()) {
      case 'fc24':
        return fc24Image;
      case 'fc25':
        return fc25Image;
      case 'nba2k24':
        return nba2k24Image;
      case 'nba2k25':
        return nba2k25Image;
      default:
        return '/avatar.png'; // Fallback image
    }
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

  return (
    <div className={styles.recentMatchesContainer}>
      <div className={styles.son10Ma}>Son 10 Maç</div>
      
      {/* Mobil için kaydırma ipucu */}
      {isMobile && (
        <div className={styles.mobileScrollHint} style={{marginBottom: '10px'}}>
          Sağa ve sola kaydırabilirsiniz
        </div>
      )}
      
      <div 
        className={styles.matchesScrollContainer} 
        style={scrollContainerStyle}
      >
        <div 
          className={styles.winParent}
          style={matchesRowStyle}
        >
          {matchesData.map((match, index) => (
            <div 
              key={match.id} 
              className={`${styles.matchCard} ${match.result === 'win' ? styles.win : styles.lose}`}
              style={{ 
                flex: '0 0 auto', 
                minWidth: isMobile ? '240px' : '280px',
                maxWidth: isMobile ? '280px' : '320px'
              }}
            >
              <div className={styles.header}>
                <div className={styles.oyuncu2Parent}>
                  {/* İlk oyuncu */}
                  <div className={styles.oyuncu2}>
                    <div className={styles.oyuncu1Info}>
                      <div className={styles.username4}>{isMobile && match.player1.username.length > 8 
                        ? `${match.player1.username.substring(0, 8)}...` 
                        : match.player1.username}
                      </div>
                      <div className={styles.konsol}>{match.player1.console}</div>
                    </div>
                    <img className={styles.avatarIcon2} alt="" src={match.player1.avatar || '/avatar.png'} />
                  </div>
                  
                  {/* VS */}
                  <div className={styles.vs}>
                    <div className={styles.vs1}>VS</div>
                  </div>
                  
                  {/* İkinci oyuncu */}
                  <div className={styles.oyuncu3}>
                    <img className={styles.avatarIcon2} alt="" src={match.player2.avatar || '/avatar.png'} />
                    <div className={styles.oyuncu1Info1}>
                      <div className={styles.username5}>{isMobile && match.player2.username.length > 8 
                        ? `${match.player2.username.substring(0, 8)}...` 
                        : match.player2.username}
                      </div>
                      <div className={styles.konsol1}>{match.player2.console}</div>
                    </div>
                  </div>
                  
                  {/* Sonuç */}
                  <div className={match.result === 'win' ? styles.winWrapper : styles.loseWrapper}>
                    <div className={styles.win1}>{match.result === 'win' ? 'WIN' : 'LOSE'}</div>
                  </div>
                </div>
              </div>
              
              {/* Alt kısım - Oyun ve ödül bilgisi */}
              <div className={styles.row}>
                <div className={styles.oyunAd}>
                  <img className={styles.oyunAdChild} alt="" src={match.game && match.game.icon 
                    ? match.game.icon 
                    : getGameIcon(match.game ? match.game.name : null)} />
                  <div className={styles.nba2k25}>{match.game ? match.game.name : 'Oyun'}</div>
                </div>
                <div className={styles.cret}>
                  <div className={styles.badgeBaseWrapper}>
                    <div className={styles.badgeBase}>
                      <div className={styles.bakiye250Tl}>{match.prize}₺ Ödül</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentMatches; 