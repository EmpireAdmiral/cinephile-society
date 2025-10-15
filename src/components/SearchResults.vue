<template>
  <Navbar />
  <div class="search-results-page">
    <!-- Search Header -->
    <div class="search-header">
      <div class="container">
        <h1 class="search-title">Search Results</h1>
        <p v-if="searchQuery" class="search-subtitle">
          Found {{ totalResults || 0 }} results for
          <span class="search-term">"{{ searchQuery }}"</span>
        </p>
      </div>
    </div>

    <div class="container">
      <!-- Filter Tabs -->
      <div class="filter-tabs">
        <button
          @click="activeFilter = 'all'"
          :class="['filter-tab', { active: activeFilter === 'all' }]"
        >
          All ({{ totalResults || 0 }})
        </button>
        <button
          @click="activeFilter = 'movie'"
          :class="['filter-tab', { active: activeFilter === 'movie' }]"
        >
          Movies ({{ movieCount }})
        </button>
        <button
          @click="activeFilter = 'tv'"
          :class="['filter-tab', { active: activeFilter === 'tv' }]"
        >
          TV Shows ({{ tvCount }})
        </button>
        <button
          @click="activeFilter = 'person'"
          :class="['filter-tab', { active: activeFilter === 'person' }]"
        >
          People ({{ peopleCount }})
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading && currentPage === 1" class="loading-container">
        <div class="loading-spinner"></div>
        <span class="loading-text">Fetching results...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-container">
        <div class="error-card">
          <h3 class="error-title">Search Error</h3>
          <p class="error-message">{{ error }}</p>
          <button @click="resetAndSearch" class="retry-button">
            Try Again
          </button>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="results.length === 0 && searchQuery" class="no-results">
        <div class="no-results-card">
          <svg class="no-results-icon" fill="currentColor" viewBox="0 0 24 24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          </svg>
          <h3 class="no-results-title">No movies found</h3>
          <p class="no-results-text">Try different keywords or check your spelling</p>
        </div>
      </div>

      <!-- Search Results -->
      <div v-else-if="results.length > 0" class="results-section">
        <div class="results-grid">
          <!-- Movies -->
          <MovieCard
            v-for="item in filteredResults.filter(item => item.media_type === 'movie')"
            :key="`movie-${item.id}`"
            :movie="item"
            :show-placeholder="true"
            @click="handleMovieClick"
          />

          <!-- TV Shows -->
          <TVCard
            v-for="item in filteredResults.filter(item => item.media_type === 'tv')"
            :key="`tv-${item.id}`"
            :show="item"
            :show-placeholder="true"
            @click="handleTVShowClick"
          />

          <!-- People -->
          <PersonCard
            v-for="item in filteredResults.filter(item => item.media_type === 'person')"
            :key="`person-${item.id}`"
            :person="item"
            @click="handlePersonClick"
          />
        </div>

        <!-- Load More Button -->
        <div v-if="hasMoreResults" class="load-more-container">
          <button
            @click="loadMoreResults"
            :disabled="loadingMore"
            class="load-more-btn"
          >
            <span v-if="loadingMore" class="loading-spinner-small"></span>
            <span>{{ loadingMore ? 'Loading...' : 'Load More Results' }}</span>
          </button>
        </div>
      </div>
    </div>
  </div>
  <app-footer />
</template>

<script>
import { tmdbService } from '@/services/tmdb'
import MovieCard from '@/components/MovieCard.vue'
import TVCard from '@/components/TVShowsCard.vue'
import PersonCard from '@/components/PersonCard.vue'
import Navbar from './Navbar.vue'
import AppFooter from './AppFooter.vue'

