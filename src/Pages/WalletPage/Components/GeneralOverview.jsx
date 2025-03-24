import React, { useState } from 'react';
import styles from '../WalletPage.module.css';
import CopyIcon from '../../../images/Wallet/copy.svg';
import InfoIcon from '../../../images/Wallet/info.svg';
import { Helmet } from 'react-helmet';

const GeneralOverview = ({ walletData }) => {
  const {
    totalBalance,
    withdrawableAmount,
    bonusAmount,
    reservedBalance,
    bankInfo,
    userId,
    transactions
  } = walletData;
  
  const [copyState, setCopyState] = useState({
    accountName: false,
    iban: false,
    userId: false
  });

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
    <div className={styles.frameGroup}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      <div className={styles.frameContainer}>
        <div className={styles.groupParent}>
          <div className={styles.toplamBakiyeParent}>
            <div className={styles.toplamBakiye}>Toplam bakiye</div>
            <div className={styles.para}>
              <div className={styles.div}>{totalBalance}₺</div>
            </div>
          </div>
          <div className={styles.groupContainer}>
            <div className={styles.ekilebilirMiktarParent}>
              <div className={styles.ekilebilirMiktar}>Çekilebilir miktar</div>
              <div className={styles.cekilebilirMiktar}>
                <div className={styles.div2}>{withdrawableAmount}₺</div>
              </div>
            </div>
            {reservedBalance !== undefined && (
              <div className={styles.reservedBalanceParent}>
                <div className={styles.bonus}>
                  <div className={styles.div3}>{reservedBalance}₺</div>
                </div>
                <div className={styles.bonus1}>Rezerve Bakiye</div>
              </div>
            )}
            <div className={styles.bonusParent}>
              <div className={styles.bonus}>
                <div className={styles.div3}>{bonusAmount}₺</div>
              </div>
              <div className={styles.bonus1}>Bonus</div>
            </div>
            <div className={styles.groupChild} />
            <div className={styles.reservedDivider} />
          </div>
        </div>
        <div className={styles.hzlParaYatrParent}>
          <div className={styles.hzlParaYatr}>🚀 Hızlı Para Yatır</div>
          <div className={styles.frameDiv}>
            <div className={styles.hesapAdParent}>
              <div className={styles.hesapAd}>Hesap Adı</div>
              <div className={styles.mavsoftBlmLtdTParent}>
                <div className={styles.bakiye250Tl}>{bankInfo.accountName}</div>
                <div className={styles.copyContainer}>
                  <img 
                    className={styles.documentIcon} 
                    alt="Copy" 
                    src={CopyIcon} 
                    onClick={() => handleCopy(bankInfo.accountName, 'accountName')}
                    style={{ cursor: 'pointer' }}
                  />
                  {copyState.accountName && <div className={styles.copiedTooltip}>Kopyalandı!</div>}
                </div>
              </div>
            </div>
            <div className={styles.hesapAdParent}>
              <div className={styles.hesapAd}>IBAN</div>
              <div className={styles.mavsoftBlmLtdTParent}>
                <div className={styles.bakiye250Tl}>{bankInfo.iban}</div>
                <div className={styles.copyContainer}>
                  <img 
                    className={styles.documentIcon} 
                    alt="Copy" 
                    src={CopyIcon} 
                    onClick={() => handleCopy(bankInfo.iban, 'iban')}
                    style={{ cursor: 'pointer' }}
                  />
                  {copyState.iban && <div className={styles.copiedTooltip}>Kopyalandı!</div>}
                </div>
              </div>
            </div>
            <div className={styles.hesapAdParent}>
              <div className={styles.userId}>User ID</div>
              <div className={styles.mavsoftBlmLtdTParent}>
                <div className={styles.bakiye250Tl}>{userId}</div>
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
              <div className={styles.ek}>
                <img className={styles.infoIcon} alt="" src={InfoIcon} />
                <i className={styles.aklamayaYeNumaranz}>Açıklamaya üye numaranızı yazmayı unutmayın.</i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.czdanGemiiParent}>
        <div className={styles.czdanGemii}>Cüzdan Geçmişi</div>
        <div className={styles.rowParent}>
          <div className={styles.row}>
            <div className={styles.aklamayaYeNumaranz}>Tarih</div>
            <div className={styles.aklamayaYeNumaranz}>Tür</div>
            <div className={styles.aklamayaYeNumaranz}>Miktar</div>
            <div className={styles.aklamayaYeNumaranz}>İşlem ID</div>
          </div>
          {transactions.map((transaction, index) => (
            <div key={transaction.id} className={index === transactions.length - 1 ? styles.row5 : styles.row1}>
              <div className={styles.aklamayaYeNumaranz}>{transaction.date}</div>
              <div className={styles.aklamayaYeNumaranz}>{transaction.type}</div>
              <div className={styles.aklamayaYeNumaranz}>{transaction.amount} TL</div>
              <div className={styles.aklamayaYeNumaranz}>{transaction.transactionId}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GeneralOverview;