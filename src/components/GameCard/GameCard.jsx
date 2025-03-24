import React from 'react';
import styles from './GameCard.module.css';

const GameCard = ({ game, onSelect }) => {
  return (
    <div className={styles.gameCard}>
      <img 
        className={styles.gameImage} 
        src={game.image} 
        alt={game.name} 
        onClick={() => onSelect(game.id)}
      />
    </div>
  );
};

export default GameCard; 