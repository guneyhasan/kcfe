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

	// Game images data
	const gameImages = [
		{ id: 'FC24', name: 'FC 24', image: fc24Image },
		{ id: 'FC25', name: 'FC 25', image: fc25Image },
		{ id: 'NBA2K24', name: 'NBA 2K24', image: nba2k24Image },
		{ id: 'NBA2K25', name: 'NBA 2K25', image: nba2k25Image }
	];


	useEffect(() => {
		fetchChallenges();
	}, [filters]);

	const fetchChallenges = async () => {
		try {
			setLoading(true);
			const response = await challengeService.getChallenges(filters);
			
			if (response.success) {
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
			onRequestClick: () => handleSendChallengeRequest({
				...challenge,
				entryFee: entryFee,
				prize: prize
			})
		};
	};

	const handleFilterChange = (key, value) => {
		setFilters(prev => ({
			...prev,
			[key]: value,
			page: 1
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
												<option value="Steam">Steam</option>
												<option value="PS5">PS5</option>
												<option value="XBOX">XBOX</option>
											</select>
										</div>
										<div className={styles.filter}>
											<select 
												className={styles.inputDropdownBase}
												value={filters.game}
												onChange={(e) => handleFilterChange('game', e.target.value)}
											>
												<option value="">Oyun</option>
												<option value="FC24">FC 24</option>
												<option value="FC25">FC 25</option>
												<option value="NBA2K24">NBA 2K24</option>
												<option value="NBA2K25">NBA 2K25</option>
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
								{pagination.totalPages > 1 && (
									<div className={styles.pagination}>
										<button 
											onClick={() => handleFilterChange('page', filters.page - 1)}
											disabled={filters.page === 1}
											className={styles.paginationButton}
										>
											Önceki
										</button>
										<span className={styles.paginationInfo}>{`Sayfa ${filters.page} / ${pagination.totalPages}`}</span>
										<button 
											onClick={() => handleFilterChange('page', filters.page + 1)}
											disabled={filters.page === pagination.totalPages}
											className={styles.paginationButton}
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
		</div>
	);
};

export default MeydanOkumalar;