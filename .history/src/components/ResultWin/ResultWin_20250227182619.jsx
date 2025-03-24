import React from 'react';
import styles from './ResultWin.module.css';

const ResultWin = ({ matchData, onClose }) => {
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
          <img className={styles.playerAvatar} alt="" src={matchData.player1.avatarUrl} />
          <div className={styles.playerName}>{matchData.player1.username}</div>
        </div>

        <div className={styles.prizeInfo}>
          <div className={styles.prizeTitle}>Tebrikler Ödülün</div>
          <div className={styles.prizeAmount}>{`${matchData.prize}₺`}</div>
        </div>

        <div className={styles.messageText}>
          Sonuçlar doğrulandığında ödül hesabınıza yansıtılacaktır.
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

export default ResultWin;
