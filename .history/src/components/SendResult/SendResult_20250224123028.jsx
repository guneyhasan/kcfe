import React from 'react';
import styles from './SendResult.module.css';

const SendResult = ({ matchData, onBack }) => {
  return (
    <div className={styles.frameContainer} style={{
      background: 'rgba(0, 0, 0, 0.8)',
      borderRadius: '12px',
      padding: '16px',
      color: 'white',
      maxWidth: '500px',
      margin: '0 auto'
    }}>
      <div className={styles.frameDiv}>
        <div className={styles.avatarParent}>
          <img className={styles.avatarIcon1} alt="" src={matchData.player1.avatarUrl} />
          <div className={styles.fc2k24}>{matchData.gameName}</div>
        </div>
        <div className={styles.dakikaWrapper}>
          <div className={styles.dakika}>{`⏱ ${matchData.remainingTime} dakika `}</div>
        </div>
      </div>

      <div className={styles.cret}>
        <div className={styles.frameParent3}>
          <div className={styles.badgeBaseWrapper}>
            <div className={styles.badgeBase2}>
              <div className={styles.katlmCreti}>{`${matchData.entryFee}₺ Katılım Ücreti`}</div>
            </div>
          </div>
          <div className={styles.badgeBaseContainer}>
            <div className={styles.badgeBase2}>
              <div className={styles.bakiye250Tl}>{`${matchData.prize}₺ Ödül`}</div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.buttonBaseParent}>
        <button className={styles.buttonBase}>
          <div className={styles.maSalonu}>Kazandım</div>
        </button>
        <button className={styles.buttonBase1}>
          <div className={styles.maSalonu}>Kaybettim</div>
        </button>
        <button className={styles.buttonBase2} onClick={onBack}>
          <div className={styles.maSalonu}>Geri Dön</div>
        </button>
      </div>
    </div>
  );
};

export default SendResult;
