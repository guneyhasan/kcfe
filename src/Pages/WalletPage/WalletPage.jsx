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

// Initialize wallet data with zeros instead of mock values
const initialWalletData = {
    totalBalance: 0,
    withdrawableAmount: 0,
    bonusAmount: 0,
    reservedBalance: 0,
    bankInfo: mockBankData,
    userId: "",
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
    maxWithdrawAmount: 0 // Initialize this to zero as well
};

const Cuzdan = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [walletData, setWalletData] = useState(initialWalletData);
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
        
        // Update wallet data with API response
        setWalletData(prevData => ({
          ...prevData,
          totalBalance: balanceData.balance || 0,
          withdrawableAmount: balanceData.availableBalance || 0,
          bonusAmount: balanceData.bonusAmount || 0,
          reservedBalance: balanceData.reservedBalance || 0,
        }));
        
        // Also update withdraw data
        mockWithdrawData.maxWithdrawAmount = balanceData.availableBalance || 0;
      } catch (error) {
        console.error('Bakiye bilgisi alınamadı:', error);
        // Error handling - we'll just keep the zeros in state
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
        return <GeneralOverview walletData={{...walletData, userId: userId || walletData.userId}} isLoading={isLoading} />;
      case 'deposit':
        return <Deposit bankData={{...mockBankData, userId: userId || walletData.userId}} />;
      case 'withdraw':
        return <Withdraw 
          withdrawData={mockWithdrawData} 
          onSubmit={handleWithdrawSubmit}
        />;
      default:
        return <GeneralOverview walletData={{...walletData, userId: userId || walletData.userId}} isLoading={isLoading} />;
    }
  };

  return (
    <div className={styles.czdan}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      </Helmet>
      <div className={styles.czdanChild} />
      <Sidebar defaultActiveTab={3}/>
      <div className={styles.container}>
        <PageHeader headerTitle="Cüzdan" style={{ whiteSpace: 'nowrap' }}/>
        <div className={styles.menuParent}>
          <div className={styles.menu} role="tablist" aria-orientation="horizontal">
            <div 
              className={`${styles.menuItemContainer} ${activeTab === 'overview' ? styles.active : ''}`}
              onClick={() => setActiveTab('overview')}
              role="tab"
              id="tab-overview"
              aria-selected={activeTab === 'overview'}
              tabIndex={activeTab === 'overview' ? 0 : -1}
            >
              <div className={styles.logo}>Genel görünüm</div>
            </div>
            <div 
              className={`${styles.menuItemContainer} ${activeTab === 'deposit' ? styles.active : ''}`}
              onClick={() => setActiveTab('deposit')}
              role="tab"
              id="tab-deposit"
              aria-selected={activeTab === 'deposit'}
              tabIndex={activeTab === 'deposit' ? 0 : -1}
            >
              <div className={styles.logo}>Para yatırma</div>
            </div>
            <div 
              className={`${styles.menuItemContainer} ${activeTab === 'withdraw' ? styles.active : ''}`}
              onClick={() => setActiveTab('withdraw')}
              role="tab"
              id="tab-withdraw"
              aria-selected={activeTab === 'withdraw'}
              tabIndex={activeTab === 'withdraw' ? 0 : -1}
            >
              <div className={styles.logo}>Para çekme</div>
            </div>
          </div>
          <div 
            role="tabpanel" 
            aria-labelledby={`tab-${activeTab}`}
            tabIndex={0}
          >
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cuzdan;
