
import { Movie, api } from "./api";

export interface UserPreference {
  likedGenres: number[];
  dislikedGenres: number[];
  likedMovies: number[];
  dislikedMovies: number[];
  preferredDecade?: string;
  minRating?: number;
}

export interface RecommendationRequest {
  preferences: UserPreference;
  mood?: string;
  occasion?: string;
}

// Simple AI recommendation engine
export class AIRecommendationEngine {
  private static instance: AIRecommendationEngine;
  private userPreferences: UserPreference = {
    likedGenres: [],
    dislikedGenres: [],
    likedMovies: [],
    dislikedMovies: [],
  };

  static getInstance(): AIRecommendationEngine {
    if (!AIRecommendationEngine.instance) {
      AIRecommendationEngine.instance = new AIRecommendationEngine();
    }
    return AIRecommendationEngine.instance;
  }

  // Load preferences from localStorage
  loadPreferences(): UserPreference {
    const saved = localStorage.getItem('moviePreferences');
    if (saved) {
      this.userPreferences = JSON.parse(saved);
    }
    return this.userPreferences;
  }

  // Save preferences to localStorage
  savePreferences(preferences: UserPreference): void {
    this.userPreferences = preferences;
    localStorage.setItem('moviePreferences', JSON.stringify(preferences));
  }

  // Update preferences based on user feedback
  updatePreferences(movieId: number, liked: boolean, genreIds: number[]): void {
    const prefs = this.loadPreferences();
    
    if (liked) {
      if (!prefs.likedMovies.includes(movieId)) {
        prefs.likedMovies.push(movieId);
      }
      // Remove from disliked if it was there
      prefs.dislikedMovies = prefs.dislikedMovies.filter(id => id !== movieId);
      
      // Update genre preferences
      genreIds.forEach(genreId => {
        if (!prefs.likedGenres.includes(genreId)) {
          prefs.likedGenres.push(genreId);
        }
        prefs.dislikedGenres = prefs.dislikedGenres.filter(id => id !== genreId);
      });
    } else {
      if (!prefs.dislikedMovies.includes(movieId)) {
        prefs.dislikedMovies.push(movieId);
      }
      // Remove from liked if it was there
      prefs.likedMovies = prefs.likedMovies.filter(id => id !== movieId);
      
      // Update genre preferences (less aggressive)
      genreIds.forEach(genreId => {
        if (!prefs.dislikedGenres.includes(genreId)) {
          prefs.dislikedGenres.push(genreId);
        }
      });
    }
    
    this.savePreferences(prefs);
  }

  // Generate recommendations based on preferences
  async generateRecommendations(): Promise<Movie[]> {
    const prefs = this.loadPreferences();
    const recommendations: Movie[] = [];

    try {
      // Get movies from preferred genres
      if (prefs.likedGenres.length > 0) {
        for (const genreId of prefs.likedGenres.slice(0, 3)) {
          const genreMovies = await api.getMoviesByGenre(genreId, 1);
          recommendations.push(...genreMovies.results.slice(0, 5));
        }
      } else {
        // If no preferences, get popular movies
        const popular = await api.getPopular(1);
        recommendations.push(...popular.results.slice(0, 10));
      }

      // Filter out disliked movies and genres
      const filtered = recommendations.filter(movie => {
        const hasDislikedGenre = movie.genre_ids?.some(id => 
          prefs.dislikedGenres.includes(id)
        );
        const isDislikedMovie = prefs.dislikedMovies.includes(movie.id);
        const isAlreadyLiked = prefs.likedMovies.includes(movie.id);
        
        return !hasDislikedGenre && !isDislikedMovie && !isAlreadyLiked;
      });

      // Remove duplicates and return top 20
      const unique = filtered.filter((movie, index, self) => 
        index === self.findIndex(m => m.id === movie.id)
      );

      return unique.slice(0, 20);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      return [];
    }
  }

  // Get mood-based recommendations
  async getMoodRecommendations(mood: string): Promise<Movie[]> {
    const moodGenreMap: Record<string, number[]> = {
      happy: [35, 16, 10751], // Comedy, Animation, Family
      sad: [18, 10749], // Drama, Romance
      excited: [28, 12, 878], // Action, Adventure, Sci-Fi
      relaxed: [99, 10770], // Documentary, TV Movie
      romantic: [10749, 35], // Romance, Comedy
      thrilled: [53, 27, 9648], // Thriller, Horror, Mystery
    };

    const genreIds = moodGenreMap[mood.toLowerCase()] || [28, 35, 18]; // Default to Action, Comedy, Drama
    
    try {
      const movies: Movie[] = [];
      for (const genreId of genreIds) {
        const response = await api.getMoviesByGenre(genreId, 1);
        movies.push(...response.results.slice(0, 5));
      }
      
      return movies.filter((movie, index, self) => 
        index === self.findIndex(m => m.id === movie.id)
      ).slice(0, 15);
    } catch (error) {
      console.error('Error getting mood recommendations:', error);
      return [];
    }
  }

  // Get recommendations based on similar movies
  async getSimilarRecommendations(movieId: number): Promise<Movie[]> {
    try {
      const similar = await api.getSimilarMovies(movieId);
      return similar.results.slice(0, 10);
    } catch (error) {
      console.error('Error getting similar recommendations:', error);
      return [];
    }
  }
}

export const aiRecommendations = AIRecommendationEngine.getInstance();
