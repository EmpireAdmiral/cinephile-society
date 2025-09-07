// TMDB API Configuration

export const TMDB_CONFIG = {
  API_KEY: process.env.VUE_APP_TMDB_API_KEY || '',
  BASE_URL: 'https://api.themoviedb.org/3',
  IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',

  // Image sizes available from TMDB
  IMAGE_SIZES: {
    poster: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
    backdrop: ['w300', 'w780', 'w1280', 'original'],
    profile: ['w45', 'w185', 'h632', 'original']
  }
};

// API Helper functions
export const tmdbApi = {
  // Search movies
  searchMovies: async (query, page = 1) => {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/search/movie?api_key=${TMDB_CONFIG.API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );
    if (!response.ok) throw new Error('Failed to search movies');
    return response.json();
  },

  // Get movie details
  getMovieDetails: async (movieId) => {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}?api_key=${TMDB_CONFIG.API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to fetch movie details');
    return response.json();
  },

  // Get movie credits (cast and crew)
  getMovieCredits: async (movieId) => {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/${movieId}/credits?api_key=${TMDB_CONFIG.API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to fetch movie credits');
    return response.json();
  },

  // Get popular movies
  getPopularMovies: async (page = 1) => {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/movie/popular?api_key=${TMDB_CONFIG.API_KEY}&page=${page}`
    );
    if (!response.ok) throw new Error('Failed to fetch popular movies');
    return response.json();
  },

  // Get movie genres
  getGenres: async () => {
    const response = await fetch(
      `${TMDB_CONFIG.BASE_URL}/genre/movie/list?api_key=${TMDB_CONFIG.API_KEY}`
    );
    if (!response.ok) throw new Error('Failed to fetch genres');
    return response.json();
  },

  // Helper to build image URLs
  getImageUrl: (path, type = 'poster', size = 'w500') => {
    if (!path) return null;
    return `${TMDB_CONFIG.IMAGE_BASE_URL}/${size}${path}`;
  }
};

// Genre mapping (backup in case API call fails)
export const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western'
};
