import { challengeService } from './api';
import axios from 'axios';

// API URL'ini tanımla - api.js ile aynı URL'i kullanır
const API_URL = 'http://localhost:8090';

// Mock veriler - API endpoint yoksa veya hata verirse kullanılacak
const mockStats = {
  success: true,
  data: {
    overallStats: {
      totalMatches: 25,
      wins: 15,
      losses: 8,
      draws: 2,
      winRate: 60.0
    },
    gameStats: [
      {
        game: {
          id: 1,
          title: "FIFA 23"
        },
        totalMatches: 10,
        wins: 7,
        losses: 2,
        draws: 1,
        winRate: 70.0
      },
      {
        game: {
          id: 2,
          title: "FC25"
        },
        totalMatches: 8,
        wins: 5,
        losses: 3,
        draws: 0,
        winRate: 62.5
      },
      {
        game: {
          id: 3,
          title: "NBA 2K24"
        },
        totalMatches: 7,
        wins: 3,
        losses: 3,
        draws: 1,
        winRate: 42.9
      }
    ],
    bestGames: [
      {
        game: {
          id: 1,
          title: "FIFA 23"
        },
        totalMatches: 10,
        wins: 7,
        losses: 2,
        draws: 1,
        winRate: 70.0
      },
      {
        game: {
          id: 2,
          title: "FC25"
        },
        totalMatches: 8,
        wins: 5,
        losses: 3,
        draws: 0,
        winRate: 62.5
      }
    ]
  }
};

// Mock kullanılsın mı? API entegrasyonu tamamlandığında false yapılabilir
const USE_MOCK = false;

export const StatisticsService = {
  // Yardımcı fonksiyon: Token al
  getToken: () => {
    return challengeService.getToken();
  },

  // Kullanıcının genel profil istatistiklerini al
  getUserProfileStats: async () => {
    if (USE_MOCK) {
      console.log('Mock istatistik verileri kullanılıyor');
      return mockStats;
    }
    
    try {
      const token = StatisticsService.getToken();
      const response = await axios.get(`${API_URL}/statistics/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Profil istatistikleri alınamadı:', error);
      console.log('Hata nedeniyle mock veriler kullanılıyor');
      return mockStats; // Hata durumunda mock verileri döndür
    }
  },
  
  // Belirli bir kullanıcının istatistiklerini al
  getUserStats: async (userId) => {
    if (USE_MOCK) {
      console.log(`Mock kullanıcı (${userId}) istatistik verileri kullanılıyor`);
      return mockStats;
    }
    
    try {
      const token = StatisticsService.getToken();
      const response = await axios.get(`${API_URL}/statistics/user/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Kullanıcı (${userId}) istatistikleri alınamadı:`, error);
      console.log('Hata nedeniyle mock veriler kullanılıyor');
      return mockStats; // Hata durumunda mock verileri döndür
    }
  },
  
  // Kullanıcının oyun bazında istatistiklerini al
  getUserGameStats: async (gameId = null) => {
    if (USE_MOCK) {
      console.log(`Mock oyun (${gameId || 'tüm'}) istatistik verileri kullanılıyor`);
      return mockStats;
    }
    
    try {
      const token = StatisticsService.getToken();
      const url = gameId ? `/statistics/games/${gameId}` : '/statistics/games';
      const response = await axios.get(`${API_URL}${url}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Oyun istatistikleri alınamadı:', error);
      console.log('Hata nedeniyle mock veriler kullanılıyor');
      return mockStats; // Hata durumunda mock verileri döndür
    }
  }
}; 