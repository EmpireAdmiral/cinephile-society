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

export const tmdbService = {
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
   * Get suggestions for search autocomplete
   */
  getSearchSuggestions: async (query: string): Promise<Movie[]> => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }

    if (query.trim().length < 2) {
      return [];
    }

    try {
      const response = await fetch(
        `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=1`
      );

      if (response.ok) {
        const data: SearchResponse = await response.json();
        return data.results.slice(0, 5); // Return top 5 suggestions
      }

      return [];
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      return [];
    }
  }
};

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
