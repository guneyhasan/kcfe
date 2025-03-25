import React, { useState, useEffect } from 'react';
import styles from '../ProfilePage.module.css';
import { Helmet } from 'react-helmet';
import CopyIcon from '../../../images/Wallet/copy.svg';

const ProfileHeader = ({ userData, onFriendsClick, onSettingsClick }) => {
  const { username, userId, balance } = userData;
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Check on window resize
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleCopyUserId = () => {
    if (userId) {
      navigator.clipboard.writeText(userId)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000); // Reset copied state after 2 seconds
        })
        .catch(err => {
          console.error('Could not copy text: ', err);
        });
    }
  };

  return (
    <div className={styles.profileTagParent}>
      <div className={styles.profileTag}>
        <img className={styles.avatarIcon1} alt="" src="/avatar.png" />
        <div className={styles.profileTag1}>
          <div className={styles.username2}>
            <div className={styles.div}>{username}</div>
          </div>
          <div className={styles.kullaniciId}>
            <div className={styles.kullancId}>kullanıcı id:</div>
            <div className={styles.parent}>
              <div className={styles.div} style={isMobile ? {fontSize: '12px', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis'} : {}}>
                {userId}
              </div>
              <img 
                className={styles.documentIcon} 
                alt="Copy" 
                src={CopyIcon} 
                onClick={handleCopyUserId} 
                style={{ cursor: 'pointer' }}
              />
              {copied && <div className={styles.copiedTooltip}>Kopyalandı!</div>}
            </div>
          </div>
        </div>
      </div>
      <div className={styles.buttons}>
        <div className={styles.buttonBaseParent}>
          <div className={styles.buttonBase}>
            <div className={styles.text1}>Bakiye: {balance}₺</div>
          </div>
          <div 
            className={styles.button6} 
            onClick={onFriendsClick}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.buttonBase1}>
              <img className={styles.users24Outline} alt="" src="users / 24 / Outline.svg" />
              <div className={styles.text1}>{isMobile ? "Arkadaşlar" : "Arkadaşlarım"}</div>
            </div>
          </div>
          <div 
            className={styles.button6} 
            onClick={onSettingsClick}
            style={{ cursor: 'pointer' }}
          >
            <div className={styles.buttonBase1}>
              <img className={styles.documentIcon} alt="" src="material-symbols-light:settings-rounded.svg" />
              <div className={styles.text1}>Ayarlar</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader; 