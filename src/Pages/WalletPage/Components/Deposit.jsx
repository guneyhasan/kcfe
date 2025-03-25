import React, { useState, useEffect } from 'react';
import styles from './Deposit.module.css';
import CopyIcon from '../../../images/Wallet/copy.svg';
import InfoIcon from '../../../images/Wallet/info.svg';
import { Helmet } from 'react-helmet';


const Deposit = ({ bankData }) => {
  const {
    accountName,
    iban,
    userId
  } = bankData;
  
  const [copyState, setCopyState] = useState({
    accountName: false,
    iban: false,
    userId: false
  });
  
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if screen width is less than 768px
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCopy = (text, field) => {
    if (text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          setCopyState({ ...copyState, [field]: true });
          setTimeout(() => {
            setCopyState({ ...copyState, [field]: false });
          }, 2000);
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
  };

  return (
    <div className={`${styles.frameGroup} ${isMobile ? styles.mobileFrameGroup : ''}`}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {isMobile && (
          <style type="text/css">{`
            body {
              background-color: #121212 !important;
              min-height: 100vh;
              margin: 0;
              padding: 0;
            }
          `}</style>
        )}
      </Helmet>
      <div className={styles.frameContainer}>
        <div className={styles.hesabnaParaYatrWrapper}>
          <div className={styles.hesabnaParaYatr}>Hesabına para yatır</div>
        </div>
        <div className={styles.herTrkBankasndanAadakiWrapper}>
          <div className={styles.herTrkBankasndanContainer}>
            <span style={{ color: '#FFFFFF' }}>{`Her Türk bankasından aşağıdaki IBAN'a kolayca para transferi yapabilirsiniz. `}</span>
            <span className={styles.ltfenTransferSrasnda}>Lütfen transfer sırasında açıklama kısmına üye numaranızı eklemeyi unutmayın</span>
            <span style={{ color: '#FFFFFF' }}>. Bu sayede bakiyeniz kısa sürede hesabınıza tanımlanacaktır.</span>
          </div>
        </div>
      </div>
      <div className={styles.paraYatirmaWrapper}>
        <div className={styles.paraYatirma}>
          <div className={styles.hesapIsim}>
            <div className={styles.hesapIsimHeader}>
              <div className={styles.hesapIsmi}>Hesap ismi</div>
            </div>
            <div className={styles.hesapIsim1}>
              <div className={styles.mavsoftBlmLtd} title={accountName}>{accountName}</div>
              <div className={styles.copyContainer}>
                <img 
                  className={styles.document24Outline} 
                  alt="Copy" 
                  src={CopyIcon} 
                  onClick={() => handleCopy(accountName, 'accountName')}
                  style={{ cursor: 'pointer' }}
                />
                {copyState.accountName && <div className={styles.copiedTooltip}>Kopyalandı!</div>}
              </div>
            </div>
          </div>
          <div className={styles.hesapIsim}>
            <div className={styles.iban1}>IBAN</div>
            <div className={styles.iban2}>
              <div className={`${styles.mavsoftBlmLtd} ${styles.ibanText}`} title={iban}>{iban}</div>
              <div className={styles.copyContainer}>
                <img 
                  className={styles.documentIcon} 
                  alt="Copy" 
                  src={CopyIcon} 
                  onClick={() => handleCopy(iban, 'iban')}
                  style={{ cursor: 'pointer' }}
                />
                {copyState.iban && <div className={styles.copiedTooltip}>Kopyalandı!</div>}
              </div>
            </div>
          </div>
          <div className={styles.uyeNo}>
            <div className={styles.uyeNoHeader}>
              <div className={styles.hesapIsmi}>Üye numaram</div>
              {isMobile ? (
                <div style={{
                  color: '#336cff',
                  fontSize: '11px',
                  position: 'relative',
                  marginTop: '5px',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  maxWidth: '100%'
                }}>
                  Açıklamaya üye numaranızı yazmayı unutmayın.
                </div>
              ) : (
                <div className={styles.ek}>
                  <img className={styles.infoIcon} alt="" src={InfoIcon} />
                  <i className={styles.herTrkBankasndanContainer}>Açıklamaya üye numaranızı yazmayı unutmayın.</i>
                </div>
              )}
            </div>
            <div className={styles.uyeNo1}>
              <div className={styles.mavsoftBlmLtd}>{userId}</div>
              <div className={styles.copyContainer}>
                <img 
                  className={styles.documentIcon} 
                  alt="Copy" 
                  src={CopyIcon} 
                  onClick={() => handleCopy(userId, 'userId')}
                  style={{ cursor: 'pointer' }}
                />
                {copyState.userId && <div className={styles.copiedTooltip}>Kopyalandı!</div>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`${styles.howAll} ${isMobile ? styles.mobileHowAll : ''}`}>
        <div className={styles.naslParaYatrlr}>Nasıl para yatırılır?</div>
        <div className={`${styles.how} ${isMobile ? styles.mobileHow : ''}`}>
          <div className={styles.how1}>
            <div className={styles.ellipseParent}>
              <div className={styles.groupChild} />
              <div className={styles.div2}>1</div>
            </div>
            <div className={styles.bankaUygulamanzaGirinWrapper}>
              <div className={styles.naslParaYatrlr}>Banka uygulamanıza girin</div>
            </div>
          </div>
          <div className={styles.how1}>
            <div className={styles.ellipseParent}>
              <div className={styles.groupChild} />
              <div className={styles.div3}>2</div>
            </div>
            <div className={styles.yukardaBelirtilenHesapIsminWrapper}>
              <div className={styles.naslParaYatrlr}>Yukarda belirtilen hesap ismini ve IBAN bilgilerini girip istediğiniz miktarı gönderin</div>
            </div>
          </div>
          <div className={styles.how1}>
            <div className={styles.ellipseParent}>
              <div className={styles.groupChild} />
              <div className={styles.div3}>3</div>
            </div>
            <div className={styles.aklamayaYeNumaranzMutlWrapper}>
              <div className={styles.naslParaYatrlr}>Açıklamaya üye numaranızı mutlaka ekleyin</div>
            </div>
          </div>
          <div className={`${styles.how4} ${isMobile ? styles.mobileHow4 : ''}`}>
            <div className={styles.ellipseParent}>
              <div className={styles.groupChild} />
              <div className={styles.div3}>4</div>
            </div>
            <div className={styles.gnderimdenSonra5DakikaIeWrapper}>
              <div className={styles.naslParaYatrlr}>Gönderimden sonra 5 dakika içerisinde hesabınıza tanımlanacaktır. Keyifli oyunlar.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Deposit;
                