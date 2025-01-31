import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './MainDashboard.module.css';
import konsoloyunLogoBeyazYazi from '../../images/konsolclub_logo_beyaz_yazi.svg';

const MainDashboard = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/landing');
    };

    return (
        <div className={styles.dashboard}>
            <div className={styles.header}>
                <div className={styles.logoContainer}>
                    <img 
                        src={konsoloyunLogoBeyazYazi} 
                        alt="Logo" 
                        className={styles.logo}
                    />
                </div>
                <div className={styles.userSection}>
                    <span className={styles.username}>
                        Hoş geldin, {user?.username || 'Kullanıcı'}
                    </span>
                    <button 
                        onClick={handleLogout}
                        className={styles.logoutButton}
                    >
                        Çıkış Yap
                    </button>
                </div>
            </div>
            <div className={styles.content}>
                <div className={styles.welcomeCard}>
                    <h1>Ana Panel</h1>
                    <p>Başarıyla giriş yaptınız!</p>
                </div>
                <div className={styles.statsContainer}>
                    <div className={styles.statCard}>
                        <h3>Bakiye</h3>
                        <p>0.00 ₺</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Toplam Maç</h3>
                        <p>0</p>
                    </div>
                    <div className={styles.statCard}>
                        <h3>Kazanılan Maç</h3>
                        <p>0</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MainDashboard; 