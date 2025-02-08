import { FunctionComponent, useCallback, useState, useEffect } from 'react';
import styles from './SendResult.module.css';
import UploadImage from '../../images/Salon/upload.svg';
import ResultDraw from '../ResultDraw/ResultDraw';
import ResultWin from '../ResultWin/ResultWin';
import ResultLose from '../ResultLose/ResultLose';


const Frame = ({ matchData, onClose }) => {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [showResultDraw, setShowResultDraw] = useState(false);
  const [showResultWin, setShowResultWin] = useState(false);
  const [showResultLose, setShowResultLose] = useState(false);
  
  const onPlayerSelect = useCallback((playerId) => {
    setSelectedPlayer(playerId);
  }, []);
  
  const onFrameContainerClick = useCallback(() => {
    setSelectedPlayer('draw');
  }, []);

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  const handleConfirm = useCallback(() => {
    if (selectedPlayer === 'draw' && selectedFile) {
      setShowResultDraw(true);
    } else if (selectedPlayer === 1 && selectedFile) {
      setShowResultWin(true);
    } else if (selectedPlayer === 2 && selectedFile) {
      setShowResultLose(true);
    }
  }, [selectedPlayer, selectedFile]);

  useEffect(() => {
    console.log('ShowResultWin:', showResultWin);
  }, [showResultWin]);

  if (showResultDraw) {
    return <ResultDraw matchData={matchData} screenshot={selectedFile} onClose={onClose} />;
  }

  if (showResultWin) {
    return <ResultWin matchData={matchData} screenshot={selectedFile} onClose={onClose} />;
  }

  if (showResultLose) {
    return <ResultLose matchData={matchData} screenshot={selectedFile} onClose={onClose} />;
  }

  return (
    <div className={styles.frameParent}>
      <div className={styles.contentContainer}>
        <div className={styles.frameGroup}>
          <div className={styles.avatarParent}>
            <img className={styles.avatarIcon} alt="" src={matchData.player1.avatarUrl} />
            <div className={styles.fc2k24}>{matchData.gameName}</div>
          </div>
          <div className={styles.dakikaWrapper}>
            <div className={styles.dakika}>{`⏱ ${matchData.remainingTime} dakika `}</div>
          </div>
        </div>
        <div className={styles.kazananSe}>Kazananı seç</div>
        <div className={styles.frameContainer}>
          <div 
            className={`${styles.avatarGroup} ${selectedPlayer === 1 ? styles.selectedPlayer : ''}`} 
            onClick={() => onPlayerSelect(1)}
          >
            <img className={styles.avatarIcon1} alt="" src={matchData.player1.avatarUrl} />
            <div className={styles.username1BenWrapper}>
              <div className={styles.username1Ben}>{matchData.player1.username} (Ben)</div>
            </div>
          </div>
          <div 
            className={`${styles.avatarGroup} ${selectedPlayer === 2 ? styles.selectedPlayer : ''}`}
            onClick={() => onPlayerSelect(2)}
          >
            <img className={styles.avatarIcon1} alt="" src={matchData.player2.avatarUrl} />
            <div className={styles.username1BenWrapper}>
              <div className={styles.username1Ben}>{matchData.player2.username}</div>
            </div>
          </div>
        </div>
        <div className={styles.veya}>VEYA</div>
        <div 
          className={`${styles.avatarGroup} ${selectedPlayer === 'draw' ? styles.selectedDraw : ''}`} 
          onClick={onFrameContainerClick}
        >
          <div className={styles.avatarParent1}>
            <img className={styles.avatarIcon1} alt="" src="Avatar.png" />
            <img className={styles.avatarIcon4} alt="" src="Avatar.png" />
          </div>
          <div className={styles.username1BenWrapper}>
            <div className={styles.username1Ben}>Berabere bitti</div>
            <div className={styles.katlmCretinizin95i}>Katılım ücretinizin %95'i iade edilecektir.</div>
          </div>
        </div>
        <div className={styles.upload2LineParent}>
          <label htmlFor="matchScreenshot" className={styles.uploadLabel}>
            <img className={styles.upload2LineIcon} alt="" src={UploadImage} />
            <div className={styles.ltfenMaSonucununEkranFotWrapper}>
              <div className={styles.ltfenMaSonucunun}>
                {selectedFile ? selectedFile.name : 'Lütfen maç sonucunun ekran fotoğrafını yükleyiniz.'}
              </div>
            </div>
            <input
              id="matchScreenshot"
              type="file"
              accept=".jpeg,.jpg,.png"
              onChange={handleFileSelect}
              className={styles.fileInput}
              style={{ display: 'none' }}
            />
          </label>
        </div>
        <div className={styles.frameWrapper}>
          <div className={styles.buttonBaseParent}>
            <div 
              className={`${styles.buttonBase} ${(!selectedPlayer || !selectedFile) ? styles.buttonDisabled : ''}`}
              onClick={selectedPlayer && selectedFile ? handleConfirm : undefined}
            >
              <div className={styles.text}>Onayla</div>
            </div>
            <div className={styles.buttonBase1}>
              <div className={styles.text1}>İptal</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Frame;
