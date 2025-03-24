import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './Sidebar.module.css';

import MaviKonsolSimgesi from '../../images/Sidebar/konsolsimgesi.svg';
import BeyazKonsolSimgesi from '../../images/Sidebar/beyaz-konsol.svg';

import BeyazKilicSimgesi from '../../images/Sidebar/kilicSimgesi.svg';
import MaviKilicSimgesi from '../../images/Sidebar/mavi-kilic.svg';

import BeyazMesajSimgesi from '../../images/Sidebar/mesajSimgesi.svg';
import MaviMesajSimgesi from '../../images/Sidebar/mavi-mesaj.svg';

import BeyazCüzdanSimgesi from '../../images/Sidebar/cuzdanSimgesi.svg';
import MaviCüzdanSimgesi from '../../images/Sidebar/mavi-cuzdan.svg';

import BeyazBildirimSimgesi from '../../images/Sidebar/CanSimgesi.svg';
import MaviBildirimSimgesi from '../../images/Sidebar/mavi-bildirim.svg';

import BeyazKurallarSimgesi from '../../images/Sidebar/soruSimgesi.svg';
import MaviKurallarSimgesi from '../../images/Sidebar/mavi-soru.svg';

import WhatsAppSimgesi from '../../images/Sidebar/whatsapp.svg';
import AyarlarSimgesi from '../../images/Sidebar/settings.svg';


const Sidebar = ({ defaultActiveTab = 0 }) => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Aktif tab'ı URL'ye göre belirle
    const getActiveTabFromPath = () => {
        const path = location.pathname;
        if (path.includes('/meydanokumalar')) return 0;
        if (path.includes('/matches')) return 1;
        if (path.includes('/mesajlarim')) return 2;
        if (path.includes('/cuzdan')) return 3;
        if (path.includes('/bildirimler')) return 4;
        if (path.includes('/kurallar-ve-sss')) return 5;
        return defaultActiveTab;
    };
    
    // Aktif butonu prop'tan gelen değer ile başlatıyoruz
    const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

    // Sayfa yönlendirme fonksiyonları
    const handleNavigation = (tabIndex, route) => {
        setActiveTab(tabIndex);
        navigate(route);
    };

    return (
        <div className={styles.navLinkssidebarOne}>
            <div className={styles.topContentParent}>
                <div className={styles.topContent}>
                    <b className={styles.logo}>konsolclub</b>
                    <div className={styles.butonParent}>
                        <div 
                            className={styles.buton}
                            onClick={() => navigate('/hizlimeydanoku')}
                        >
                            <div className={styles.hzlMeydanOku}>Hızlı Meydan Oku</div>
                        </div>
                        <div className={styles.navLinks}>
                            <button
                                type="button"
                                className={activeTab === 0 ? styles.navLinks1 : styles.navLinks2}
                                onClick={() => handleNavigation(0, '/meydanokumalar')}
                            >
                                <img
                                    className={styles.proiconsgamedefault}
                                    alt=""
                                    src={activeTab === 0 ? MaviKonsolSimgesi : BeyazKonsolSimgesi}
                                />
                                <div className={styles.malarm}>Meydan Okumalar</div>
                            </button>
                            <button
                                type="button"
                                className={activeTab === 1 ? styles.navLinks1 : styles.navLinks2}
                                onClick={() => handleNavigation(1, '/matches')}
                            >
                                <div className={styles.malarm}>Maçlarım</div>
                                <img
                                    className={styles.proiconsgamedefault}
                                    alt=""
                                    src={activeTab === 1 ? MaviKilicSimgesi : BeyazKilicSimgesi}
                                />
                            </button>
                            <button
                                type="button"
                                className={activeTab === 2 ? styles.navLinks1 : styles.navLinks2}
                                onClick={() => handleNavigation(2, '/mesajlarim')}
                            >
                                <div className={styles.malarm}>Mesajlarım</div>
                                <img
                                    className={styles.mdimessageIcon}
                                    alt=""
                                    src={activeTab === 2 ? MaviMesajSimgesi : BeyazMesajSimgesi}
                                />
                            </button>
                            <button
                                type="button"
                                className={activeTab === 3 ? styles.navLinks1 : styles.navLinks2}
                                onClick={() => handleNavigation(3, '/cuzdan')}
                            >
                                <img
                                    className={styles.mdimessageIcon}
                                    alt=""
                                    src={activeTab === 3 ? MaviCüzdanSimgesi : BeyazCüzdanSimgesi}
                                />
                                <div className={styles.malarm}>Cüzdan</div>
                            </button>
                            <button
                                type="button"
                                className={activeTab === 4 ? styles.navLinks1 : styles.navLinks2}
                                onClick={() => handleNavigation(4, '/bildirimler')}
                            >
                                <div className={styles.malarm}>Bildirimler</div>
                                <img
                                    className={styles.mdimessageIcon}
                                    alt=""
                                    src={activeTab === 4 ? MaviBildirimSimgesi : BeyazBildirimSimgesi}
                                />
                            </button>
                            <button
                                type="button"
                                className={activeTab === 5 ? styles.navLinks1 : styles.navLinks2}
                                onClick={() => handleNavigation(5, '/kurallar-ve-sss')}
                            >
                                <div className={styles.malarm}>{`Kurallar & SSS`}</div>
                                <img
                                    className={styles.mdimessageIcon}
                                    alt=""
                                    src={activeTab === 5 ? MaviKurallarSimgesi : BeyazKurallarSimgesi}
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.navLinksParent}>
                    <button 
                        type="button" 
                        className={styles.navLinks7}
                        onClick={() => window.open('https://wa.me/+905555555555', '_blank')}
                    >
                        <div className={styles.canlYardm}>WhatsApp Canlı Yardım</div>
                        <img
                            className={styles.mdimessageIcon}
                            alt=""
                            src={WhatsAppSimgesi}
                        />
                    </button>
                    <button 
                        type="button" 
                        className={styles.navLinks7}
                        onClick={() => navigate('/ayarlar')}
                    >
                        <div className={styles.malarm}>Ayarlar</div>
                        <img
                            className={styles.mdimessageIcon}
                            alt=""
                            src={AyarlarSimgesi}
                        />
                    </button>
                    <div className={styles.navLinks9}>
                        <div 
                            className={styles.userAvatar}
                            onClick={() => navigate('/profile')}
                            style={{ cursor: 'pointer' }}
                        >
                            <img
                                className={styles.avatarSingleIcon}
                                alt=""
                                src="Avatar Single.png"
                            />
                            <div className={styles.text}>
                                <div className={styles.username}>@username</div>
                                <div className={styles.userId123456}>user id: 123456</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
