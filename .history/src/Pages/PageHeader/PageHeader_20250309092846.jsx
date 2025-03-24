import React, { useEffect, useState } from 'react';
import styles from './PageHeader.module.css';
import { useNavigate } from 'react-router-dom';

function PageHeader({
  onButonContainerClick,
  headerTitle = "Oyunlar"
}) {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    username: "@username",
    avatarSrc: "avatar.png",
    bakiye: "- TL"
  });

  useEffect(() => {
    // Kullanıcı bilgilerini localStorage'dan al
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user) {
      setUserData({
        username: user.username || "@username",
        avatarSrc: user.avatarUrl || "avatar.png",
        bakiye: user.balance ? `${user.balance} TL` : "- TL"
      });
    }
  }, []);

  const handleProfileClick = () => {
    if (onButonContainerClick) {
      onButonContainerClick();
    } else {
      // Profil sayfasına yönlendir
      navigate('/dashboard');
    }
  };

  return (
    <div className={styles.landingPageHeader}>
      <div className={styles.oyunlarWrapper}>
        <b className={styles.logo}>{headerTitle}</b>
      </div>
      <div className={styles.frameParent}>
        <div 
          className={styles.bakiye250TlWrapper} 
          onClick={handleProfileClick}
        >
          <div className={styles.bakiye250Tl}>Bakiye: {userData.bakiye}</div>
        </div>
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
      </div>
    </div>
  );
}

export default PageHeader; 