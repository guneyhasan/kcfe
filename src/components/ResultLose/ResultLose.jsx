import React, { useEffect, useState } from 'react';
import styles from './ResultLose.module.css';
// Add game image imports
import fc24Image from '../../images/Games/fc24.jpeg';
import fc25Image from '../../images/Games/fc25.jpeg';
import nba2k24Image from '../../images/Games/nba2k24.png';
import nba2k25Image from '../../images/Games/nba2k25.jpeg';

const ResultLose = ({ matchData, onClose }) => {
  const [currentUser, setCurrentUser] = useState(null);

  // Kullanıcı bilgilerini al
  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsedData = JSON.parse(userStr);
        setCurrentUser(parsedData.user);
      } catch (error) {
        console.error('Kullanıcı bilgileri alınamadı:', error);
      }
    }
  }, []);

  // Add game image selector function
  const getGameImage = (gameName) => {
    switch (gameName) {
      case 'FC 25':
        return fc25Image;
      case 'FC 24':
        return fc24Image;
      case 'NBA 2K24':
        return nba2k24Image;
      case 'NBA 2K25':
        return nba2k25Image;
      default:
        return null;
    }
  };

  const gameIcon = getGameImage(matchData.gameName);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.gameInfo}>
            {gameIcon ? (
              <img className={styles.gameIcon} alt="" src={gameIcon} />
            ) : (
              <img className={styles.gameIcon} alt="" src={matchData.player1.avatarUrl || '/avatar.png'} />
            )}
            <span className={styles.gameName}>{matchData.gameName}</span>
          </div>
          <div className={styles.timeInfo}>
            <span className={styles.time}>{`⏱ ${matchData.remainingTime} dakika`}</span>
          </div>
        </div>

        <div className={styles.playerInfo}>
          <img 
            className={styles.playerAvatar} 
            alt="" 
            src={currentUser?.avatarUrl || matchData.player2.avatarUrl || '/avatar.png'} 
          />
          <div className={styles.playerName}>
            {currentUser?.username || matchData.player2.username}
          </div>
        </div>

        <div className={styles.resultInfo}>
          <div className={styles.resultText}>Şanssızdın!</div>
        </div>

        <div className={styles.messageText}>
          Şansınızı yeniden denemek ister misiniz?
        </div>

        <div className={styles.actions}>
          <button className={styles.primaryButton} onClick={onClose}>
            Anasayfaya dön
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultLose;
      			