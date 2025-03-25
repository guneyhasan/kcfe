import React, { useRef, useEffect, useState } from 'react';
import styles from '../ProfilePage.module.css';
import { Helmet } from 'react-helmet';

const MatchHistory = ({ historyData, currentPage, totalPages, onPageChange }) => {
  const tableRef = useRef(null);

  // Kaydırma işlevleri
  const scrollLeft = () => {
    if (tableRef.current) {
      tableRef.current.scrollBy({ left: -100, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (tableRef.current) {
      tableRef.current.scrollBy({ left: 100, behavior: 'smooth' });
    }
  };

  // Mobil cihazlarda dokunmatik kaydırma için stil
  const scrollContainerStyle = {
    overflowX: 'auto',
    WebkitOverflowScrolling: 'touch',
    width: '100%',
    position: 'relative',
    display: 'block',
    whiteSpace: 'nowrap'
  };

  // Tablo içeriği için stil
  const tableContentStyle = {
    display: 'inline-block',
    minWidth: '100%',
    width: 'max-content'
  };

  // Mobil cihaz kontrolü
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // İlk yükleme kontrolü
    checkMobile();
    
    // Ekran boyutu değiştiğinde kontrol et
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Mobil görünüm için sütun başlıklarını kısalt
  const getColumnTitle = (title) => {
    if (!isMobile) return title;
    
    switch(title) {
      case 'Tarih': return 'Tarih';
      case 'Oyun': return 'Oyun';
      case 'Rakip': return 'Rakip';
      case 'Ödül': return 'Ödül';
      case 'Sonuç': return 'Sonuç';
      default: return title;
    }
  };

  return (
    <div className={styles.maGemiiParent}>
      <div className={styles.maGemiiHeader}>
        <div className={styles.maGemii}>Maç Geçmişi</div>
        
        {/* Kaydırma butonları (sadece masaüstünde göster) */}
        {!isMobile && (
          <div className={styles.scrollButtons}>
            <button 
              className={styles.scrollButton} 
              onClick={scrollLeft}
              aria-label="Sola kaydır"
            >
              &lt;
            </button>
            <button 
              className={styles.scrollButton} 
              onClick={scrollRight}
              aria-label="Sağa kaydır"
            >
              &gt;
            </button>
          </div>
        )}
      </div>
      
      {/* Mobil için kaydırma ipucu */}
      {isMobile && (
        <div className={styles.mobileScrollHint}>
          Sağa ve sola kaydırabilirsiniz
        </div>
      )}
      
      {/* Kaydırılabilir tablo container */}
      <div 
        ref={tableRef} 
        className={styles.tableScrollContainer}
        style={scrollContainerStyle}
      >
        <div className={styles.rowParent} style={tableContentStyle}>
          <table className={styles.matchTable}>
            <thead>
              <tr className={styles.row9}>
                <th className={styles.tarih}>{getColumnTitle('Tarih')}</th>
                <th className={styles.tarih}>{getColumnTitle('Oyun')}</th>
                <th className={styles.tarih}>{getColumnTitle('Rakip')}</th>
                <th className={styles.tarih}>{getColumnTitle('Ödül')}</th>
                <th className={styles.tarih}>{getColumnTitle('Sonuç')}</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((match) => (
                <tr key={match.id} className={styles.row10}>
                  <td className={styles.tarih}>{match.date}</td>
                  <td className={styles.tarih}>{match.game}</td>
                  <td className={styles.tarih}>{match.opponent}</td>
                  <td className={styles.tarih}>{match.prize} TL</td>
                  <td 
                    className={
                      match.result === 'win' 
                        ? styles.kazandm 
                        : match.result === 'lose' 
                          ? styles.kazandm1 
                          : styles.kazandm4
                    }
                  >
                    {isMobile 
                      ? (match.result === 'win' ? 'Kazandı' : match.result === 'lose' ? 'Kaybetti' : 'Berabere')
                      : (match.result === 'win' ? 'Kazandım' : match.result === 'lose' ? 'Kaybettim' : 'Berabere')
                    }
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Sayfalama */}
      <div className={styles.div6}>
        {Array.from({ length: totalPages }, (_, i) => (
          <span 
            key={i} 
            onClick={() => onPageChange(i + 1)}
            className={currentPage === i + 1 ? styles.activePage : ''}
            style={{ 
              cursor: 'pointer', 
              margin: isMobile ? '0 3px' : '0 5px',
              padding: isMobile ? '0 5px' : '0', 
              fontSize: isMobile ? '12px' : 'inherit'
            }}
          >
            {i + 1}
          </span>
        ))}
      </div>
    </div>
  );
};

export default MatchHistory; 