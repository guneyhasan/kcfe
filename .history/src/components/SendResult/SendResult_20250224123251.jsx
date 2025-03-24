import React, { useState } from 'react';
import styles from './SendResult.module.css';

const SendResult = ({ matchData, onBack }) => {
  const [selectedResult, setSelectedResult] = useState(null);
  const [screenshot, setScreenshot] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setScreenshot(file);
    }
  };

  return (
    <div className={styles.frameContainer}>
      <div className={styles.frameDiv}>
        <div className={styles.avatarParent}>
          <img className={styles.avatarIcon} alt="" src={matchData.player1.avatarUrl} />
          <div className={styles.gameName}>{matchData.gameName}</div>
        </div>
        <div className={styles.timeWrapper}>
          <div className={styles.time}>{`⏱ ${matchData.remainingTime} dakika`}</div>
        </div>
      </div>

      <div className={styles.playerInfo}>
        <div className={styles.player}>
          <img className={styles.playerAvatar} alt="" src={matchData.player1.avatarUrl} />
          <div className={styles.playerName}>{matchData.player1.username}</div>
        </div>
        <div className={styles.vs}>VS</div>
        <div className={styles.player}>
          <img className={styles.playerAvatar} alt="" src={matchData.player2.avatarUrl} />
          <div className={styles.playerName}>{matchData.player2.username}</div>
        </div>
      </div>

      <div className={styles.financials}>
        <div className={styles.fee}>
          <div className={styles.feeLabel}>{`${matchData.entryFee}₺ Katılım Ücreti`}</div>
        </div>
        <div className={styles.prize}>
          <div className={styles.prizeLabel}>{`${matchData.prize}₺ Ödül`}</div>
        </div>
      </div>

      <div className={styles.resultButtons}>
        <button 
          className={`${styles.resultButton} ${selectedResult === 'win' ? styles.selected : ''}`}
          onClick={() => setSelectedResult('win')}
        >
          Kazandım
        </button>
        <button 
          className={`${styles.resultButton} ${selectedResult === 'lose' ? styles.selected : ''}`}
          onClick={() => setSelectedResult('lose')}
        >
          Kaybettim
        </button>
      </div>

      <div className={styles.uploadSection}>
        <input
          type="file"
          id="screenshot"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        <label htmlFor="screenshot" className={styles.uploadButton}>
          {screenshot ? 'Ekran Görüntüsü Seçildi' : 'Ekran Görüntüsü Yükle'}
        </label>
      </div>

      <div className={styles.actionButtons}>
        <button 
          className={styles.submitButton}
          disabled={!selectedResult || !screenshot}
        >
          Sonucu Gönder
        </button>
        <button 
          className={styles.backButton}
          onClick={onBack}
        >
          Geri Dön
        </button>
      </div>
    </div>
  );
};

export default SendResult;
