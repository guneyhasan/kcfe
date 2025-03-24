import { FunctionComponent, useCallback, useState } from 'react';
import styles from './RulesAndFAQPage.module.css';
import Sidebar from '../SideBar/Sidebar';
import PageHeader from '../PageHeader/PageHeader';
import { Helmet } from 'react-helmet';

const RulesAndFAQPage = () => {
  const [activeTab, setActiveTab] = useState('rules'); // 'rules' veya 'faq'

  const onButonContainerClick = useCallback(() => {
    // Add your code here
  }, []);

  return (
    <div className={styles.kurallar}>
      <Helmet>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>
      <div className={styles.kurallarChild} />
      <Sidebar defaultActiveTab={5} />
      <div className={styles.container}>
        <PageHeader headerTitle="Kurallar ve Sıkça Sorulan Sorular" style={{ whiteSpace: 'nowrap' }}/>
        <div className={styles.menuParent}>
          <div className={styles.menu}>
            <div 
              className={`${styles.menuItemWrapper} ${activeTab === 'rules' ? styles.active : ''}`}
              onClick={() => setActiveTab('rules')}
            >
              <div className={styles.hzlMeydanOku}>Kurallar</div>
            </div>
            <div 
              className={`${styles.menuItemContainer} ${activeTab === 'faq' ? styles.active : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              <div className={styles.logo}>Sıkça Sorulan Sorular</div>
            </div>
          </div>
          
          {/* İçerik kısmı */}
          <div className={styles.sitemizeKaydolduunuzIsimVeParent}>
            {activeTab === 'rules' ? (
              <div className={styles.sitemizeKaydolduunuzIsimContainer}>
                <p className={styles.sitemizeKaydolduunuzIsim}>1- Sitemize kaydolduğunuz isim ve soyisime ait bir banka hesabından para yatırabilirsiniz. Aksi takdirde yatırdığınız ücret hesabınıza yansıtılmayacaktır. Aynı şekilde kendi isim ve soyisminize ait bir banka hesabına para çekebilirsiniz.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>2- Para yatırırken açıklama kısmına sitemizdeki üye numaranızı yazmanız kesinlikle şarttır. Aksi takdirde yatırdığınız miktar hesabınıza yansıtılmayacaktır.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>3-Bonuslar nakit olarak çekilemez. Sadece oyun içerisinde maça katılmak için kullanılır. Bonuslar ile girdiğiniz maçı kazandığınızda kârınızı çekebilirsiniz.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>4- Kullanıcılar birbirleriyle eşleştikten sonra 60 dakika içerisinde oyun içerisinden birbirlerini arkadaş olarak ekleyip maçı tamamlayıp sonucu rapor etmelidir. 60 dakika içerisinde iki oyuncuda herhangi bir sonuç rapor etmezse maç geçersiz sayılır. Eğer oyunculardan yalnızca biri sonuç rapor ederse o oyuncumuzun raporuna göre maç sonucu kabul edilir ve ödül hesaba yansıtılır.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>5- İki oyuncu da örneğin verilen 60 dakika sürenin 25. dakikasında sonuçları rapor ederlerse ödül miktarının hesaba yansıtılması için 60 dakika beklemelerine gerek yoktur. </p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>6- Eğer her iki oyuncu da kazandığını rapor ederse ekip arkadaşlarımız her iki oyuncuyu da görüntülü olarak arayıp konsol ekranını göstermesini ve maç geçmişini göstermesini isteyecektir. Maç geçmişinde her iki oyuncunun kullanıcı adı doğrulaması yapılıp maç sonucu doğrulanacaktır. Yanlış raporda bulunan kişinin hesabı süresiz kapatılacaktır ve hesapta eğer bakiyesi varsa bakiyeye erişimi kalıcı olarak engellenecektir.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>7- Eğer maç berabere biterse katılım ücretinin %95'i iade edilecektir.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>8- İki oyuncu da eşleştikten sonra eşleşmeyi iptal etme talebinde bulunabilirler. Her iki oyuncu da eşleşme iptalini kabul ederse maça katılım ücreti olduğu gibi hesaplarına iade edilecektir. Oyunculardan yalnızca biri eşleşme iptalini talep ederse maalesef iptal olmayacaktır.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>9- Eğer kullanıcılardan birinin bağlantısı kesilirse(internet kesilmesi,elektrik kesilmesi vb. sorunlar) bağlantısı kesilen taraf oyunda olduğu gibi bizim platformumuzda da hükmen mağlup sayılacaktır. Eğer bağlantısı kesilen taraf yanlış beyanda bulunup kazandığını idda ederse her iki oyuncu da görüntülü aranarak maç geçmişinin gösterilmesi istenir. Maç geçmişinde 3-0 mağlup görüneceğinden hesabı süresiz kapatılır ve bakiyesine süresiz erişim engeli getirilir. </p>
              </div>
            ) : (
              <div className={styles.sitemizeKaydolduunuzIsimContainer}>
                <p className={styles.sitemizeKaydolduunuzIsim}>1-Hangi oyunlar ve konsollar destekleniyor?</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>FC24, FC25, NBA2K24 ve NBA2K25 oyunlarını ve PS5, PS4, XBOX ONE, XBOX SERIES X VE XBOX SERIES S konsollarını desteklemekteyiz..</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                
                <p className={styles.sitemizeKaydolduunuzIsim}>2-Maç sonuçlarını nasıl kaydedebilirim?</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>Maç bittiğinde Sonucu Raporla butonu ile maç sonucunuzu kaydedebilirsiniz.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>

                <p className={styles.sitemizeKaydolduunuzIsim}>3-KONSOLCLUB'da param güvende mi?</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>Kendi adınıza olan herhangi bir banka hesabınızdan IBAN ile para yatırabilirsiniz, anında hesabınıza tanımlanır ve 7/24 IBAN ile kendi adınıza bir banka hesabına para çekme yöntemimiz mevcuttur. 0-15 dakika içerisinde para çekim işleminiz tamamlanıp hesabınıza transfer edilir.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>

                <p className={styles.sitemizeKaydolduunuzIsim}>4-Maç sonuçları hakkında bir anlaşmazlık olursa bu sorun nasıl giderilir?</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>Eğer her iki oyuncuda kazandığını rapor ederse ekip arkadaşlarımız her iki kullanıcıyı da görüntülü arayıp canlı olarak konsol ekranından maç geçmişini göstermesini isterler. Kullanıcı adı ve sonuç doğrulaması yapılıp maçı kazanan tespit edilir ve ödül hesabına yansıtılır. Yanlış raporlayan kullanıcımız kalıcı olarak engellenir. Hesap bakiyesine erişimi kalıcı olarak yasaklanır.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>

                <p className={styles.sitemizeKaydolduunuzIsim}>5- Rakibim sonucu raporlamazsa ne olur?</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>Kullanıcılarımıza verilen 1 saat içerisinde sonucu tek kullanıcı raporlarsa o sonuca göre doğrulama yapılır ve ödül miktarı hesaba yansıtılır.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>

                <p className={styles.sitemizeKaydolduunuzIsim}>6- Kazandığım ödülleri banka hesabıma çekebiliyor muyum?</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>Evet. Örneğin 200 TL yatırdınız. 200 TL'lik kategoride maç yaptınız ve kazandınız. Hesap bakiyeniz 350 TL olur. Hesap bakiyesinden dilediğiniz miktarı IBAN ile kendi banka hesabınıza 7/24 anında çekebilirsiniz.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>

                <p className={styles.sitemizeKaydolduunuzIsim}>7- Oynamak için ücret ödemem gerekiyor mu?</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>Maça katılım ücretleri 50,100,200,500 ve 1000 TL olmak üzere 5 kategoriden oluşur. Oynayacağınız kategoriyi seçip IBAN ile 7/24 para yatırabilirsiniz. Yatırdığınız miktar anında hesabınıza yansıtılır.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>

                <p className={styles.sitemizeKaydolduunuzIsim}>8- Maçlara katılabilmek için nelere sahip olmam lazım?</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>PS5, PS4, XBOX ONE, XBOX SERIES X VE XBOX SERIES S konsollarından en az birine sahip olmanız gerekiyor. Online maçlara katılabilmek için Playstation 4 veya 5 e sahipseniz Playstation Plus üyeliği ,XBOX konsoluna sahipseniz XBOX Game Pass üyeliği gerekiyor.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>

                <p className={styles.sitemizeKaydolduunuzIsim}>9- Bonuslar ile maça katılabilir miyim?</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>Evet bonuslarınız ile ücret kategorisine uygun bir maça katılabilirsiniz.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>

                <p className={styles.sitemizeKaydolduunuzIsim}>10- Bonus miktarlarını banka hesabıma çekebilir miyim?</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
                <p className={styles.sitemizeKaydolduunuzIsim}> Hayır. Örneğin 50 TL hoşgeldin bonusu aldınız. 50 TL'lik kategoride maç yaptınız. Kazandınız ve hesap bakiyeniz 90 TL oldu. 40 TL para çekebilirsiniz. Bonus miktarları çekilemez.</p>
                <p className={styles.sitemizeKaydolduunuzIsim}>&nbsp;</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesAndFAQPage;
