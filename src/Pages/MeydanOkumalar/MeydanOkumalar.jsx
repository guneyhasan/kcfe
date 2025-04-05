import { useState, useEffect } from 'react';
import styles from './MeydanOkumalar.module.css';
import Sidebar from '../SideBar/Sidebar';
import PageHeader from '../PageHeader/PageHeader';
import MatchTable from '../MatchTable/MatchTable';
import GameCard from '../../components/GameCard/GameCard';
import { challengeService } from '../../services/api';
import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';

// Import game images
import fc24Image from '../../images/Games/fc24.jpeg';
import fc25Image from '../../images/Games/fc25.jpeg';
import nba2k24Image from '../../images/Games/nba2k24.png';
import nba2k25Image from '../../images/Games/nba2k25.jpeg';



const MeydanOkumalar = () => {
	const [challenges, setChallenges] = useState([]);
	const [loading, setLoading] = useState(true);
	const [filters, setFilters] = useState({
		page: 1,
		limit: 10,
		status: 'pending',
		game: '',
		platform: '',
		category: '',
		difficulty: '',
		search: ''
	});

	const [pagination, setPagination] = useState({
		currentPage: 1,
		totalPages: 1,
		totalItems: 0,
		limit: 10
	});

	// Sadece kendi meydan okumalarını görüntülemek için bir state
	const [filterType, setFilterType] = useState('all'); // 'all', 'mine', 'opponents'

	// Game images data
	const [gameImages, setGameImages] = useState([
		{ id: 'FC 24', name: 'FC 24', image: fc24Image },
		{ id: 'FC 25', name: 'FC 25', image: fc25Image },
		{ id: 'NBA 2K24', name: 'NBA 2K24', image: nba2k24Image },
		{ id: 'NBA 2K25', name: 'NBA 2K25', image: nba2k25Image }
	]);


	useEffect(() => {
		fetchChallenges();
	}, [filters, filterType]);

	const fetchChallenges = async () => {
		try {
			setLoading(true);
			
			let response;
			
			// Debug: Filter değerlerini kontrol edelim
			console.log("Kullanılan filtreler:", filters);
			console.log("Filtre tipi:", filterType);
			
			// Önce tüm meydan okumaları getirelim
			response = await challengeService.getChallenges(filters);
			
			// Debug: API yanıtını kontrol edelim
			console.log("API yanıtı:", response);
			
			// Kullanıcı bilgilerini localStorage'dan alıyoruz
			let currentUsername = null;
			const userData = localStorage.getItem('user');
			
			if (userData && (filterType === 'mine' || filterType === 'opponents')) {
				try {
					const parsedUserData = JSON.parse(userData);
					// Kullanıcı datası içinde doğrudan username veya user objesi içinde username kontrolü
					currentUsername = parsedUserData.username || (parsedUserData.user && parsedUserData.user.username);
					
					// Debug
					console.log("Filtreleme için kullanılan username:", currentUsername);
					
					if (response.success && currentUsername) {
						if (filterType === 'mine') {
							// Benimkiler: Sadece kullanıcının oluşturduğu meydan okumaları göster
							const userChallenges = response.data.challenges.filter(
								challenge => challenge.creator && challenge.creator.username === currentUsername
							);
							
							console.log("Kullanıcının meydan okumaları:", userChallenges);
							
							// Yanıtı manuel olarak güncelle
							response = {
								...response,
								data: {
									...response.data,
									challenges: userChallenges,
									pagination: {
										...response.data.pagination,
										totalItems: userChallenges.length
									}
								}
							};
						} else if (filterType === 'opponents') {
							// Rakipler: Kullanıcının oluşturmadığı meydan okumaları göster
							const opponentChallenges = response.data.challenges.filter(
								challenge => challenge.creator && challenge.creator.username !== currentUsername
							);
							
							console.log("Rakiplerin meydan okumaları:", opponentChallenges);
							
							// Yanıtı manuel olarak güncelle
							response = {
								...response,
								data: {
									...response.data,
									challenges: opponentChallenges,
									pagination: {
										...response.data.pagination,
										totalItems: opponentChallenges.length
									}
								}
							};
						}
					}
				} catch (error) {
					console.error('User data parsing error:', error);
					toast.error('Kullanıcı bilgileri alınamadı');
				}
			}
			
			if (response && response.success) {
				setChallenges(response.data.challenges);
				setPagination(response.data.pagination);
			}
		} catch (error) {
			console.error('Meydan okumalar yüklenemedi:', error);
			toast.error('Meydan okumalar yüklenirken bir hata oluştu');
		} finally {
			setLoading(false);
		}
	};

	const handleSendChallengeRequest = async (challenge) => {
		try {
			if (!challenge || !challenge.entryFee) {
				throw new Error('Meydan okuma bilgileri eksik veya hatalı');
			}

			const request = await challengeService.sendChallengeRequest(
				challenge.id,
				{
					message: "Bu turnuvaya katılmak istiyorum!",
					entryFee: Number(challenge.entryFee),
					prize: Number(challenge.prize)
				}
			);

			if (request.success) {
				toast.success(
					'İstek başarıyla gönderildi!',
					{
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
					}
				);

				fetchChallenges();
			}
		} catch (error) {
			console.error('Meydan okuma isteği gönderilemedi:', error.message);
			toast.error(error.message || 'İstek gönderilirken bir hata oluştu');
		}
	};

	const formatChallengeForTable = (challenge) => {
		const entryFee = Number(challenge.entryFee);
		const prize = entryFee * 1.8;
		
		// Kullanıcı bilgilerini localStorage'dan alıyoruz
		const userData = localStorage.getItem('user');
		let currentUsername = null;
		
		// localStorage'dan username'i almaya çalışıyoruz
		if (userData) {
			try {
				const parsedUserData = JSON.parse(userData);
				// Kullanıcı datası içinde doğrudan username veya user objesi içinde username kontrolü
				currentUsername = parsedUserData.username || (parsedUserData.user && parsedUserData.user.username);
			} catch (error) {
				console.error('User data parsing error:', error);
			}
		}
		
		// Meydan okumanın yaratıcısının username'i ile giriş yapmış kullanıcının username'ini karşılaştırıyoruz
		const isCreator = currentUsername && challenge.creator && challenge.creator.username === currentUsername;
		
		return {
			id: challenge.id,
			username: challenge.creator.username,
			avatar: challenge.creator.avatarUrl,
			game: challenge.game,
			platform: challenge.platform,
			platformImg: `${challenge.platform.toLowerCase()}.png`,
			entryFee: entryFee,
			prize: prize,
			communicationLink: challenge.communicationLink,
			maxParticipants: challenge.maxParticipants,
			participantCount: challenge.participantCount,
			// Kullanıcı meydan okumanın yaratıcısı ise "İptal Et" butonu göster, değilse "İstek Gönder" butonu göster
			isCreator: isCreator,
			onRequestClick: isCreator 
				? () => handleCancelChallenge(challenge.id)
				: () => handleSendChallengeRequest({
					...challenge,
					entryFee: entryFee,
					prize: prize
				})
		};
	};

	const handleCancelChallenge = async (challengeId) => {
		try {
			const response = await challengeService.cancelChallenge(challengeId);
			
			if (response.success) {
				toast.success(
					'Meydan okuma başarıyla iptal edildi!',
					{
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
					}
				);
				
				// Meydan okumaları yeniden getir
				fetchChallenges();
			}
		} catch (error) {
			console.error('Meydan okuma iptal edilemedi:', error.message);
			toast.error(error.message || 'Meydan okuma iptal edilirken bir hata oluştu');
		}
	};

	const handleFilterChange = (key, value) => {
		// Debug için log ekleyelim
		console.log(`Filtre değişiyor: ${key} = ${value}`);
		
		setFilters(prev => {
			const newFilters = {
				...prev,
				[key]: value,
				page: 1
			};
			
			console.log("Güncellenmiş filtreler:", newFilters);
			return newFilters;
		});
	};

	const handlePageChange = (newPage) => {
		if (newPage < 1 || newPage > pagination.totalPages) return;
		
		setFilters(prev => ({
			...prev,
			page: newPage
		}));
	};

	return (
		<div className={styles.meydanOkumalar}>
			<Helmet>
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
				<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
			</Helmet>
			<Sidebar />
			<div className={styles.container}>
				<PageHeader />
				<div className={styles.containerInner}>
					<div className={styles.frameWrapper}>
						<div className={`${styles.frameGroup} ${styles.gamesGrid}`}>
							{/* Game cards as individual components */}
							{gameImages.map((game) => (
								<GameCard 
									key={game.id} 
									game={game} 
									onSelect={(gameId) => handleFilterChange('game', gameId)} 
								/>
							))}
						</div>
					</div>
				</div>
				<div className={styles.containerChild}>
					<div className={styles.frameContainer}>
						<div className={styles.headerMaTekliflerimParent}>
							<div className={styles.headerMaTekliflerim}>
								<div className={styles.meydanOkumalar2}>
									Meydan Okumalar
								</div>
								<div className={styles.filterParent}>
									<div className={styles.filterContainer}>
										<div className={styles.filter}>
											<select 
												className={styles.inputDropdownBase}
												value={filters.platform}
												onChange={(e) => handleFilterChange('platform', e.target.value)}
											>
												<option value="">Platform</option>
												<option value="PS5">PS5</option>
												<option value="PS4">PS4</option>
												<option value="XBOX ONE">XBOX ONE</option>
												<option value="XBOX S">XBOX S</option>
												<option value="XBOX X">XBOX X</option>
											</select>
										</div>
										<div className={styles.filter}>
											<select 
												className={styles.inputDropdownBase}
												value={filters.game}
												onChange={(e) => handleFilterChange('game', e.target.value)}
											>
												<option value="">Oyun</option>
												<option value="FC 25">FC 25</option>
												<option value="FC 24">FC 24</option>
												<option value="NBA 2K25">NBA 2K25</option>
												<option value="NBA 2K24">NBA 2K24</option>
											</select>
										</div>
										<div className={styles.filter}>
											<select 
												className={styles.inputDropdownBase}
												value={filterType}
												onChange={(e) => setFilterType(e.target.value)}
											>
												<option value="all">Tümü</option>
												<option value="mine">Benimkiler</option>
												<option value="opponents">Rakipler</option>
											</select>
										</div>
									</div>
								</div>
							</div>
							<div className={styles.meydanOkumalar}>
								<MatchTable 
									matches={challenges.map(formatChallengeForTable)}
									loading={loading}
								/>
							</div>
							
							{/* Pagination Controls */}
							{!loading && challenges.length > 0 && (
								<div className={styles.paginationContainer}>
									<button
										className={styles.paginationButton}
										disabled={pagination.currentPage <= 1}
										onClick={() => handlePageChange(pagination.currentPage - 1)}
									>
										Önceki
									</button>
									<span className={styles.paginationInfo}>
										Sayfa {pagination.currentPage} / {pagination.totalPages} 
										<span className={styles.totalItems}>
											(Toplam: {pagination.totalItems} maç)
										</span>
									</span>
									<button
										className={styles.paginationButton}
										disabled={pagination.currentPage >= pagination.totalPages}
										onClick={() => handlePageChange(pagination.currentPage + 1)}
									>
										Sonraki
									</button>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default MeydanOkumalar;