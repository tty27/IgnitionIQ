const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = {
  // Get questions with explanations
  async getQuestions(category: string, level?: number, token?: string) {
    const endpoint = level 
      ? `/api/levels/questions/${category}/${level}`
      : `/api/levels/questions/${category}`;
    
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch questions');
    }

    return response.json();
  },

  // Submit quiz results
  async submitQuizResult(data: any, token: string) {
    const response = await fetch(`${API_URL}/api/levels/results`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Failed to submit result');
    }

    return response.json();
  },

  // Get leaderboard
  async getGlobalLeaderboard(limit = 100, offset = 0) {
    const response = await fetch(
      `${API_URL}/api/leaderboard/global?limit=${limit}&offset=${offset}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }

    return response.json();
  },

  // Get category leaderboard
  async getCategoryLeaderboard(category: string, limit = 100) {
    const response = await fetch(
      `${API_URL}/api/leaderboard/category/${category}?limit=${limit}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch leaderboard');
    }

    return response.json();
  },

  // Get user rank
  async getMyRank(token: string) {
    try {
      const response = await fetch(`${API_URL}/api/leaderboard/my-rank`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn('Failed to fetch rank:', response.status);
        return null; // Return null if user has no rank yet
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching rank:', error);
      return null;
    }
  },

  // Get incorrect answers for review
  async getIncorrectAnswers(token: string, category?: string, limit = 50) {
    try {
      const endpoint = category 
        ? `/api/review/incorrect?category=${category}&limit=${limit}`
        : `/api/review/incorrect?limit=${limit}`;

      const response = await fetch(`${API_URL}${endpoint}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        // If it's a 404 or server error, return empty array instead of throwing
        console.warn('Failed to fetch incorrect answers:', response.status);
        return [];
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching incorrect answers:', error);
      return []; // Return empty array on error
    }
  },

  // Get performance analytics
  async getPerformanceAnalytics(token: string) {
    try {
      const response = await fetch(`${API_URL}/api/review/analytics`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        console.warn('Failed to fetch analytics:', response.status);
        // Return default analytics structure
        return {
          overall: {
            total_attempts: 0,
            correct_answers: 0,
            accuracy_percentage: 0
          },
          categories: [],
          difficultQuestions: [],
          recentProgress: []
        };
      }

      return response.json();
    } catch (error) {
      console.error('Error fetching analytics:', error);
      // Return default analytics structure on error
      return {
        overall: {
          total_attempts: 0,
          correct_answers: 0,
          accuracy_percentage: 0
        },
        categories: [],
        difficultQuestions: [],
        recentProgress: []
      };
    }
  }
};

export default api;