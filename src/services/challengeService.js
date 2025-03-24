const API_BASE_URL = 'http://localhost:8090';

export const createChallenge = async (challengeData) => {
    try {
        const token = localStorage.getItem('token'); // JWT token'ı localStorage'dan al
        
        const response = await fetch(`${API_BASE_URL}/api/challenges`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: challengeData.title,
                description: challengeData.description,
                difficulty: challengeData.difficulty,
                category: challengeData.category,
                points: challengeData.points,
                game: challengeData.game,
                platform: challengeData.platform,
                duration: challengeData.duration,
                maxParticipants: challengeData.maxParticipants,
                communicationLink: challengeData.communicationLink
            })
        });

        if (!response.ok) {
            throw new Error('Meydan okuma oluşturulurken bir hata oluştu');
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error('Meydan okuma oluşturma hatası:', error);
        throw error;
    }
}; 