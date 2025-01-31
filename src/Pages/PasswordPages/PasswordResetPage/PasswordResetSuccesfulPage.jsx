import { FunctionComponent, useCallback } from 'react';
import styles from './PasswordResetSuccesfulPage.module.css';
import LogoYazi from '../../../images/konsolclub_logo_beyaz_yazi.svg';
import LogoMavi from '../../../images/konsolclub_logo_mavi.png';
import { useNavigate } from 'react-router-dom';


const PasswordResetSuccesfulPage = () => {


  	return (
    		<div className={styles.ifremiUnuttum}>
      			<div className={styles.landingPageHeader}>
        				<div className={styles.logoSvg}>
          					<img className={styles.vectorIcon} alt="" src={LogoYazi} />
        				</div>
        				<div className={styles.textButtonParent}>
          					<button
            						className={styles.loginHeaderButton}
          					>
            						Log in
          					</button>
          					<button
            						className={styles.signupHeaderButton}
          					>
            						Sign up
          					</button>
        				</div>
      			</div>
      			<div className={styles.section1}>
        				<div className={styles.container}>
          					<div className={styles.content}>
            						<div className={styles.header}>
              							<img className={styles.image1Icon} alt="" src={LogoMavi} />
              							<div className={styles.textAndSupportingText}>
                								<div className={styles.text2}>Şifreniz Başarıyla Yenilendi!</div>
              							</div>
            						</div>
            						<div className={styles.content1}>
              							<div className={styles.textAndSupportingText}>
                								<button
                  									className={styles.loginButton}
                								>
                  									Giriş Yap
                								</button>
              							</div>
            						</div>
          					</div>
        				</div>
        				<div className={styles.section1Child} />
      			</div>
    		</div>);
};

export default PasswordResetSuccesfulPage;
