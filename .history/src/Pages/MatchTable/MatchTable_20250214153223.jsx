import React from 'react';
import styles from './MatchTable.module.css';

const MatchTable = ({ matches, loading }) => {
    if (loading) {
        return <div>Yükleniyor...</div>;
    }

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
                        <img src={match.avatar} alt="avatar" className={styles.avatar} />
                        <span>{match.username}</span>
                    </div>
                    <div className={styles.oyunBilgi}>
                        <div className={styles.oyunPlatform}>
                            <span>{match.game}</span>
                            <img src={match.platformImg} alt={match.platform} className={styles.platformIcon} />
                            <span>{match.platform}</span>
                        </div>
                    </div>
                    <div className={styles.katilimUcreti}>{match.entryFee}</div>
                    <div className={styles.odul}>{match.reward}</div>
                    <div className={styles.kalanSure}>{`⏱ ${match.timeRemaining}`}</div>
                    <div className={styles.aksiyon}>
                        <button 
                            className={styles.istekGonder}
                            onClick={match.onRequestClick}
                        >
                            İstek Gönder
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MatchTable; 