export default {
  name: 'SearchResults',
  components: {
    MovieCard, TVCard, PersonCard, AppFooter, Navbar
  },
  data() {
    return {
      results: [],
      loading: false,
      loadingMore: false,
      error: null,
      searchQuery: '',
      currentPage: 1,
      totalPages: 0,
      totalResults: 0,
      hasMoreResults: false,
      loadedCastFor: new Set(),
      activeFilter: 'all'
    }
  },
   computed: {
    filteredResults() {

      if (this.activeFilter === 'all') {
        return this.results;
      }
      return this.results.filter(item => item.media_type === this.activeFilter);
    },

    movieCount() {
      return this.results.filter(item => item.media_type === 'movie').length
    },

    tvCount() {
      return this.results.filter(item => item.media_type === 'tv').length
    },

    peopleCount() {
      return this.results.filter(item => item.media_type === 'person').length
    }
  },
  mounted() {
    this.searchQuery = this.$route.query.q || '';
    if (this.searchQuery) {
      this.searchAll();
    }
  },
  watch: {
    '$route'(to) {
      const newQuery = to.query.q || '';
      if (newQuery !== this.searchQuery) {
        this.searchQuery = newQuery;
        this.resetSearch();
        if (this.searchQuery) {
          this.searchAll();
        }
      }
    }
  },
  methods: {
    async searchAll() {
      this.loading = this.currentPage === 1;
      this.error = null;

      try {
        const data = await tmdbService.searchAll(this.searchQuery, this.currentPage);
        console.log('Search Data:', data);
        const newResults = data.results || [];

        if (this.currentPage === 1) {
          this.results = newResults;
        } else {
          this.results = [...this.results, ...newResults];
        }

        this.totalPages = data.total_pages || 0;
        this.totalResults = data.total_results || 0;
        this.hasMoreResults = this.currentPage < this.totalPages;

        // Load cast for movies and TV shows
        await this.loadAdditionalData();

      } catch (err) {
        this.error = err.message || 'An error occurred while searching';
        console.error('Search error:', err);
      } finally {
        this.loading = false;
        this.loadingMore = false;
      }
    },

     async loadAdditionalData() {
      // Load cast for movies
      const movies = this.results.filter(item =>
        item.media_type === 'movie' && !this.loadedCastFor.has(`movie-${item.id}`)
      ).slice(0, 12);

      for (const movie of movies) {
        try {
          const movieDetails = await tmdbService.getCompleteMovieDetails(movie.id);
          const movieIndex = this.results.findIndex(r => r.id === movie.id && r.media_type === 'movie');
          if (movieIndex !== -1) {
            this.results[movieIndex] = {
              ...this.results[movieIndex],
              cast: movieDetails.credits.cast
            };
          }
          this.loadedCastFor.add(`movie-${movie.id}`);
        } catch (error) {
          console.error(`Error loading cast for movie ${movie.id}:`, error);
        }
      }

      // Load cast for TV shows (you'll need to implement getTVShowDetails in your service)
      const tvShows = this.results.filter(item =>
        item.media_type === 'tv' && !this.loadedCastFor.has(`tv-${item.id}`)
      ).slice(0, 12);

      // Note: You'll need to add a getTVShowDetails method to your tmdbService
      // Similar to getCompleteMovieDetails but for TV shows
    },


    async loadCastForVisibleMovies() {
      // Load cast for first 12 movies to improve performance
      const moviesToLoadCast = this.movies.slice(0, 12).filter(movie =>
        !this.loadedCastFor.has(movie.id)
      );

      for (const movie of moviesToLoadCast) {
        try {
          const movieDetails = await tmdbService.getCompleteMovieDetails(movie.id);
          const movieIndex = this.movies.findIndex(m => m.id === movie.id);
          if (movieIndex !== -1) {
            this.movies[movieIndex] = {
              ...this.movies[movieIndex],
              cast: movieDetails.credits.cast
            };
          }
          this.loadedCastFor.add(movie.id);
        } catch (error) {
          console.error(`Error loading cast for movie ${movie.id}:`, error);
        }
      }
    },

    loadMoreResults() {
      if (this.hasMoreResults && !this.loadingMore) {
        this.loadingMore = true;
        this.currentPage++;
        this.searchMovies();
      }
    },

    resetSearch() {
      this.results = [];
      this.currentPage = 1;
      this.totalPages = 0;
      this.totalResults = 0;
      this.hasMoreResults = false;
      this.error = null;
      this.loadedCastFor.clear();
      this.activeFilter = 'all';
    },

    resetAndSearch() {
      this.resetSearch();
      if (this.searchQuery) {
        this.searchMovies();
      }
    },

    handleMovieClick(movie) {
      console.log('Movie clicked:', movie);
      this.$router.push({
        name: 'MovieDetail',
        params: { id: movie.id }
      });
    },

    handleTVShowClick(show) {
      this.$router.push({
        name: 'TvShowDetail',
        params: { id: show.id }
      });
    },

    handlePersonClick(person) {
      this.$router.push({
        name: 'Person',
        params: { id: person.id }
      });
    }
  }
}
</script>

<style scoped>
.search-results-page {
  min-height: 100vh;
  background: var(--gothic-black);
  color: var(--text-gothic-primary);
}

.search-header {
  background: var(--gothic-charcoal);
  border-bottom: 2px solid var(--text-gothic-secondary);
  padding: 2rem 0;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.search-title {
  font-size: 2.5rem;
  font-weight: bold;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.search-subtitle {
  color: var(--text-gothic-secondary);
  font-size: 1.1rem;
}

.search-term {
  color: var(--text-gothic-accent);
  font-weight: 600;
}

.loading-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4rem 0;
  flex-direction: column;
  gap: 1rem;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  color: var(--text-gothic-secondary);
  font-size: 1.1rem;
}

.error-container, .no-results {
  display: flex;
  justify-content: center;
  padding: 4rem 0;
}

.error-card, .no-results-card {
  background: var(--gothic-charcoal);
  border: 2px solid #dc2626;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  max-width: 500px;
}

.no-results-card {
  border-color: var(--text-gothic-secondary);
}

.error-title, .no-results-title {
  color: var(--text-gothic-accent);
  font-size: 1.5rem;
  margin-bottom: 1rem;
  font-weight: 600;
}

.error-message, .no-results-text {
  color: var(--text-gothic-secondary);
  margin-bottom: 1.5rem;
}

.no-results-icon {
  width: 64px;
  height: 64px;
  color: var(--text-gothic-secondary);
  margin-bottom: 1rem;
}

.retry-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.results-section {
  padding: 2rem 0;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
}

.movies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 2rem;
  justify-items: center;
}

.load-more-container {
  display: flex;
  justify-content: center;
  margin-top: 3rem;
}

.load-more-btn {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.load-more-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.load-more-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.loading-spinner-small {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 0 1rem;
  }

  .search-title {
    font-size: 2rem;
  }

  .movies-grid {
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .search-header {
    padding: 1.5rem 0;
  }

  .search-title {
    font-size: 1.8rem;
  }

  .movies-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 0.75rem;
  }
}
</style>
