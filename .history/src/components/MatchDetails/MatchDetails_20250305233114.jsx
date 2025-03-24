import React from 'react';
import styles from './MatchDetails.module.css';

const MatchDetails = ({ matchData, matchStarted, onButonContainerClick, onCancelRequestClick, onReportResultClick }) => {
  // Oyuncu ID'lerini doğru şekilde ayarla
  const player1 = {
    id: matchData.player1?.id || matchData.host?.id,
    username: matchData.player1?.username || matchData.host?.username,
    avatarUrl: matchData.player1?.avatarUrl || matchData.host?.avatarUrl,
    platform: matchData.player1?.platform || matchData.platform || 'PS5'
  };

  const player2 = {
    id: matchData.player2?.id || matchData.opponent?.id,
    username: matchData.player2?.username || matchData.opponent?.username,
    avatarUrl: matchData.player2?.avatarUrl || matchData.opponent?.avatarUrl,
    platform: matchData.player2?.platform || matchData.platform || 'PS5'
  };

  console.log('MatchDetails - Oyuncu ID\'leri:', {
    player1Id: player1.id,
    player2Id: player2.id
  });

  return (
    <div className={styles.frameParent}>
      <div className={styles.frameGroup}>
        <div className={styles.frameContainer}>
          <div className={styles.frameDiv}>
            <div className={styles.frameParent1}>
              <div className={styles.frameParent2}>
                <div className={styles.frameWrapper}>
                  <div className={styles.frameParent3}>
                    <div className={styles.nba2k25Parent}>
                      <div className={styles.nba2k25}>{matchData.gameName}</div>
                      <div className={styles.dakika}>{matchData.remainingTime} dakika</div>
                    </div>
                    <div className={styles.frameChild} />
                  </div>
                </div>
                <div className={styles.frameParent4}>
                  <div className={styles.oyuncu1Parent}>
                    <div className={styles.oyuncu1}>
                      <img
                        className={styles.avatarIcon}
                        alt=""
                        src={player1.avatarUrl || '/default-avatar.png'}
                      />
                      <div className={styles.oyuncu1Info}>
                        <div className={styles.username}>{player1.username}</div>
                        <div className={styles.konsol}>{player1.platform}</div>
                      </div>
                    </div>
                    <div className={styles.vs}>
                      <div className={styles.vs1}>VS</div>
                    </div>
                    <div className={styles.oyuncu2}>
                      <div className={styles.oyuncu1Info1}>
                        <div className={styles.username1}>{player2.username}</div>
                        <div className={styles.konsol1}>{player2.platform}</div>
                      </div>
                      <img
                        className={styles.avatarIcon}
                        alt=""
                        src={player2.avatarUrl || '/default-avatar.png'}
                      />
                    </div>
                  </div>
                  <div className={styles.cretParent}>
                    <div className={styles.cret}>
                      <div className={styles.badgeBaseWrapper}>
                        <div className={styles.badgeBase}>
                          <div className={styles.katlmCreti}>{matchData.entryFee}₺ Katılım Ücreti</div>
                        </div>
                      </div>
                      <div className={styles.badgeBaseContainer}>
                        <div className={styles.badgeBase}>
                          <div className={styles.bakiye250Tl}>{matchData.prize}₺ Ödül</div>
                        </div>
                      </div>
                    </div>
                    {!matchStarted ? (
                      <div className={styles.buton} onClick={onButonContainerClick}>
                        <div className={styles.buttonBase}>
                          <div className={styles.text}>Maçı Başlat</div>
                        </div>
                      </div>
                    ) : (
                      <div className={styles.buttonGroup}>
                        <div className={styles.buton1} onClick={onReportResultClick}>
                          <div className={styles.buttonBase1}>
                            <div className={styles.text1}>Sonuç Bildir</div>
                          </div>
                        </div>
                        <div className={styles.buton2} onClick={onCancelRequestClick}>
                          <div className={styles.buttonBase2}>
                            <div className={styles.text2}>İptal Talep Et</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails; 