import React from 'react';
import styles from './MatchTable.module.css';

const MatchTable = ({ matches }) => {
  return (
    <div className={styles.tabloMaTekliflerim}>
      <div className={styles.headMeydanOkumalar}>
        <div className={styles.kullaniciBilgi}>Kullanıcı</div>
        <div className={styles.oyunBilgi}>Oyun</div>
        <div className={styles.katilimUcreti}>Katılım Ücreti</div>
        <div className={styles.odul}>Ödül</div>
        <div className={styles.kalanSure}>Kalan Süre</div>
        <div className={styles.aksiyon}></div>
      </div>

      {matches.map((match, index) => (
        <div className={styles.rowMeydanOkumalar} key={index}>
          <div className={styles.kullaniciBilgi}>
            <img className={styles.avatar} src={match.avatar} alt="avatar" />
            <div className={styles.username}>{match.username}</div>
          </div>
          <div className={styles.oyunBilgi}>
            <span>{match.game}</span>
            <div className={styles.platform}>
              <img src={match.platformImg} alt={match.platform} className={styles.platformIcon} />
              <span>{match.platform}</span>
            </div>
          </div>
          <div className={styles.katilimUcreti}>{match.entryFee}</div>
          <div className={styles.odul}>{match.reward}</div>
          <div className={styles.kalanSure}>{`⏱ ${match.timeRemaining}`}</div>
          <div className={styles.aksiyon}>
            <button className={styles.istekGonder}>İstek Gönder</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MatchTable; 