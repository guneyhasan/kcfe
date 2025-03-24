import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/api';
import styles from './RegisterPage.module.css';
import maviLogoImage from '../../images/konsolclub_logo_mavi.png';
import beyazLogoImage from '../../images/konsolclub_logo_beyaz_yazi.svg';
import googleLogoImage from '../../images/googleIcon.png';
import { Helmet } from 'react-helmet';

const RegisterPage = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState({
		fullName: '',
		username: '',
		email: '',
		phoneNumber: '',
		password: '',
		confirmPassword: ''
	});
	const [acceptTerms, setAcceptTerms] = useState(false);
	const [error, setError] = useState('');
	const [loading, setLoading] = useState(false);

	const handleNavLoginClick = () => {
		navigate('/dashboard');
	};

	const handleNavSignupClick = () => {
		navigate('/register');
	};

	const handleLoginClick = () => {
		navigate('/landing');
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({
			...prev,
			[name]: value
		}));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();

		// Tüm alanların dolu olduğunu kontrol et
		const requiredFields = ['fullName', 'username', 'email', 'phoneNumber', 'password'];
		const emptyFields = requiredFields.filter(field => !formData[field]);

		if (emptyFields.length > 0) {
			setError(`Lütfen tüm alanları doldurun: ${emptyFields.join(', ')}`);
			return;
		}

		if (!acceptTerms) {
			setError('Lütfen üyelik sözleşmesini kabul edin');
			return;
		}

		if (formData.password !== formData.confirmPassword) {
			setError('Şifreler eşleşmiyor');
			return;
		}

		setError('');
		setLoading(true);

		try {
			// API'ye gönderilecek veriyi konsola yazdır
			console.log('Gönderilen veriler:', {
				fullName: formData.fullName,
				username: formData.username,
				email: formData.email,
				phoneNumber: formData.phoneNumber,
				password: formData.password
			});

			const response = await authService.register(formData);
			console.log('Kayıt başarılı:', response);
			navigate('/landing');
		} catch (err) {
			console.error('Kayıt hatası:', err);
			setError(err.message || 'Kayıt işlemi başarısız oldu');
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className={styles.kaytOl}>
			<Helmet>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
				<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
			</Helmet>
			<div className={styles.landingPageHeader}>
				<div className={styles.logoSvg}>
					<img className={styles.vectorIcon} alt="" src={beyazLogoImage} />
				</div>
				<div className={styles.textButtonParent}>
					<div className={styles.textButton}>
						<div className={styles.buttonBase}>
							<div
								className={styles.text}
								onClick={handleNavLoginClick}
							>
								Log in
							</div>
						</div>
					</div>
					<div className={styles.textButton}>
						<div className={styles.buttonBase1}>
							<div
								className={styles.text}
								onClick={handleNavSignupClick}
							>
								Sign up
							</div>
						</div>
					</div>
				</div>
			</div>
			<div className={styles.section1}>
				<div className={styles.container}>
					<div className={styles.content}>
						<div className={styles.header}>
							<img className={styles.image1Icon} alt="" src={maviLogoImage} />
							<div className={styles.textAndSupportingText}>
								<div className={styles.text2}>Kayıt Ol</div>
								<div className={styles.supportingText}>Hoşgeldin! Lütfen bilgilerinizi giriniz.</div>
							</div>
						</div>
						<div className={styles.content1}>
							<div className={styles.inputFieldBase}>
								<div className={styles.label}>Ad Soyad</div>
								<div className={styles.input}>
									<div className={styles.content2}>
										<input
											type="text"
											name="fullName"
											value={formData.fullName}
											onChange={handleInputChange}
											placeholder="Ali Korkmaz"
											className={styles.inputField}
										/>
									</div>
								</div>
								<div className={styles.hintText}>Cüzdan işlemlerinde sorun yaşamamak için lütfen kimlikte yazılı olan isim soy isiminizi yazınız.</div>
							</div>
							<div className={styles.inputFieldBase}>
								<div className={styles.label}>Kullanıcı Adı</div>
								<div className={styles.input}>
									<div className={styles.content2}>
										<input
											type="text"
											name="username"
											value={formData.username}
											onChange={handleInputChange}
											placeholder="@kullaniciadi"
											className={styles.inputField}
										/>
									</div>
								</div>
							</div>
							<div className={styles.inputFieldBase}>
								<div className={styles.label}>Email</div>
								<div className={styles.input}>
									<div className={styles.content2}>
										<input
											type="email"
											name="email"
											value={formData.email}
											onChange={handleInputChange}
											placeholder="Mail adresinizi yazınız"
											className={styles.inputField}
										/>
									</div>
								</div>
							</div>
							<div className={styles.inputFieldBase}>
								<div className={styles.label}>Telefon Numarası</div>
								<div className={styles.input}>
									<div className={styles.content2}>
										<input
											type="tel"
											name="phoneNumber"
											value={formData.phoneNumber}
											onChange={handleInputChange}
											placeholder="+90 (512) 345 67 89"
											className={styles.inputField}
										/>
									</div>
								</div>
							</div>
							<div className={styles.inputFieldBase}>
								<div className={styles.label}>Şifre</div>
								<div className={styles.input}>
									<div className={styles.content2}>
										<input
											type="password"
											name="password"
											value={formData.password}
											onChange={handleInputChange}
											placeholder="Şifrenizi giriniz"
											className={styles.inputField}
										/>
									</div>
								</div>
							</div>
							<div className={styles.inputFieldBase}>
								<div className={styles.label}>Şifre Tekrar</div>
								<div className={styles.input}>
									<div className={styles.content2}>
										<input
											type="password"
											name="confirmPassword"
											value={formData.confirmPassword}
											onChange={handleInputChange}
											placeholder="Tekrar şifrenizi giriniz"
											className={styles.inputField}
										/>
									</div>
								</div>
							</div>
							<div className={styles.row}>
								<div className={styles.checkbox}>
									<div className={styles.checkboxContainer}>
										<input
											type="checkbox"
											checked={acceptTerms}
											onChange={(e) => setAcceptTerms(e.target.checked)}
											className={styles.checkboxInput}
										/>
										<div className={styles.text9}>
											Kayıt Ol Butonuna tıklayarak, KonsolClub üyelik sözleşmesini kabul etmiş olursunuz.
										</div>
									</div>
								</div>
							</div>
							{error && <div className={styles.errorMessage}>{error}</div>}
							<div className={styles.buttons}>
								<button
									className={styles.signInButton}
									onClick={handleSubmit}
									disabled={loading}
								>
									<div className={styles.text}>
										{loading ? 'Kaydediliyor...' : 'Kayıt Ol'}
									</div>
								</button>

								<button className={styles.googleButton}>
									<img className={styles.socialIcon} alt="" src={googleLogoImage} />
									<div className={styles.text}>Sign in with Google</div>
								</button>
							</div>
						</div>
						<div className={styles.row1}>
							<div className={styles.text12}>Daha önce kayıt olduysanız,</div>
							<div className={styles.button}>
								<button
									className={styles.loginButton}
									onClick={handleLoginClick}
								>
									Giriş Yap
								</button>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.section1Child} />
			</div>
		</div>
	);
};

export default RegisterPage;
