import React, { useEffect, useState } from 'react';
import styles from './PageHeader.module.css';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import MenuLine from '../../images/menu-line.svg';
import Sidebar from '../SideBar/Sidebar';
import { walletService } from '../../services/api';

function PageHeader({
  onButonContainerClick,
  headerTitle = "Oyunlar"
}) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "username",
    avatarSrc: "avatar.png",
    bakiye: "- TL"
  });
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    // Kullanıcı bilgilerini localStorage'dan al
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const parsedData = JSON.parse(userStr);
        
        setUserData({
          username: parsedData.user?.username || "username",
          avatarSrc: parsedData.user?.avatarUrl || "avatar.png",
          bakiye: parsedData.balance ? `${parsedData.balance} TL` : "- TL",
          userId: parsedData.user?.id
        });
        
        // Eğer kullanıcı oturum açtıysa bakiye bilgisini API'den çek
        if (parsedData.access_token) {
          fetchBalanceData();
        }
      } catch (error) {
        console.error('LocalStorage veri parse hatası:', error);
      }
    }

    // Window resize event listener
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 480);
      // Ekran boyutu desktop boyutuna gelirse sidebar'ı kapat
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Bakiye bilgisini API'den çeken fonksiyon
  const fetchBalanceData = async () => {
    try {
      const balanceData = await walletService.getBalance();
      
      // Bakiye bilgisini güncelle - kullanılabilir bakiyeyi gösterelim
      setUserData(prevData => ({
        ...prevData,
        bakiye: `${balanceData.availableBalance} TL`
      }));
      
      // Güncellenmiş bakiye bilgisini localStorage'a kaydet
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          user.balance = balanceData.availableBalance;
          localStorage.setItem('user', JSON.stringify(user));
        } catch (error) {
          console.error('LocalStorage güncelleme hatası:', error);
        }
      }
    } catch (error) {
      console.error('Bakiye bilgisi çekilemedi:', error);
    }
  };

  const handleProfileClick = () => {
    // Profil sayfasına yönlendir
    navigate('/profile');
  };

  const handleWalletClick = () => {
    // Cüzdan sayfasına yönlendir
    navigate('/cuzdan');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      <div className={styles.landingPageHeader}>
        <div className={styles.oyunlarWrapper}>
          <img 
            src={MenuLine} 
            alt="Menu" 
            className={styles.menuIcon} 
            onClick={toggleSidebar}
          />
          <b className={styles.logo}>{headerTitle}</b>
        </div>
        <div className={styles.frameParent}>
          <div 
            className={styles.bakiye250TlWrapper} 
            onClick={handleWalletClick}
          >
            <div className={styles.bakiye250Tl}>Bakiye: {userData.bakiye}</div>
          </div>
          {!isMobile && (
            <div 
              className={styles.userTopBar} 
              onClick={handleProfileClick}
            >
              <img 
                className={styles.avatarIcon} 
                alt="" 
                src={userData.avatarSrc} 
              />
              <div className={styles.username1}>{userData.username}</div>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Sidebar */}
      <div className={`${styles.mobileSidebar} ${sidebarOpen ? styles.open : ''}`}>
        {sidebarOpen && (
          <div className={styles.sidebarContainer}>
            <Sidebar />
          </div>
        )}
      </div>
      
      {/* Overlay for clicking outside to close */}
      {sidebarOpen && (
        <div className={styles.sidebarOverlay} onClick={toggleSidebar}></div>
      )}
    </>
  );
}

export default PageHeader; 