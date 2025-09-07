<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <!-- Search Header -->
    <div class="bg-gray-800 border-b border-gray-700 py-6">
      <div class="container mx-auto px-4">
        <h1 class="text-2xl font-bold text-purple-400 mb-2">Search Results</h1>
        <p class="text-gray-300" v-if="searchQuery">
          Results for "<span class="text-purple-300">{{ searchQuery }}</span>"
        </p>
      </div>
    </div>

    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
        <span class="ml-3 text-gray-300">Searching movies...</span>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <div class="bg-red-900/20 border border-red-800 rounded-lg p-6 max-w-md mx-auto">
          <h3 class="text-red-400 font-semibold mb-2">Search Error</h3>
          <p class="text-gray-300">{{ error }}</p>
        </div>
      </div>

      <!-- No Results -->
      <div v-else-if="movies.length === 0 && searchQuery" class="text-center py-12">
        <div class="bg-gray-800 border border-gray-700 rounded-lg p-8 max-w-md mx-auto">
          <h3 class="text-gray-400 font-semibold mb-2">No Results Found</h3>
          <p class="text-gray-500">Try searching with different keywords</p>
        </div>
      </div>

      <!-- Search Results Grid -->
      <div v-else-if="movies.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="movie in movies"
          :key="movie.id"
          class="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-purple-500 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10"
        >
          <!-- Movie Poster -->
          <div class="relative aspect-[2/3] bg-gray-700">
            <img
              v-if="movie.poster_path"
              :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
              :alt="movie.title"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <div v-else class="w-full h-full flex items-center justify-center text-gray-500">
              <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
              </svg>
            </div>

            <!-- Rating Badge -->
            <div v-if="movie.vote_average > 0" class="absolute top-3 right-3">
              <div class="bg-black/80 backdrop-blur-sm rounded-full px-2 py-1 flex items-center">
                <svg class="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="text-white text-sm font-medium">{{ movie.vote_average.toFixed(1) }}</span>
              </div>
            </div>
          </div>

          <!-- Movie Info -->
          <div class="p-4">
            <!-- Title and Year -->
            <h3 class="font-bold text-lg text-white mb-2 line-clamp-2">
              {{ movie.title }}
              <span v-if="movie.release_date" class="text-gray-400 font-normal">
                ({{ new Date(movie.release_date).getFullYear() }})
              </span>
            </h3>

            <!-- Overview -->
            <p v-if="movie.overview" class="text-gray-300 text-sm line-clamp-3 mb-3">
              {{ movie.overview }}
            </p>

            <!-- Genres -->
            <div v-if="movie.genre_ids && movie.genre_ids.length > 0" class="mb-3">
              <div class="flex flex-wrap gap-1">
                <span
                  v-for="genreId in movie.genre_ids.slice(0, 3)"
                  :key="genreId"
                  class="bg-purple-900/30 text-purple-300 px-2 py-1 rounded text-xs"
                >
                  {{ getGenreName(genreId) }}
                </span>
              </div>
            </div>

            <!-- Crew Info (will be populated when we fetch detailed data) -->
            <div v-if="movie.crew && movie.crew.length > 0" class="text-sm text-gray-400 mb-3">
              <div v-if="movie.crew.find(c => c.job === 'Director')">
                <span class="text-gray-300">Director:</span>
                {{ movie.crew.find(c => c.job === 'Director').name }}
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex gap-2 pt-2">
              <button
                @click="viewMovieDetails(movie)"
                class="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded font-medium transition-colors"
              >
                View Details
              </button>
              <button
                @click="addToWatchlist(movie)"
                class="bg-gray-700 hover:bg-gray-600 text-gray-200 py-2 px-3 rounded transition-colors"
                title="Add to Watchlist"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="movies.length > 0 && hasMoreResults" class="text-center mt-8">
        <button
          @click="loadMoreResults"
          :disabled="loadingMore"
          class="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
        >
          <span v-if="loadingMore">Loading...</span>
          <span v-else>Load More Results</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { tmdbService } from '@/services/tmdb'
const genreMap = {
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
}

export default {
  name: 'SearchResults',
  data() {
    return {
      movies: [],
      loading: false,
      loadingMore: false,
      error: null,
      searchQuery: '',
      currentPage: 1,
      totalPages: 0,
      hasMoreResults: false
    }
  },
  mounted() {
    // Get search query from route params or query string
    this.searchQuery = this.$route.query.q || this.$route.params.query || '';
    if (this.searchQuery) {
      this.searchMovies();
    }
  },
  watch: {
    '$route'(to) {
      // Watch for route changes to handle new searches
      const newQuery = to.query.q || to.params.query || '';
      if (newQuery !== this.searchQuery) {
        this.searchQuery = newQuery;
        this.resetSearch();
        if (this.searchQuery) {
          this.searchMovies();
        }
      }
    }
  },
  methods: {
    async searchMovies() {
      this.loading = true;
      this.error = null;

      try {
        const data = await tmdbService.searchMovies(this.searchQuery, this.currentPage);

        if (this.currentPage === 1) {
          this.movies = data.results || [];
        } else {
          this.movies = [...this.movies, ...(data.results || [])];
        }

        this.totalPages = data.total_pages || 0;
        this.hasMoreResults = this.currentPage < this.totalPages;

      } catch (err) {
        this.error = err.message || 'An error occurred while searching';
        console.error('Search error:', err);
      } finally {
        this.loading = false;
        this.loadingMore = false;
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
      this.movies = [];
      this.currentPage = 1;
      this.totalPages = 0;
      this.hasMoreResults = false;
      this.error = null;
    },

    viewMovieDetails(movie) {
      // Navigate to movie detail page
      this.$router.push(`/movie/${movie.id}`);
    },

    addToWatchlist(movie) {
      // Add to watchlist functionality
      console.log('Adding to watchlist:', movie.title);
    },

    getGenreName(genreId) {
      return genreMap[genreId] || 'Unknown';
    }

    // ... rest of your existing methods
  }
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
