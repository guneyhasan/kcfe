import React from 'react';
import styles from './PageHeader.module.css';

function PageHeader({
  onButonContainerClick,
  bakiye = "- TL",
  username = "@username",
  avatarSrc = "avatar.png",
  headerTitle = "Oyunlar"
}) {
  return (
    <div className={styles.landingPageHeader}>
      <div className={styles.oyunlarWrapper}>
        <b className={styles.logo}>{headerTitle}</b>
      </div>
      <div className={styles.frameParent}>
        <div 
          className={styles.bakiye250TlWrapper} 
          onClick={onButonContainerClick}
        >
          <div className={styles.bakiye250Tl}>Bakiye: {bakiye}</div>
        </div>
        <div 
          className={styles.userTopBar} 
          onClick={onButonContainerClick}
        >
          <img 
            className={styles.avatarIcon} 
            alt="" 
            src={avatarSrc} 
          />
          <div className={styles.username1}>{username}</div>
        </div>
      </div>
    </div>
  );
}

export default PageHeader; 