import React from 'react';
import styles from './ResultLose.module.css';

const ResultLose = ({ matchData, onClose }) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.gameInfo}>
            <img className={styles.gameIcon} alt="" src={matchData.player1.avatarUrl} />
            <span className={styles.gameName}>{matchData.gameName}</span>
          </div>
          <div className={styles.timeInfo}>
            <span className={styles.time}>{`⏱ ${matchData.remainingTime} dakika`}</span>
          </div>
        </div>

        <div className={styles.playerInfo}>
          <img className={styles.playerAvatar} alt="" src={matchData.player2.avatarUrl} />
          <div className={styles.playerName}>{matchData.player2.username}</div>
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
      			