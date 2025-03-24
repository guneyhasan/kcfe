import { useState, useEffect } from 'react';
import styles from './MeydanOkumalar.module.css';
import Sidebar from '../SideBar/Sidebar';
import PageHeader from '../PageHeader/PageHeader';
import MatchTable from '../MatchTable/MatchTable';
import { challengeService } from '../../services/api';
import { toast } from 'react-toastify';

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

	const handleSendChallengeRequest = async (challengeId) => {
		try {
			const request = await challengeService.sendChallengeRequest(
				challengeId,
				"Bu turnuvaya katılmak istiyorum!"
			);

			if (request.success) {
				const { entryFee, prize } = request.data.request.financials;
				
				toast.success(
					`İstek başarıyla gönderildi!\nKatılım ücreti: ${entryFee} TL\nÖdül: ${prize} TL`,
					{
						autoClose: 5000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true,
						draggable: true,
						progress: undefined,
					}
				);

				fetchChallenges(); // Listeyi yenile
			}
		} catch (error) {
			console.error('Meydan okuma isteği gönderilemedi:', error.message);
			toast.error(error.message || 'İstek gönderilirken bir hata oluştu');
		}
	};

	const formatChallengeForTable = (challenge) => ({
		id: challenge.id,
		username: `@${challenge.creator.username}`,
		avatar: challenge.creator.avatarUrl,
		game: challenge.game,
		platform: challenge.platform,
		platformImg: `${challenge.platform.toLowerCase()}.png`,
		entryFee: `${challenge.points}₺`,
		reward: `${challenge.points * 1.8}₺`,
		timeRemaining: `${challenge.duration} gün`,
		communicationLink: challenge.communicationLink,
		maxParticipants: challenge.maxParticipants,
		participantCount: challenge.participantCount,
		onRequestClick: () => handleSendChallengeRequest(challenge.id) // İstek gönderme fonksiyonunu ekle
	});

	const handleFilterChange = (key, value) => {
		setFilters(prev => ({
			...prev,
			[key]: value,
			page: 1
		}));
	};

	return (
		<div className={styles.meydanOkumalar}>
			<Sidebar />
			<div className={styles.container}>
				<PageHeader />
				<div className={styles.containerInner}>
					<div className={styles.frameWrapper}>
						<div className={styles.frameGroup}>
							{/* Oyun kartları */}
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
												<option value="CS:GO">CS:GO</option>
												<option value="FC24">FC 24</option>
												<option value="NBA2K24">NBA 2K24</option>
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
										>
											Önceki
										</button>
										<span>{`Sayfa ${filters.page} / ${pagination.totalPages}`}</span>
										<button 
											onClick={() => handleFilterChange('page', filters.page + 1)}
											disabled={filters.page === pagination.totalPages}
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