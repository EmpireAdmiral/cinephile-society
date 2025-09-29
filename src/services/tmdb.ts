interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  runtime?: number;
  genres?: Genre[];
  tagline?: string;
  budget?: number;
  revenue?: number;
  spoken_languages?: Language[];
  production_companies?: ProductionCompany[];
  genre_ids?: number[];
}

interface Genre {
  id: number;
  name: string;
}

interface Language {
  iso_639_1: string;
  english_name: string;
  name: string;
}

interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

interface SearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface MovieDetails extends Movie {
  credits: Credits;
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const debug = true;

export const tmdbService = {

  searchAll: async (query: string, page = 1) => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }

    const response = await fetch(
      `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );

    if (!response.ok) {
      throw new Error('Failed to search');
    }

    return response.json();
  },

  /**
   * Get multi-search suggestions for autocomplete
   */
  getMultiSearchSuggestions: async (query: string) => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }

    if (query.trim().length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `${BASE_URL}/search/multi?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=1`
      );

      if (response.ok) {
        const data = await response.json();
        // Return top 5 suggestions, prioritizing movies and TV shows over people
        return data.results
          .filter((item:any) => item.media_type === 'movie' || item.media_type === 'tv')
          .slice(0, 5);
      }

      return [];
    } catch (error) {
      console.error('Error fetching multi-search suggestions:', error);
      return [];
    }
  },


  /**
   * Search for movies with basic information
   */
  searchMovies: async (query: string, page: number = 1): Promise<SearchResponse> => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }

    const response = await fetch(
      `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
    );

    if (!response.ok) {
      throw new Error('Failed to search movies');
    }

    if (debug) {
      console.log('Search Movies Response:', response);
    }

    return response.json();
  },

  /**
   * Get complete movie details including cast and crew in a single call
   */
  getCompleteMovieDetails: async (movieId: string | number): Promise<MovieDetails> => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }

    try {
      // Fetch movie details and credits in parallel
      const [movieResponse, creditsResponse] = await Promise.all([
        fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}`),
        fetch(`${BASE_URL}/movie/${movieId}/credits?api_key=${API_KEY}`)
      ]);

      if (!movieResponse.ok) {
        throw new Error('Movie not found');
      }

      const movieData: Movie = await movieResponse.json();

      let credits: Credits = { cast: [], crew: [] };
      if (creditsResponse.ok) {
        credits = await creditsResponse.json();
      }

      return {
        ...movieData,
        credits
      };
    } catch (error) {
      console.error('Error fetching movie details:', error);
      throw error instanceof Error ? error : new Error('An error occurred while fetching movie details');
    }
  },

/**
 * Get popular movies this week
 */
  getPopularMovies: async (page = 1) => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }

    const response = await fetch(
      `${BASE_URL}/movie/popular?api_key=${API_KEY}&page=${page}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch popular movies');
    }

    return response.json();
  },

  /**
   * Get top rated movies of all time
   */
  getTopRatedMovies: async (page = 1) => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }

    const response = await fetch(
      `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&page=${page}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch top rated movies');
    }

    return response.json();
  },

  /**
   * Get popular TV shows this week
   */
  getPopularTVShows: async (page = 1) => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }

    const response = await fetch(
      `${BASE_URL}/tv/popular?api_key=${API_KEY}&page=${page}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch popular TV shows');
    }

    return response.json();
  },

  /**
   * Get top rated TV shows of all time
   */
  getTopRatedTVShows: async (page = 1) => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }

    const response = await fetch(
      `${BASE_URL}/tv/top_rated?api_key=${API_KEY}&page=${page}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch top rated TV shows');
    }

    return response.json();
  },
  /**
   * Get trending movies of the week
   */
  getWeekTrendingMovies: async (page = 1) => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }
    const response = await fetch(
      `${BASE_URL}/trending/movie/week?api_key=${API_KEY}&page=${page}`
    );
     if (!response.ok) {
      throw new Error('Failed to fetch top rated TV shows');
    }

    return response.json();
  },

  /**
   * Get trending TV shows of the week
  */
  getWeekTrendingTVShows: async (page = 1) => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }
    const response = await fetch(
      `${BASE_URL}/trending/tv/week?api_key=${API_KEY}&page=${page}`
    );
      if (!response.ok) {
      throw new Error('Failed to fetch top rated TV shows');
    }
    return response.json();
  },

}

// Export types for use in components
export type {
  Movie,
  Genre,
  Language,
  ProductionCompany,
  CastMember,
  CrewMember,
  Credits,
  SearchResponse,
  MovieDetails
};
