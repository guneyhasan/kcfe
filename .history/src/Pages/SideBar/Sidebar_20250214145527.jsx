import { useState } from 'react';
import styles from './Sidebar.module.css';
import KonsolSimgesi from '../../images/Sidebar/konsolsimgesi.svg';
import KilicSimgei from '../../images/Sidebar/kilicSimgesi.svg';
import MesajSimgesi from '../../images/Sidebar/mesajSimgesi.svg';
import CüzdanSimgesi from '../../images/Sidebar/cuzdanSimgesi.svg';
import BildirimSimgesi from '../../images/Sidebar/CanSimgesi.svg';
import KurallarSimgesi from '../../images/Sidebar/soruSimgesi.svg';
import WhatsAppSimgesi from '../../images/Sidebar/whatsapp.svg';
import AyarlarSimgesi from '../../images/Sidebar/settings.svg';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    // Aktif butonu indeks olarak takip ediyoruz. (Örn: ilk buton varsayılan aktif)
    const [activeTab, setActiveTab] = useState(0);
    const navigate = useNavigate();

    return (
        <div className={styles.navLinkssidebarOne}>
            <div className={styles.topContentParent}>
                <div className={styles.topContent}>
                    <b className={styles.logo}>konsolclub</b>
                    <div className={styles.butonParent}>
                        <div 
                            className={styles.buton}
                            onClick={() => navigate('/hizlimeydanoku')}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className={styles.hzlMeydanOku}>Hızlı Meydan Oku</div>
                        </div>
                        <div className={styles.navLinks}>
                            <button
                                type="button"
                                className={activeTab === 0 ? styles.navLinks1 : styles.navLinks2}
                                onClick={() => {
                                    setActiveTab(0);
                                    navigate('/meydanokumalar');
                                }}
                            >
                                <img
                                    className={styles.proiconsgamedefault}
                                    alt=""
                                    src={KonsolSimgesi}
                                />
                                <div className={styles.malarm}>Meydan Okumalar</div>
                            </button>
                            <button
                                type="button"
                                className={activeTab === 1 ? styles.navLinks1 : styles.navLinks2}
                                onClick={() => {
                                    setActiveTab(1);
                                    navigate('/matches');
                                }}
                            >
                                <div className={styles.malarm}>Maçlarım</div>
                                <img
                                    className={styles.proiconsgamedefault}
                                    alt=""
                                    src={KilicSimgei}
                                />
                            </button>
                            <button
                                type="button"
                                className={activeTab === 2 ? styles.navLinks1 : styles.navLinks2}
                                onClick={() => {
                                    setActiveTab(2);
                                    navigate('/mesajlarim');
                                }}
                            >
                                <div className={styles.malarm}>Mesajlarım</div>
                                <img
                                    className={styles.mdimessageIcon}
                                    alt=""
                                    src={MesajSimgesi}
                                />
                            </button>
                            <button
                                type="button"
                                className={activeTab === 3 ? styles.navLinks1 : styles.navLinks2}
                                onClick={() => {
                                    setActiveTab(3);
                                    navigate('/cuzdan');
                                }}
                            >
                                <img
                                    className={styles.mdimessageIcon}
                                    alt=""
                                    src={CüzdanSimgesi}
                                />
                                <div className={styles.malarm}>Cüzdan</div>
                            </button>
                            <button
                                type="button"
                                className={activeTab === 4 ? styles.navLinks1 : styles.navLinks2}
                                onClick={() => {
                                    setActiveTab(4);
                                    navigate('/bildirimler');
                                }}
                            >
                                <div className={styles.malarm}>Bildirimler</div>
                                <img
                                    className={styles.mdimessageIcon}
                                    alt=""
                                    src={BildirimSimgesi}
                                />
                            </button>
                            <button
                                type="button"
                                className={activeTab === 5 ? styles.navLinks1 : styles.navLinks2}
                                onClick={() => {
                                    setActiveTab(5);
                                    navigate('/kurallar');
                                }}
                            >
                                <div className={styles.malarm}>{`Kurallar & SSS`}</div>
                                <img
                                    className={styles.mdimessageIcon}
                                    alt=""
                                    src={KurallarSimgesi}
                                />
                            </button>
                        </div>
                    </div>
                </div>
                <div className={styles.navLinksParent}>
                    <button type="button" className={styles.navLinks7}>
                        <div className={styles.canlYardm}>WhatsApp Canlı Yardım</div>
                        <img
                            className={styles.mdimessageIcon}
                            alt=""
                            src={WhatsAppSimgesi}
                        />
                    </button>
                    <button type="button" className={styles.navLinks7}>
                        <div className={styles.malarm}>Ayarlar</div>
                        <img
                            className={styles.mdimessageIcon}
                            alt=""
                            src={AyarlarSimgesi}
                        />
                    </button>
                    <div className={styles.navLinks9}>
                        <div className={styles.userAvatar}>
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
