import React, { useState } from 'react';
import styles from './SendResult.module.css';
import { toast } from 'react-toastify';

const SendResult = ({ matchData, onBack, onSubmitResult, loading }) => {
  const [selectedWinner, setSelectedWinner] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!selectedWinner) {
      toast.error('Lütfen bir kazanan seçin');
      return;
    }

    try {
      setSubmitting(true);
      console.log('Seçilen kazanan:', selectedWinner);
      console.log('Maç ID:', matchData.id);
      
      // Kazanan ID'sini gönder
      await onSubmitResult(selectedWinner);
      
    } catch (error) {
      console.error('Sonuç gönderme hatası:', error);
      toast.error('Sonuç gönderilirken bir hata oluştu');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={styles.sendResultContainer}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={onBack}>
          ← Geri
        </button>
        <h2 className={styles.title}>Maç Sonucunu Bildir</h2>
      </div>
      
      <div className={styles.playersContainer}>
        <div 
          className={`${styles.playerCard} ${selectedWinner === matchData.player1.id ? styles.selected : ''}`}
          onClick={() => setSelectedWinner(matchData.player1.id)}
        >
          <img 
            src={matchData.player1.avatarUrl || '/default-avatar.png'} 
            alt={matchData.player1.username} 
            className={styles.playerAvatar}
          />
          <div className={styles.playerInfo}>
            <div className={styles.playerName}>{matchData.player1.username}</div>
            <div className={styles.playerPlatform}>{matchData.player1.platform || 'Platform belirtilmemiş'}</div>
          </div>
          <div className={styles.winnerLabel}>
            {selectedWinner === matchData.player1.id ? 'Kazanan' : ''}
          </div>
        </div>
        
        <div className={styles.vsContainer}>VS</div>
        
        <div 
          className={`${styles.playerCard} ${selectedWinner === matchData.player2.id ? styles.selected : ''}`}
          onClick={() => setSelectedWinner(matchData.player2.id)}
        >
          <img 
            src={matchData.player2.avatarUrl || '/default-avatar.png'} 
            alt={matchData.player2.username} 
            className={styles.playerAvatar}
          />
          <div className={styles.playerInfo}>
            <div className={styles.playerName}>{matchData.player2.username}</div>
            <div className={styles.playerPlatform}>{matchData.player2.platform || 'Platform belirtilmemiş'}</div>
          </div>
          <div className={styles.winnerLabel}>
            {selectedWinner === matchData.player2.id ? 'Kazanan' : ''}
          </div>
        </div>
      </div>
      
      <div className={styles.warningText}>
        Dikkat: Maç sonucunu bildirdikten sonra değiştiremezsiniz. Rakibiniz de aynı sonucu bildirirse maç tamamlanacaktır.
      </div>
      
      <div className={styles.buttonContainer}>
        <button 
          className={styles.submitButton} 
          onClick={handleSubmit}
          disabled={!selectedWinner || submitting || loading}
        >
          {submitting || loading ? 'Gönderiliyor...' : 'Sonucu Bildir'}
        </button>
      </div>
    </div>
  );
};

export default SendResult;
