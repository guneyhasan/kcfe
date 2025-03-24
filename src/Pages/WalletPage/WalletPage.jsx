import { FunctionComponent, useCallback, useState, useEffect } from 'react';
import styles from './WalletPage.module.css';
import Sidebar from '../SideBar/Sidebar';
import PageHeader from '../PageHeader/PageHeader';
import GeneralOverview from './Components/GeneralOverview';
import Deposit from './Components/Deposit';
import Withdraw from './Components/Withdraw';
import { walletService } from '../../services/api';
import { Helmet } from 'react-helmet';


const mockBankData = {
    accountName: "DEMAVSOFT TEKNOLOJİ LİMİTED ŞİRKETİ",
    iban: "TR68 0006 4000 0016 0470 3762 75"
};

const mockWalletData = {
    totalBalance: 1350,
    withdrawableAmount: 1250,
    bonusAmount: 0,
    reservedBalance: 200,
    bankInfo: mockBankData,
    userId: "536832",
    transactions: [
        {
            id: "1",
            date: "14/12/2024 - 11:24",
            type: "Para Yatırma",
            amount: 1000,
            transactionId: "4214213121"
        },
        // ... diğer işlemler
    ]
};

const mockWithdrawData = {
    fullName: "Emre Maviş",
    maxWithdrawAmount: mockWalletData.withdrawableAmount
};

const Cuzdan = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [walletData, setWalletData] = useState(mockWalletData);
  const [isLoading, setIsLoading] = useState(true);
  const [userId, setUserId] = useState("");
  
  useEffect(() => {
    // Get user ID from JWT token
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsedData = JSON.parse(userStr);
        if (parsedData.user && parsedData.user.id) {
          setUserId(parsedData.user.id);
        }
      } catch (error) {
        console.error('User data parsing error:', error);
      }
    }

    const fetchBalanceData = async () => {
      try {
        setIsLoading(true);
        const balanceData = await walletService.getBalance();
        
        // API'den gelen verileri walletData formatına dönüştür
        setWalletData({
          ...walletData,
          totalBalance: balanceData.balance,
          withdrawableAmount: balanceData.availableBalance,
          // Eğer bonusAmount API'den gelmiyorsa mevcut değeri kullan
          // Rezerve edilen bakiye kavramı burada kullanılabilir
          reservedBalance: balanceData.reservedBalance,
        });
      } catch (error) {
        console.error('Bakiye bilgisi alınamadı:', error);
        // Hata durumunda mevcut mockup verileri kullan
      } finally {
        setIsLoading(false);
      }
    };

    fetchBalanceData();
  }, []);
  
  const onButonContainerClick = useCallback(() => {
    // Add your code here
  }, []);
  
  
  const onFrameContainerClick = useCallback(() => {
    const anchor = document.querySelector("[data-scroll-to='frameContainer']");
    if(anchor) {
      anchor.scrollIntoView({"block":"start","behavior":"smooth"})
    }
  }, []);
  
  const handleWithdrawSubmit = () => {
    // Para çekme işlemi için gerekli fonksiyon
    console.log("Para çekme talebi gönderildi");
  };

  const renderContent = () => {
    switch(activeTab) {
      case 'overview':
        return <GeneralOverview walletData={{...walletData, userId: userId || walletData.userId}} />;
      case 'deposit':
        return <Deposit bankData={{...mockBankData, userId: userId || walletData.userId}} />;
      case 'withdraw':
        return <Withdraw 
          withdrawData={mockWithdrawData} 
          onSubmit={handleWithdrawSubmit}
        />;
      default:
        return <GeneralOverview walletData={{...walletData, userId: userId || walletData.userId}} />;
    }
  };

  return (
    <div className={styles.czdan}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      <div className={styles.czdanChild} />
      <Sidebar defaultActiveTab={3}/>
      <div className={styles.container}>
        <PageHeader headerTitle="Cüzdan" style={{ whiteSpace: 'nowrap' }}/>
        <div className={styles.menuParent}>
          <div className={styles.menu}>
            <div 
              className={`${styles.menuItemContainer} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <div className={styles.logo}>Genel görünüm</div>
            </div>
            <div 
              className={`${styles.menuItemContainer} ${activeTab === 'deposit' ? styles.active : ''}`}
              onClick={() => setActiveTab('deposit')}
            >
              <div className={styles.logo}>Para yatırma</div>
            </div>
            <div 
              className={`${styles.menuItemContainer} ${activeTab === 'withdraw' ? styles.active : ''}`}
              onClick={() => setActiveTab('withdraw')}
            >
              <div className={styles.logo}>Para çekme</div>
            </div>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default Cuzdan;
