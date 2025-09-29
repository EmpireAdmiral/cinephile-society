<template>
  <Navbar />
  <div class="discover-page">
    <!-- Page Header -->
    <div class="discover-header">
      <div class="container">
        <h1 class="page-title">Discover</h1>
        <p class="page-subtitle">Find your next favorite movie or TV show</p>
      </div>
    </div>

    <div class="container">
      <!-- Popular Movies This Week -->
      <section class="discover-section">
        <div class="section-header">
          <h2 class="section-title">Popular Movies This Week</h2>
          <button @click="viewAllMovies('popular')" class="view-all-btn">
            View All
            <svg class="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="movies-row" v-if="!loading.popularMovies">
          <div class="scroll-container" ref="popularMoviesScroll">
            <MovieCard
              v-for="movie in popularMovies"
              :key="movie.id"
              :movie="movie"
              @click="handleMovieClick"
              class="movie-card-item"
            />
          </div>
          <button class="scroll-btn scroll-left" @click="scrollLeft('popularMoviesScroll')" :disabled="scrollPositions.popularMovies <= 0">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button class="scroll-btn scroll-right" @click="scrollRight('popularMoviesScroll')">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div v-else class="loading-row">
          <div class="loading-spinner"></div>
          <span>Loading popular movies...</span>
        </div>
      </section>

      <!-- Top Rated Movies -->
      <section class="discover-section">
        <div class="section-header">
          <h2 class="section-title">Top Rated Movies of All Time</h2>
          <button @click="viewAllMovies('top_rated')" class="view-all-btn">
            View All
            <svg class="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="movies-row" v-if="!loading.topRatedMovies">
          <div class="scroll-container" ref="topRatedMoviesScroll">
            <MovieCard
              v-for="movie in topRatedMovies"
              :key="movie.id"
              :movie="movie"
              @click="handleMovieClick"
              class="movie-card-item"
            />
          </div>
          <button class="scroll-btn scroll-left" @click="scrollLeft('topRatedMoviesScroll')" :disabled="scrollPositions.topRatedMovies <= 0">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button class="scroll-btn scroll-right" @click="scrollRight('topRatedMoviesScroll')">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div v-else class="loading-row">
          <div class="loading-spinner"></div>
          <span>Loading top rated movies...</span>
        </div>
      </section>

      <!-- Popular TV Shows This Week -->
      <section class="discover-section">
        <div class="section-header">
          <h2 class="section-title">Popular TV Shows This Week</h2>
          <button @click="viewAllTVShows('popular')" class="view-all-btn">
            View All
            <svg class="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="movies-row" v-if="!loading.popularTVShows">
          <div class="scroll-container" ref="popularTVShowsScroll">
            <TVCard
              v-for="show in popularTVShows"
              :key="show.id"
              :show="show"
              @click="handleTVShowClick"
              class="movie-card-item"
            />
          </div>
          <button class="scroll-btn scroll-left" @click="scrollLeft('popularTVShowsScroll')" :disabled="scrollPositions.popularTVShows <= 0">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button class="scroll-btn scroll-right" @click="scrollRight('popularTVShowsScroll')">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div v-else class="loading-row">
          <div class="loading-spinner"></div>
          <span>Loading popular TV shows...</span>
        </div>
      </section>

      <!-- Top Rated TV Shows -->
      <section class="discover-section">
        <div class="section-header">
          <h2 class="section-title">Top Rated TV Shows of All Time</h2>
          <button @click="viewAllTVShows('top_rated')" class="view-all-btn">
            View All
            <svg class="btn-arrow" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div class="movies-row" v-if="!loading.topRatedTVShows">
          <div class="scroll-container" ref="topRatedTVShowsScroll">
            <TVCard
              v-for="show in topRatedTVShows"
              :key="show.id"
              :show="show"
              @click="handleTVShowClick"
              class="movie-card-item"
            />
          </div>
          <button class="scroll-btn scroll-left" @click="scrollLeft('topRatedTVShowsScroll')" :disabled="scrollPositions.topRatedTVShows <= 0">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button class="scroll-btn scroll-right" @click="scrollRight('topRatedTVShowsScroll')">
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        <div v-else class="loading-row">
          <div class="loading-spinner"></div>
          <span>Loading top rated TV shows...</span>
        </div>
      </section>
    </div>
  </div>
</template>

<script>
import { tmdbService } from '@/services/tmdb'
import MovieCard from '@/components/MovieCard.vue'
import TVCard from '@/components/TVShowsCard.vue' // You'll need to create this

