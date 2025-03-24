import React from 'react';
import styles from '../../Pages/SalonPage/Salon.module.css';

const MatchDetails = ({ matchData, matchStarted, onButonContainerClick, onCancelRequestClick, onReportResultClick }) => {
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
      <div className={styles.frameParent1}>
        <div className={styles.frameParent2}>
          <div className={styles.frameWrapper}>
            <div className={styles.avatarGroup}>
              <img className={styles.avatarIcon2} alt="" src={matchData.player1.avatarUrl} />
              <div className={styles.usernameParent}>
                <div className={styles.username2}>{matchData.player1.username}</div>
                <div className={styles.badgeBase}>
                  <img className={styles.avatarIcon3} alt="" src={matchData.player1.avatarUrl} />
                  <div className={styles.text1}>{`PS5 ID: ${matchData.player1.ps5Id}`}</div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.vs}>
            <b className={styles.vs1}>VS</b>
          </div>
          <div className={styles.frameWrapper}>
            <div className={styles.avatarGroup}>
              <img className={styles.avatarIcon2} alt="" src={matchData.player2.avatarUrl} />
              <div className={styles.usernameParent}>
                <div className={styles.username2}>{matchData.player2.username}</div>
                <div className={styles.badgeBase}>
                  <img className={styles.avatarIcon3} alt="" src={matchData.player2.avatarUrl} />
                  <div className={styles.text1}>{`PS5 ID: ${matchData.player2.ps5Id}`}</div>
                </div>
              </div>
            </div>
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
      </div>
      <div className={styles.frameWrapper2}>
        <div className={styles.buttonBaseParent}>
          {!matchStarted ? (
            <>
              <button 
                className={styles.buttonBase}
                onClick={onButonContainerClick}
              >
                <div className={styles.maSalonu}>Maça Başladım!</div>
              </button>
              <button 
                className={styles.buttonBase1}
                onClick={onCancelRequestClick}
              >
                <div className={styles.maSalonu}>İptal Talebi Gönder</div>
              </button>
            </>
          ) : (
            <button 
              className={styles.buttonBaseSonucuRaporla}
              onClick={onReportResultClick}
            >
              <div className={styles.maSalonu}>Sonucu Raporla</div>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetails; 