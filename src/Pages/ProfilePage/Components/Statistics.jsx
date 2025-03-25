import React, { useState, useEffect } from 'react';
import styles from '../ProfilePage.module.css';
import { Helmet } from 'react-helmet';

// Import game images
import fc24Image from '../../../images/Games/fc24.jpeg';
import fc25Image from '../../../images/Games/fc25.jpeg';
import nba2k24Image from '../../../images/Games/nba2k24.png';
import nba2k25Image from '../../../images/Games/nba2k25.jpeg';

const Statistics = ({ statsData }) => {
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

  return (
    <div className={styles.statistikParent}>
      <div className={styles.son10Ma}>İstatistik</div>
      
      {/* Mobil için kaydırma ipucu */}
      {isMobile && (
        <div className={styles.mobileScrollHint} style={{marginBottom: '10px'}}>
          Sağa ve sola kaydırabilirsiniz
        </div>
      )}
      
      <div className={styles.drawParent} style={{
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        display: 'flex',
        flexDirection: 'row',
        gap: isMobile ? '10px' : '13px',
        width: '100%',
        paddingBottom: '8px'
      }}>
        {statsData.map((game) => (
          <div key={game.id} className={styles.draw1} style={{
            flex: isMobile ? '0 0 auto' : 'inherit',
            minWidth: isMobile ? '160px' : '190px'
          }}>
            <div className={styles.row5}>
              <div className={styles.oyunAd1}>
                <img className={styles.oyunAdChild} alt="" src={getGameIcon(game.name)} />
                <div className={styles.nba2k25}>{game.name}</div>
              </div>
              <div className={styles.win5Parent}>
                <div className={styles.win5}>Win: {game.stats.wins}</div>
                <div className={styles.lose21}>Lose: {game.stats.losses}</div>
                <div className={styles.draw2}>Draw: {game.stats.draws}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics; 