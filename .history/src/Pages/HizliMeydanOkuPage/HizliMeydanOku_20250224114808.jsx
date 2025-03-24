import { useState, useEffect } from 'react';
import styles from './HizliMeydanOku.module.css';
import Sidebar from '../SideBar/Sidebar';
import PageHeader from '../PageHeader/PageHeader';
import GamesIcon from '../../images/HızlıMeydanOku/games.svg';
import GroupIcon from '../../images/HızlıMeydanOku/Group.svg';
import CoinIcon from '../../images/HızlıMeydanOku/coin-filled.svg';
import ChevronIcon from '../../images/HızlıMeydanOku/chevron-down.svg';
import { challengeService } from '../../services/api';
import { toast } from 'react-toastify';

const HizliMeydanOku = () => {
  // State tanımlamaları
  const [games, setGames] = useState([]);
  const [consoles, setConsoles] = useState([]);
  const [entryFees, setEntryFees] = useState([]);
  const [tournamentModes, setTournamentModes] = useState([]);

  // Seçili değerler için state'ler
  const [selectedGame, setSelectedGame] = useState('');
  const [selectedConsole, setSelectedConsole] = useState('');
  const [selectedFee, setSelectedFee] = useState('');
  const [selectedMode, setSelectedMode] = useState('');

  // Dropdown açılma durumu
  const [openDropdown, setOpenDropdown] = useState(null); // 1: Game, 2: Console, 3: Fee, 4: Mode

  // Verileri çek
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Örnek API çağrıları - gerçek API endpointlerinizle değiştirin
        setGames([
          { id: 1, name: 'FC 25' },
          { id: 2, name: 'FC 24' },
          { id: 3, name: 'NBA 2K25' },
          { id: 4, name: 'NBA 2K24' },
        ]);

        setConsoles([
          { id: 1, name: 'PS5' },
          { id: 2, name: 'PS4' },
        ]);

        setEntryFees([
          { id: 1, amount: 50 },
          { id: 2, amount: 100 },
        ]);

        setTournamentModes([
          { id: 1, name: 'Tekli Eleme' },
          { id: 2, name: 'Grup' },
        ]);
      } catch (error) {
        console.error('Veri çekme hatası:', error);
      }
    };

    fetchData();
  }, []);

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const handleCreate = async () => {
    try {
      const challengeData = {
        title: `${selectedGame} ${selectedMode}`,
        description: `${selectedGame} oyununda ${selectedMode} maçı`,
        game: selectedGame,
        platform: selectedConsole,
        entryFee: Number(selectedFee),
        prize: Number(selectedFee) * 1.8, // Ödül miktarı katılım ücretinin 1.8 katı
        duration: 7,
        category: "1v1",
        difficulty: "medium",
        maxParticipants: 2
      };

      const response = await challengeService.createChallenge(challengeData);
      
      if (response.success) {
        const { entryFee, prize } = response.data.challenge.financials;
        
        toast.success(
          `Meydan okuma oluşturuldu!\nKatılım ücreti: ${entryFee} TL\nÖdül: ${prize} TL`,
          {
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          }
        );

        // Form'u temizle
        setSelectedGame('');
        setSelectedConsole('');
        setSelectedFee('');
        setSelectedMode('');
      }
    } catch (error) {
      console.error('Meydan okuma oluşturma hatası:', error);
      toast.error(error.message || 'Meydan okuma oluşturulurken bir hata oluştu');
    }
  };

  // Tüm dropdownların dolu olup olmadığını kontrol eden değişken
  const isFormComplete = selectedGame && selectedConsole && selectedFee && selectedMode;

  return (
      <div className={styles.hzlMeydanOku}>
        <div className={styles.hzlMeydanOkuChild} />
        <Sidebar />
        <div className={styles.container} data-scroll-to="container">
          <PageHeader headerTitle="Hızlı Meydan Oku" />
          <div className={styles.containerInner}>
            <div className={styles.textAndSupportingTextParent}>
              <div className={styles.textAndSupportingText}>
                <div className={styles.text1}>Düello oluştur</div>
              </div>
              <div className={styles.oyunDropdownParent}>
                {/* Oyun Seçim Dropdown */}
                <div className={styles.oyunDropdown}>
                  <div className={styles.inputDropdownBase} onClick={() => toggleDropdown(1)}>
                    <div className={styles.input}>
                      <div className={styles.content}>
                        <img className={styles.dashiconsgames} alt="Oyun İkonu" src={GamesIcon} />
                        <span>{selectedGame || "Oyun"}</span>
                      </div>
                      <img
                          className={`${styles.chevronIcon} ${openDropdown === 1 ? styles.rotated : ''}`}
                          alt="Açılır Menü İkonu"
                          src={ChevronIcon}
                      />
                    </div>
                  </div>
                  {openDropdown === 1 && (
                      <div className={styles.dropdownMenu}>
                        {games.map((game) => (
                            <div
                                key={game.id}
                                className={styles.dropdownItem}
                                onClick={() => { setSelectedGame(game.name); setOpenDropdown(null); }}
                            >
                              {game.name}
                            </div>
                        ))}
                      </div>
                  )}
                </div>

                {/* Konsol Seçim Dropdown */}
                <div className={styles.oyunDropdown}>
                  <div className={styles.inputDropdownBase} onClick={() => toggleDropdown(2)}>
                    <div className={styles.input}>
                      <div className={styles.content}>
                        <img className={styles.iconParkOutlinegamePs} alt="Konsol İkonu" src={GroupIcon} />
                        <span>{selectedConsole || "Konsol"}</span>
                      </div>
                      <img
                          className={`${styles.chevronIcon} ${openDropdown === 2 ? styles.rotated : ''}`}
                          alt="Açılır Menü İkonu"
                          src={ChevronIcon}
                      />
                    </div>
                  </div>
                  {openDropdown === 2 && (
                      <div className={styles.dropdownMenu}>
                        {consoles.map((console) => (
                            <div
                                key={console.id}
                                className={styles.dropdownItem}
                                onClick={() => { setSelectedConsole(console.name); setOpenDropdown(null); }}
                            >
                              {console.name}
                            </div>
                        ))}
                      </div>
                  )}
                </div>

                {/* Katılım Ücreti Seçim Dropdown */}
                <div className={styles.oyunDropdown}>
                  <div className={styles.inputDropdownBase} onClick={() => toggleDropdown(3)}>
                    <div className={styles.input}>
                      <div className={styles.content}>
                        <img className={styles.iconParkOutlinegamePs} alt="Ücret İkonu" src={CoinIcon} />
                        <span>{selectedFee ? `${selectedFee}₺` : "Katılım Ücreti"}</span>
                      </div>
                      <img
                          className={`${styles.chevronIcon} ${openDropdown === 3 ? styles.rotated : ''}`}
                          alt="Açılır Menü İkonu"
                          src={ChevronIcon}
                      />
                    </div>
                  </div>
                  {openDropdown === 3 && (
                      <div className={styles.dropdownMenu}>
                        {entryFees.map((fee) => (
                            <div
                                key={fee.id}
                                className={styles.dropdownItem}
                                onClick={() => { setSelectedFee(fee.amount); setOpenDropdown(null); }}
                            >
                              {`${fee.amount}₺`}
                            </div>
                        ))}
                      </div>
                  )}
                </div>

                {/* Turnuva Modu Seçim Dropdown */}
                <div className={styles.oyunDropdown}>
                  <div className={styles.inputDropdownBase} onClick={() => toggleDropdown(4)}>
                    <div className={styles.input}>
                      <div className={styles.content}>
                        <img className={styles.iconParkOutlinegamePs} alt="Turnuva Modu İkonu" src={GroupIcon} />
                        <span>{selectedMode || "Turnuva Modu"}</span>
                      </div>
                      <img
                          className={`${styles.chevronIcon} ${openDropdown === 4 ? styles.rotated : ''}`}
                          alt="Açılır Menü İkonu"
                          src={ChevronIcon}
                      />
                    </div>
                  </div>
                  {openDropdown === 4 && (
                      <div className={styles.dropdownMenu}>
                        {tournamentModes.map((mode) => (
                            <div
                                key={mode.id}
                                className={styles.dropdownItem}
                                onClick={() => { setSelectedMode(mode.name); setOpenDropdown(null); }}
                            >
                              {mode.name}
                            </div>
                        ))}
                      </div>
                  )}
                </div>

                {/* Oluştur Butonu */}
                <button
                    className={styles.buttonBase}
                    onClick={handleCreate}
                    disabled={!isFormComplete}
                >
                  <span className={styles.text6}>Oluştur</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default HizliMeydanOku;
