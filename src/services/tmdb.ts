interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;

  // Detailed movie information
  adult: boolean;
  video: boolean;
  runtime?: number;
  genres?: Genre[];
  tagline?: string;
  budget?: number;
  revenue?: number;
  spoken_languages?: Language[];
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];

  // Additional fields
  genre_ids?: number[];
  popularity?: number;
  original_language?: string;
  belongs_to_collection?: Collection | null;
  homepage?: string;
  imdb_id?: string;
  origin_country?: string[];
  status?: string;

  // Added after fetching credits
  cast?: CastMember[];

  // For multi-search results
  media_type?: 'movie';
}

// Add these new interfaces
interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

interface ProductionCountry {
  iso_3166_1: string;
  name: string;
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
interface Person {
  id: number;
  name: string;
  also_known_as: string[];
  biography: string;
  birthday: string | null;
  deathday: string | null;
  gender: number;
  homepage: string | null;
  imdb_id: string;
  known_for_department: string;
  place_of_birth: string | null;
  popularity: number;
  profile_path: string | null;
  adult: boolean;
  known_for?: CombinedCastCredit[];
  media_type?: 'person';
}
interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

// For combined credits (full details with character/job info)
interface CombinedCredits {
  cast: CombinedCastCredit[];
  crew: CombinedCrewCredit[];
}

interface CombinedCastCredit {
  id: number;
  media_type: 'movie' | 'tv';

  // Movie fields
  title?: string;
  original_title?: string;
  release_date?: string;

  // TV fields
  name?: string;
  original_name?: string;
  first_air_date?: string;
  episode_count?: number;

  // Common fields
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  video?: boolean;
  vote_average: number;
  vote_count: number;

  // Cast-specific fields
  character: string;
  credit_id: string;
  order: number;
}

interface CombinedCrewCredit {
  id: number;
  media_type: 'movie' | 'tv';

  // Movie fields
  title?: string;
  original_title?: string;
  release_date?: string;

  // TV fields
  name?: string;
  original_name?: string;
  first_air_date?: string;
  episode_count?: number;

  // Common fields
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  original_language: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  video?: boolean;
  vote_average: number;
  vote_count: number;

  // Crew-specific fields
  credit_id: string;
  department: string;
  job: string;
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


interface MultiSearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  adult: boolean;
  title?: string;
  original_title?: string;
  release_date?: string;
  video?: boolean;
  name?: string;
  original_name?: string;
  first_air_date?: string;
  origin_country?: string[];
  gender?: number;
  known_for_department?: string;
  known_for?: Array<{
    id: number;
    media_type: string;
    title?: string;
    name?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    vote_count: number;
  }>;
  popularity: number;
  overview?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  backdrop_path?: string | null;
  original_language?: string;
  genre_ids?: number[];
  vote_average?: number;
  vote_count?: number;
}

interface MultiSearchResponse {
  page: number;
  results: MultiSearchResult[];
  total_pages: number;
  total_results: number;
}

interface RecommendationsResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

interface TVShow {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date: string;
  vote_average: number;
  vote_count: number;

  // TV-specific fields
  number_of_seasons: number;
  number_of_episodes: number;
  episode_run_time: number[];
  genres?: Genre[];
  tagline?: string;
  spoken_languages?: Language[];
  production_companies?: ProductionCompany[];
  created_by?: Creator[];
  networks?: Network[];
  seasons?: Season[];
  status?: string;
  type?: string;

  // Additional fields
  genre_ids?: number[];
  popularity?: number;
  original_language?: string;
  origin_country?: string[];
  adult?: boolean;

  media_type?: 'tv';
}

interface Creator {
  id: number;
  name: string;
  profile_path: string | null;
}

interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

interface Season {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string;
  episode_count: number;
}

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  vote_average: number;
  vote_count: number;
  runtime: number;
}

interface TVShowDetails extends TVShow {
  credits: Credits;
}

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const debug = true;

