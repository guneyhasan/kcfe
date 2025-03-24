import { FunctionComponent, useCallback } from 'react';
import styles from './SetNewPasswordPage.module.css';
import LogoYazi from '../../../images/konsolclub_logo_beyaz_yazi.svg';
import LogoMavi from '../../../images/konsolclub_logo_mavi.png';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';


const SetNewPasswordPage = () => {

  	return (
    		<div className={styles.ifremiUnuttum}>
          <Helmet>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
          </Helmet>
      			<div className={styles.landingPageHeader}>
        				<div className={styles.logoSvg}>
          					<img className={styles.vectorIcon} alt="" src={LogoYazi} />
        				</div>
        				<div className={styles.textButtonParent}>
          					<div className={styles.textButton}>
            						<div className={styles.buttonBase}>
              							<button
                  							className={styles.loginHeaderButton}
              							>
                								Log in
              							</button>
            						</div>
          					</div>
          					<div className={styles.textButton}>
            						<div className={styles.buttonBase1}>
              							<button
                  							className={styles.signupHeaderButton}
              							>
                								Sign up
              							</button>
            						</div>
          					</div>
        				</div>
      			</div>
      			<div className={styles.section1}>
        				<div className={styles.container}>
          					<div className={styles.content}>
            						<div className={styles.header}>
              							<img className={styles.image1Icon} alt="" src={LogoMavi} />
              							<div className={styles.textAndSupportingText}>
                								<div className={styles.text2}>Yeni Şifre Belirle</div>
                								<div className={styles.supportingText}>Lütfen güvenli bir şifre belirleyiniz.</div>
              							</div>
            						</div>
            						<div className={styles.inputWithLabelParent}>
              							<div className={styles.inputWithLabel}>
                								<div className={styles.label}>Şifre</div>
                								<div className={styles.input}>
                  									<div className={styles.content1}>
                    										<input
                    											type="password"
                    											placeholder="Şifrenizi giriniz"
                    											className={styles.passwordInput}
                    										/>
                  									</div>
                  									<div className={styles.helpIcon} />
                								</div>
              							</div>
              							<div className={styles.inputWithLabel}>
                								<div className={styles.label}>Şifre Tekrar</div>
                								<div className={styles.input}>
                  									<div className={styles.content1}>
                    										<input
                    											type="password"
                    											placeholder="Tekrar şifrenizi giriniz"
                    											className={styles.passwordInput}
                    										/>
                  									</div>
                  									<div className={styles.helpIcon} />
                								</div>
              							</div>
            						</div>
            						<div className={styles.content3}>
              							<div className={styles.actions}>
                								<div className={styles.buttonL1}>
                    										<button
                       											className={styles.saveButton}
                    										>
                    											Kaydet
                    										</button>
                								</div>
              							</div>
            						</div>
            						<div className={styles.row}>
              							<div className={styles.text6}>Hesabınız yok mu?</div>
                								<div className={styles.button}>
                  									<div className={styles.buttonBase3}>
                    										<button
                       											className={styles.signupButton}
                    										>
                    											Kayıt ol
                    										</button>
                  									</div>
                								</div>
                								</div>
                								</div>
                								</div>
                								<div className={styles.section1Child} />
                								</div>
                								</div>);
              							};

              							export default SetNewPasswordPage;
