import React from 'react';
import styles from '../ProfilePage.module.css';
import { Helmet } from 'react-helmet';

const RecentMatches = ({ matchesData }) => {
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
    gap: '16px',
    width: 'max-content'
  };

  return (
    <div className={styles.recentMatchesContainer}>
      <div className={styles.son10Ma}>Son 10 Maç</div>
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
              style={{ flex: '0 0 auto', minWidth: '280px' }}
            >
              <div className={styles.header}>
                <div className={styles.oyuncu2Parent}>
                  {/* İlk oyuncu */}
                  <div className={styles.oyuncu2}>
                    <div className={styles.oyuncu1Info}>
                      <div className={styles.username4}>{match.player1.username}</div>
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
                      <div className={styles.username5}>{match.player2.username}</div>
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
                  <img className={styles.oyunAdChild} alt="" src={match.game.icon} />
                  <div className={styles.nba2k25}>{match.game.name}</div>
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