export const tmdbService = {

  searchAll: async (query: string, page: number = 1): Promise<MultiSearchResponse> => {
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

  getMultiSearchSuggestions: async (query: string): Promise<MultiSearchResult[]> => {
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
        const data: MultiSearchResponse = await response.json();
        return data.results.slice(0, 10);
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

  /**
   * Get list of movie genres
   */
  getMovieGenres: async (): Promise<Genre[]> => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }
    const response = await fetch(
      `${BASE_URL}/genre/movie/list?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch genres');
    }
    const data = await response.json();
    return data.genres;
  },

  /**
   * Get list of TV show genres
   */
  getTVGenres: async (): Promise<Genre[]> => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }
    const response = await fetch(
      `${BASE_URL}/genre/tv/list?api_key=${API_KEY}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch TV genres');
    }
    const data = await response.json();
    return data.genres;
  },

  /**
   * Get a list of recommended movies based on a movie ID
   * @param movieId The ID of the movie to get recommendations for
   * @param page The page of results to fetch (default is 1)
   * @returns A promise that resolves to a list of recommended movies
   * @throws An error if the API key is not configured or if the fetch fails
   * @example
   * const recommendations = await tmdbService.getMovieRecommendations(123456);
   */
  getMovieRecommendations: async (movieId: number | string, page = 1): Promise<SearchResponse> => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }
    const response = await fetch(
      `${BASE_URL}/movie/${movieId}/recommendations?api_key=${API_KEY}&page=${page}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch movie recommendations');
    }
    return response.json();
  },

  /*
  * Get Person Details by ID
  */
  getPersonDetails: async (personId: number | string): Promise<Person> => {
    if (!API_KEY) {
       throw new Error('TMDB API key not configured');
     }
     const response = await fetch(
       `${BASE_URL}/person/${personId}?api_key=${API_KEY}`
     );
     if (!response.ok) {
       throw new Error('Failed to fetch person details');
     }
     return response.json();
   },
   /**
 * Get combined movie and TV credits for a person
 */
  getPersonCombinedCredits: async (personId: string | number): Promise<CombinedCredits> => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }

    const response = await fetch(
      `${BASE_URL}/person/${personId}/combined_credits?api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch person credits');
    }

    return response.json();
  },

  getCompleteTVShowDetails: async (tvId: string | number): Promise<TVShowDetails> => {
  if (!API_KEY) {
    throw new Error('TMDB API key not configured');
  }

  try {
    const [tvResponse, creditsResponse] = await Promise.all([
      fetch(`${BASE_URL}/tv/${tvId}?api_key=${API_KEY}`),
      fetch(`${BASE_URL}/tv/${tvId}/credits?api_key=${API_KEY}`)
    ]);

    if (!tvResponse.ok) {
      throw new Error('TV show not found');
    }

    const tvData = await tvResponse.json();
    let credits: Credits = { cast: [], crew: [] };

    if (creditsResponse.ok) {
      credits = await creditsResponse.json();
    }

    return {
      ...tvData,
      credits
    };
  } catch (error) {
    console.error('Error fetching TV show details:', error);
    throw error instanceof Error ? error : new Error('An error occurred while fetching TV show details');
  }
},

/**
 * Get season details with episodes
 */
  getTVSeasonDetails: async (tvId: string | number, seasonNumber: number) => {
    if (!API_KEY) {
      throw new Error('TMDB API key not configured');
    }

    const response = await fetch(
      `${BASE_URL}/tv/${tvId}/season/${seasonNumber}?api_key=${API_KEY}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch season details');
    }

    return response.json();
  }
}

// Export types for use in components
export type {
  Movie,
  Genre,
  Language,
  ProductionCompany,
  ProductionCountry,
  Collection,
  CastMember,
  CrewMember,
  Credits,
  SearchResponse,
  MovieDetails,
  MultiSearchResult,
  MultiSearchResponse,
  RecommendationsResponse,
  Person,
  CombinedCredits,
  CombinedCastCredit,
  CombinedCrewCredit
};
