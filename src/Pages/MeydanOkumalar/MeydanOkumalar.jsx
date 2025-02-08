import { FunctionComponent, useCallback,useState, useEffect } from 'react';
import styles from './MeydanOkumalar.module.css';
import Sidebar from '../SideBar/Sidebar';
import PageHeader from '../PageHeader/PageHeader';
import MatchTable from '../MatchTable/MatchTable';

const MeydanOkumalar = () => {
	const [platforms, setPlatforms] = useState([]);
	const [games, setGames] = useState([]);

	useEffect(() => {
		// Örnek: API'den platformları ve oyunları çekme
		// Bu kısımda gerçek API çağrıları yapabilirsiniz
		setPlatforms(["XBOX ONE", "PS5"]);
		setGames(["FC 23", "FC 24"]);
	  }, []);

	const rectangles = [
		"Rectangle 1.png",
		"Rectangle 1.png",
		"Rectangle 1.png",
		"Rectangle 1.png",
		"Rectangle 1.png",
		"Rectangle 1.png",
		"Rectangle 1.png",
		"Rectangle 1.png",
	];

	const matches = [
		{
		  username: "@username",
		  avatar: "avatar.png",
		  game: "FC 24",
		  platform: "XBOX ONE",
		  platformImg: "xbox.png",
		  entryFee: "50₺",
		  reward: "90₺",
		  timeRemaining: "37 dakika"
		},

	]

  	return (
    		<div className={styles.meydanOkumalar}>
      			<Sidebar />
      			<div className={styles.container}>
        				<PageHeader />
        				<div className={styles.containerInner}>
        					<div className={styles.frameWrapper}>
          						<div className={styles.frameGroup}>
            						{rectangles.map((src, index) => (
              					<div key={index} className={styles.rectangleWrapper}>
                					<img className={styles.frameChild} alt="" src={src} />
              					</div>
           						))}
          					</div>
        					</div>
      					</div>
        				<div className={styles.containerChild}>
          					<div className={styles.frameContainer}>
            						<div className={styles.headerMaTekliflerimParent}>
              							<div className={styles.headerMaTekliflerim}>
                								<div className={styles.meydanOkumalar2}>Meydan Okumalar</div>
                								<div className={styles.filterParent}>
												<div className={styles.filterContainer}>
      												  <div className={styles.filter}>
      												    <select className={styles.inputDropdownBase} defaultValue="">
      												      <option value="" disabled hidden>Platform</option>
      												      {platforms.map((platform, index) => (
      												        <option key={index} value={platform.toLowerCase()}>{platform}</option>
      												      ))}
      												    </select>
      												  </div>
      												  <div className={styles.filter}>
      												    <select className={styles.inputDropdownBase} defaultValue="">
      												      <option value="" disabled hidden>Oyun</option>
      												      {games.map((game, index) => (
      												        <option key={index} value={game.toLowerCase()}>{game}</option>
      												      ))}
      												    </select>
      												  </div>
      												</div>
              									</div>
												</div>
              								<div className={styles.meydanOkumalar}>
      											<MatchTable matches={matches} />
   									 		</div>
            						</div>
          					</div>
        				</div>
        			<div className={styles.containerItem} />
      			</div>
    		</div>);
};

export default MeydanOkumalar;
