import React, { useMemo } from 'react';
import styles from '../../Pages/SalonPage/Salon.module.css';
// Import game images
import fc24Image from '../../images/Games/fc24.jpeg';
import fc25Image from '../../images/Games/fc25.jpeg';
import nba2k24Image from '../../images/Games/nba2k24.png';
import nba2k25Image from '../../images/Games/nba2k25.jpeg';
import PSlogo from '../../images/konsolLogoları/PSlogo.png';

const MatchDetails = ({ matchData, matchStarted, onButonContainerClick, onCancelRequestClick, onReportResultClick }) => {
  // Generate random 9-digit PlayStation IDs for display
  const randomPs5Id1 = useMemo(() => {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  }, []);

  const randomPs5Id2 = useMemo(() => {
    return Math.floor(100000000 + Math.random() * 900000000).toString();
  }, []);
  
  if (!matchData || !matchData.player1 || !matchData.player2) {
    return <div>Yükleniyor...</div>;
  }

  // Get the appropriate game image based on game name
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

  // Custom style for blurred text
  const blurredStyle = {
    filter: 'blur(3px)',
    WebkitFilter: 'blur(3px)',
    letterSpacing: '0.5px'
  };

  return (
    <div className={styles.frameContainer}>
      <div className={styles.frameDiv}>
        <div className={styles.avatarParent}>
          {gameIcon ? (
            <img className={styles.avatarIcon1} alt="" src={gameIcon} />
          ) : (
            <img className={styles.avatarIcon1} alt="" src={matchData.player1.avatarUrl || '/avatar.png'} />
          )}
          <div className={styles.fc2k24}>{matchData.gameName}</div>
        </div>
        <div className={styles.dakikaWrapper}>
          <div className={styles.dakika} style={{ color: matchData.remainingTime.startsWith("00") ? '#ff6b6b' : '#fff' }}>
            ⏱ {matchData.remainingTime} dakika
          </div>
        </div>
      </div>
      <div className={styles.frameParent1}>
        <div className={styles.frameParent2}>
          <div className={styles.frameWrapper}>
            <div className={styles.avatarGroup}>
              <img className={styles.avatarIcon2} alt="" src={matchData.player1.avatarUrl || '/avatar.png'} />
              <div className={styles.usernameParent}>
                <div className={styles.username2}>{matchData.player1.username}</div>
                <div className={styles.badgeBase}>
                  <img className={styles.avatarIcon3} alt="PS Logo" src={PSlogo} />
                  <div className={styles.text1}>
                    PS5 ID: <span style={blurredStyle}>{randomPs5Id1}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.vs}>
            <b className={styles.vs1}>VS</b>
          </div>
          <div className={styles.frameWrapper}>
            <div className={styles.avatarGroup}>
              <img className={styles.avatarIcon2} alt="" src={matchData.player2.avatarUrl || '/avatar.png'} />
              <div className={styles.usernameParent}>
                <div className={styles.username2}>{matchData.player2.username}</div>
                <div className={styles.badgeBase}>
                  <img className={styles.avatarIcon3} alt="PS Logo" src={PSlogo} />
                  <div className={styles.text1}>
                    PS5 ID: <span style={blurredStyle}>{randomPs5Id2}</span>
                  </div>
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
                <div className={styles.bakiye250Tl}>{`${Number(matchData.prize).toFixed(0)}₺ Ödül`}</div>
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