export default {
  name: 'Discover',
  components: {
    MovieCard,
    TVCard
  },
  data() {
    return {
      popularMovies: [],
      topRatedMovies: [],
      popularTVShows: [],
      topRatedTVShows: [],
      loading: {
        popularMovies: true,
        topRatedMovies: true,
        popularTVShows: true,
        topRatedTVShows: true
      },
      scrollPositions: {
        popularMovies: 0,
        topRatedMovies: 0,
        popularTVShows: 0,
        topRatedTVShows: 0
      }
    }
  },
  async mounted() {
    await this.loadAllData()
  },
  methods: {
    async loadAllData() {
      await Promise.all([
        this.loadPopularMovies(),
        this.loadTopRatedMovies(),
        this.loadPopularTVShows(),
        this.loadTopRatedTVShows()
      ])
    },

    async loadPopularMovies() {
      try {
        const data = await tmdbService.getPopularMovies()
        this.popularMovies = data.results.slice(0, 20) // Show first 20
        await this.loadCastForMovies(this.popularMovies.slice(0, 10))
      } catch (error) {
        console.error('Error loading popular movies:', error)
      } finally {
        this.loading.popularMovies = false
      }
    },

    async loadTopRatedMovies() {
      try {
        const data = await tmdbService.getTopRatedMovies()
        this.topRatedMovies = data.results.slice(0, 20)
        await this.loadCastForMovies(this.topRatedMovies.slice(0, 10))
      } catch (error) {
        console.error('Error loading top rated movies:', error)
      } finally {
        this.loading.topRatedMovies = false
      }
    },

    async loadPopularTVShows() {
      try {
        const data = await tmdbService.getPopularTVShows()
        this.popularTVShows = data.results.slice(0, 20)
        await this.loadCastForTVShows(this.popularTVShows.slice(0, 10))
      } catch (error) {
        console.error('Error loading popular TV shows:', error)
      } finally {
        this.loading.popularTVShows = false
      }
    },

    async loadTopRatedTVShows() {
      try {
        const data = await tmdbService.getTopRatedTVShows()
        this.topRatedTVShows = data.results.slice(0, 20)
        await this.loadCastForTVShows(this.topRatedTVShows.slice(0, 10))
      } catch (error) {
        console.error('Error loading top rated TV shows:', error)
      } finally {
        this.loading.topRatedTVShows = false
      }
    },

    async loadCastForMovies(movies) {
      for (const movie of movies) {
        try {
          const movieDetails = await tmdbService.getCompleteMovieDetails(movie.id)
          const movieIndex = this.popularMovies.findIndex(m => m.id === movie.id) ||
                           this.topRatedMovies.findIndex(m => m.id === movie.id)

          if (movieIndex !== -1) {
            // Update in both arrays if movie exists there
            if (this.popularMovies.find(m => m.id === movie.id)) {
              this.popularMovies[this.popularMovies.findIndex(m => m.id === movie.id)].cast = movieDetails.credits.cast
            }
            if (this.topRatedMovies.find(m => m.id === movie.id)) {
              this.topRatedMovies[this.topRatedMovies.findIndex(m => m.id === movie.id)].cast = movieDetails.credits.cast
            }
          }
        } catch (error) {
          console.error(`Error loading cast for movie ${movie.id}:`, error)
        }
      }
    },

    async loadCastForTVShows(shows) {
      // For TV shows, you'll need to implement similar cast loading
      // This is a placeholder since TV show cast loading might be different
      console.log('Loading cast for TV shows:', shows)
    },

    scrollLeft(refName) {
      const container = this.$refs[refName]
      const scrollAmount = 300
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' })
      this.scrollPositions[refName.replace('Scroll', '')] = Math.max(0, container.scrollLeft - scrollAmount)
    },

    scrollRight(refName) {
      const container = this.$refs[refName]
      const scrollAmount = 300
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' })
      this.scrollPositions[refName.replace('Scroll', '')] = container.scrollLeft + scrollAmount
    },

    handleMovieClick(movie) {
      this.$router.push({
        name: 'Movies',
        params: { id: movie.id }
      })
    },

    handleTVShowClick(show) {
      // You'll need to create a TV show detail route
      this.$router.push({
        name: 'TVShow',
        params: { id: show.id }
      })
    },

    viewAllMovies(type) {
      // Navigate to a movies page with the specific type
      this.$router.push({
        name: 'Movies',
        query: { type: type }
      })
    },

    viewAllTVShows(type) {
      // Navigate to a TV shows page with the specific type
      this.$router.push({
        name: 'TVShows',
        query: { type: type }
      })
    }
  }
}
</script>

<style scoped>
.discover-page {
  min-height: 100vh;
  background: var(--gothic-black);
  color: var(--text-gothic-primary);
}

.discover-header {
  background: var(--gothic-charcoal);
  border-bottom: 2px solid var(--text-gothic-secondary);
  padding: 3rem 0;
  text-align: center;
}

.container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-title {
  font-size: 3rem;
  font-weight: bold;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  color: var(--text-gothic-secondary);
  font-size: 1.2rem;
}

.discover-section {
  margin: 3rem 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: var(--text-gothic-primary);
}

.view-all-btn {
  background: transparent;
  border: 2px solid var(--text-gothic-accent);
  color: var(--text-gothic-accent);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 500;
}

.view-all-btn:hover {
  background: var(--text-gothic-accent);
  color: white;
  transform: translateY(-2px);
}

.btn-arrow {
  width: 16px;
  height: 16px;
}

.movies-row {
  position: relative;
}

.scroll-container {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem 0;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.scroll-container::-webkit-scrollbar {
  display: none;
}

.movie-card-item {
  flex-shrink: 0;
  width: 200px;
}

.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.8);
  border: none;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scroll-btn:hover:not(:disabled) {
  background: var(--text-gothic-accent);
  transform: translateY(-50%) scale(1.1);
}

.scroll-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.scroll-left {
  left: -25px;
}

.scroll-right {
  right: -25px;
}

.scroll-btn svg {
  width: 20px;
  height: 20px;
}

.loading-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 4rem 0;
  color: var(--text-gothic-secondary);
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(102, 126, 234, 0.3);
  border-top: 3px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* Responsive Design */
@media (max-width: 1024px) {
  .movie-card-item {
    width: 180px;
  }

  .scroll-container {
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .page-title {
    font-size: 2.5rem;
  }

  .section-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .movie-card-item {
    width: 160px;
  }

  .scroll-btn {
    width: 40px;
    height: 40px;
  }

  .scroll-left {
    left: -20px;
  }

  .scroll-right {
    right: -20px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 1rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 1.5rem;
  }

  .movie-card-item {
    width: 140px;
  }

  .discover-section {
    margin: 2rem 0;
  }
}
</style>
