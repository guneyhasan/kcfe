import React, { useState, useEffect } from 'react';
import styles from './Withdraw.module.css';
import QuestionIcon from '../../../images/Wallet/help-circle.svg';
import { Helmet } from 'react-helmet';

const Withdraw = ({ withdrawData, onSubmit }) => {
  const {
    fullName,
    maxWithdrawAmount
  } = withdrawData;
  const [ibanValue, setIbanValue] = useState(withdrawData.iban || '');
  const [amountValue, setAmountValue] = useState('');
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

  // IBAN formatını düzenleyen yardımcı fonksiyon
  const formatIBAN = (value) => {
    // Sadece rakam ve harfleri al
    const cleaned = value.replace(/[^A-Z0-9]/g, '');
    // Her 4 karakterde bir boşluk ekle
    const formatted = cleaned.match(/.{1,4}/g)?.join(' ') || cleaned;
    return formatted;
  };

  const handleIBANChange = (e) => {
    let value = e.target.value.toUpperCase(); // IBAN'ı büyük harfe çevir
    value = formatIBAN(value);
    setIbanValue(value);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (value <= maxWithdrawAmount) {
      setAmountValue(value);
    }
  };

  // Scroll ile değer değişimini engelle
  const handleWheel = (e) => {
    e.target.blur(); // Input'un focusunu kaldır
    e.preventDefault(); // Scroll eventini engelle
  };

  return (
    <div className={styles.frameGroup}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <div className={styles.frameContainer}>
        <div className={styles.frameDiv}>
          <div className={styles.hesabnaParaEkWrapper}>
            <div className={styles.hesabnaParaEk}>Hesabına para çek</div>
          </div>
          <div className={styles.herTrkBankasndanAadakiWrapper}>
            <div className={styles.herTrkBankasndanContainer}>
              <span>Her Türk bankasından aşağıdaki IBAN'a kolayca para transferi yapabilirsiniz. </span>
              <span className={styles.ltfenTransferSrasndaAk}>
              Lütfen transfer sırasında açıklama kısmına üye numaranızı eklemeyi unutmayın.
              </span>
              <span> Bu sayede bakiyeniz kısa sürede hesabınıza tanımlanacaktır. </span>
            </div>
          </div>
        </div>
        <div className={styles.inputFieldBaseWrapper}>
          <div className={styles.inputFieldBase}>
            <div className={styles.inputFieldBase}>
              <div className={styles.label}>İSİM SOYİSİM</div>
              <div className={styles.input}>
                <div className={styles.content}>
                  <div className={styles.text1}>{fullName}</div>
                </div>
                <img className={styles.helpIcon} alt="" src={QuestionIcon} />
              </div>
            </div>
          </div>
        </div>
        <div className={styles.inputFieldBaseParent}>
          <div className={styles.inputFieldBase}>
            <div className={styles.inputFieldBase}>
              <div className={styles.label}>IBAN</div>
              <div className={styles.input1}>
                <div className={styles.content}>
                  <input
                    type="text"
                    className={styles.text1}
                    value={ibanValue}
                    onChange={handleIBANChange}
                    placeholder="TRXX XXXX XXXX XXXX XXXX XXXX XX"
                    maxLength={29} // TR + 24 rakam + 5 boşluk
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.inputFieldBase}>
            <div className={styles.inputFieldBase}>
              <div className={styles.label}>Çekilecek Miktar</div>
              <div className={styles.input1}>
                <div className={styles.content}>
                  <input 
                    type="number"
                    className={styles.text1}
                    value={amountValue}
                    onChange={handleAmountChange}
                    onWheel={handleWheel}  // Scroll handler'ı ekle
                    placeholder="Miktar giriniz"
                    max={maxWithdrawAmount}
                  />
                </div>
              </div>
            </div>
            <div className={styles.hintText}>
              <span>Maksimum çekilebilecek miktar: {maxWithdrawAmount}</span>
              <b>₺</b>
            </div>
          </div>
          <div 
            className={styles.frameWrapper} 
            onClick={onSubmit}
          >
            <div className={styles.paraEkmeTalebiGnderWrapper}>
              <div className={styles.bakiye250Tl}>Para Çekme Talebi Gönder</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.frameChild} />
      <div className={styles.detaylYaz}>Detaylı yazı / Legal kısım</div>
    </div>
  );
};

export default Withdraw;
