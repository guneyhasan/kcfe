import React from 'react';
import styles from '../ProfilePage.module.css';
import { Helmet } from 'react-helmet';

const Statistics = ({ statsData }) => {
  return (
    <div className={styles.statistikParent}>
      <div className={styles.son10Ma}>İstatistik</div>
      <div className={styles.drawParent}>
        {statsData.map((game) => (
          <div key={game.id} className={styles.draw1}>
            <div className={styles.row5}>
              <div className={styles.oyunAd1}>
                <img className={styles.oyunAdChild} alt="" src={game.icon} />
                <div className={styles.nba2k25}>{game.name}</div>
              </div>
              <div className={styles.win5Parent}>
                <div className={styles.win5}>Win: {game.stats.wins}</div>
                <div className={styles.lose21}>Lose: {game.stats.losses}</div>
                <div className={styles.draw2}>Draw: {game.stats.draws}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Statistics; 