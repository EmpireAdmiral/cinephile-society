<template>
  <Navbar />
  <div class="movie-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span class="loading-text">Loading movie details...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-card">
        <h3 class="error-title">Error Loading Movie</h3>
        <p class="error-message">{{ error }}</p>
        <button @click="$router.go(-1)" class="back-button">
          Go Back
        </button>
      </div>
    </div>

    <!-- Movie Details -->
    <div v-else-if="movie" class="movie-content">
      <!-- Backdrop with overlay -->
      <div class="backdrop-section">
        <div
          v-if="movie.backdrop_path"
          class="backdrop-image"
          :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }"
        ></div>
        <div class="backdrop-overlay"></div>
      </div>

      <!-- Main Content Container -->
      <div class="content-container">
        <div class="movie-header">
          <!-- Poster Section -->
          <div class="poster-section">
            <div class="poster-container">
              <img
                v-if="movie.poster_path"
                :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
                :alt="movie.title"
                class="movie-poster"
              />
              <div v-else class="poster-placeholder">
                <svg class="poster-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button class="btn btn-primary">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add to Watchlist
              </button>
              <button class="btn btn-secondary">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                Mark as Watched
              </button>
              <button class="btn btn-secondary">
                <svg class="btn-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                Add to Favorites
              </button>
            </div>
          </div>

          <!-- Title and Basic Info -->
          <div class="title-section">
            <h1 class="movie-title">{{ movie.title }}</h1>

            <div class="movie-meta">
              <span v-if="movie.release_date" class="meta-item">
                {{ new Date(movie.release_date).getFullYear() }}
              </span>
              <span v-if="movie.runtime" class="meta-item">
                {{ formatRuntime(movie.runtime) }}
              </span>
              <div v-if="movie.vote_average > 0" class="rating-container">
                <div class="rating-stars">
                  <svg v-for="star in 5" :key="star" class="star" :class="{ filled: star <= Math.round(movie.vote_average / 2) }" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <span class="rating-text">{{ movie.vote_average.toFixed(1) }}/10</span>
                <span class="vote-count">({{ formatVoteCount(movie.vote_count) }} votes)</span>
              </div>
            </div>

            <!-- Genres -->
            <div v-if="movie.genres && movie.genres.length > 0" class="genres-container">
              <span v-for="genre in movie.genres" :key="genre.id" class="genre-tag">
                {{ genre.name }}
              </span>
            </div>

            <!-- Tagline -->
            <div v-if="movie.tagline" class="tagline">
              "{{ movie.tagline }}"
            </div>

            <div v-if="movie.overview" class="overview-text">
              {{ movie.overview}}
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="details-grid">
          <!-- Overview Section -->

          <!-- Cast Section -->
          <div v-if="cast.length > 0" class="detail-card cast-card">
            <h3 class="card-title">Cast</h3>
            <div class="cast-grid">
              <div v-for="actor in cast.slice(0, 8)" :key="actor.id" class="cast-member">
                <div class="cast-photo">
                  <img
                    v-if="actor.profile_path"
                    :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`"
                    :alt="actor.name"
                    class="cast-image"
                  />
                  <div v-else class="cast-placeholder">
                    <svg class="cast-icon" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div class="cast-info">
                  <p class="cast-name">{{ actor.name }}</p>
                  <p class="cast-character">{{ actor.character }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Crew Section -->
          <div class="detail-card crew-card">
            <h3 class="card-title">Key Crew</h3>
            <div class="crew-list">
              <div v-if="director" class="crew-item">
                <span class="crew-role">Director:</span>
                <span class="crew-name">{{ director.name }}</span>
              </div>
              <div v-if="writers.length > 0" class="crew-item">
                <span class="crew-role">Writer{{ writers.length > 1 ? 's' : '' }}:</span>
                <span class="crew-name">{{ writers.map(w => w.name).join(', ') }}</span>
              </div>
              <div v-if="producers.length > 0" class="crew-item">
                <span class="crew-role">Producer{{ producers.length > 1 ? 's' : '' }}:</span>
                <span class="crew-name">{{ producers.slice(0, 3).map(p => p.name).join(', ') }}</span>
              </div>
            </div>
          </div>

          <!-- Technical Details -->
          <div class="detail-card technical-card">
            <h3 class="card-title">Technical Details</h3>
            <div class="technical-list">
              <div v-if="movie.release_date" class="technical-item">
                <span class="tech-label">Release Date:</span>
                <span class="tech-value">{{ formatDate(movie.release_date) }}</span>
              </div>
              <div v-if="movie.budget > 0" class="technical-item">
                <span class="tech-label">Budget:</span>
                <span class="tech-value">${{ formatCurrency(movie.budget) }}</span>
              </div>
              <div v-if="movie.revenue > 0" class="technical-item">
                <span class="tech-label">Revenue:</span>
                <span class="tech-value">${{ formatCurrency(movie.revenue) }}</span>
              </div>
              <div v-if="movie.spoken_languages && movie.spoken_languages.length > 0" class="technical-item">
                <span class="tech-label">Languages:</span>
                <span class="tech-value">{{ movie.spoken_languages.map(l => l.english_name).join(', ') }}</span>
              </div>
              <div v-if="movie.production_companies && movie.production_companies.length > 0" class="technical-item">
                <span class="tech-label">Production:</span>
                <span class="tech-value">{{ movie.production_companies.slice(0, 2).map(c => c.name).join(', ') }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tmdbService } from '@/services/tmdb'
import Navbar from '@/components/Navbar.vue'
export default {
  name: 'MovieDetail',
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      movie: null,
      loading: true,
      error: null
    }
  },
  computed: {
    director() {
      if (!this.movie || !this.movie.credits) return null;
      return this.movie.credits.crew.find(person => person.job === 'Director') || null;
    },
    writers() {
      if (!this.movie || !this.movie.credits) return [];
      return this.movie.credits.crew.filter(person =>
        person.job === 'Writer' ||
        person.job === 'Screenplay' ||
        person.job === 'Story'
      );
    },
    producers() {
      if (!this.movie || !this.movie.credits) return [];
      return this.movie.credits.crew.filter(person =>
        person.job === 'Producer' ||
        person.job === 'Executive Producer'
      );
    },
    cast() {
      if (!this.movie || !this.movie.credits) return [];
      return this.movie.credits.cast || [];
    },
  },
  watch: {
    // Watch for changes to the id prop and re-fetch data
    id(newId) {
      if (newId) {
        this.fetchMovieDetails();
      }
    }
  },
  async mounted() {
    await this.fetchMovieDetails();
  },
  methods: {
    async fetchMovieDetails() {
      try {
        const movieData = await tmdbService.getCompleteMovieDetails(this.id);
        this.movie = movieData;
      } catch (err) {
        this.error = err.message || 'An error occurred while loading movie details';
        console.error('Movie detail error:', err);
      } finally {
        this.loading = false;
      }
    },

    formatRuntime(minutes) {
      if (!minutes) return '';
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    formatCurrency(amount) {
      return new Intl.NumberFormat('en-US').format(amount);
    },

    formatVoteCount(count) {
      if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
      } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
      }
      return count.toString();
    }
  }
}
</script>

<style scoped>
.movie-detail-page {
  min-height: 100vh;
  background: var(--gothic-black);
  color: var(--text-gothic-primary);
}

.loading-container, .error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  flex-direction: column;
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
  margin-top: 1rem;
  color: var(--text-gothic-primary);
  font-size: 1.1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-card {
  background: rgba(139, 69, 19, 0.1);
  border: 2px solid #8b4513;
  border-radius: 15px;
  padding: 2rem;
  text-align: center;
  max-width: 500px;
}

.error-title {
  color: #cd853f;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.error-message {
  color: var(--text-gothic-primary);
  margin-bottom: 1.5rem;
}

.back-button {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.back-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.movie-content {
  position: relative;
}

.backdrop-section {
  position: relative;
  height: 600px;
  overflow: hidden;
}

.backdrop-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  opacity: 0.3;
}

.backdrop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.content-container {
  position: relative;
  max-width: 1500px;
  margin: 0 auto;
  padding: 0 2rem;
  margin-top: -500px;
  z-index: 10;
}

.movie-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
}

.poster-section {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.poster-container {
  width: 300px;
  aspect-ratio: calc(2 / 3);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  margin-bottom: 1.5rem;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.poster-placeholder {
  width: 100%;
  height: 100%;
  background: var(--gothic-charcoal);
  display: flex;
  align-items: center;
  justify-content: center;
}

.poster-icon {
  width: 80px;
  height: 80px;
  color: var(--text-gothic-secondary);
}

.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  width: 100%;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
}

.btn-icon {
  width: 18px;
  height: 18px;
}

.btn-primary {
  background: linear-gradient(45deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
}

.btn-secondary {
  background: var(--gothic-charcoal);
  color: var(--text-gothic-primary);
  border: 2px solid var(--text-gothic-secondary);
}

.btn-secondary:hover {
  background: var(--text-gothic-secondary);
  color: var(--gothic-black);
  transform: translateY(-2px);
}

.title-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
  margin-top: -500px;
  margin-left: -10rem;
}

.movie-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--text-gothic-primary);
}

.movie-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 1.1rem;
  color: var(--text-gothic-secondary);
  font-weight: 500;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.star {
  width: 18px;
  height: 18px;
  color: var(--text-gothic-secondary);
}

.star.filled {
  color: #ffd700;
}

.rating-text {
  font-weight: 600;
  color: var(--text-gothic-primary);
}

.vote-count {
  font-size: 0.9rem;
  color: var(--text-gothic-secondary);
}

.genres-container {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.genre-tag {
  background: var(--gothic-amethyst);
  color: var(--text-gothic-primary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.9;
}

.tagline {
  font-size: 1.2rem;
  font-style: italic;
  color: var(--text-gothic-accent);
  text-align: center;
  overflow: hidden;
}

.overview-text {
  font-size: 1rem;
  color: var(--text-gothic-primary);
  text-align: center;
  overflow: hidden;
  max-width: 800px;
  padding: 0 1rem;
  margin: 1rem auto 0;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.detail-card {
  background: var(--gothic-charcoal);
  border: 2px solid var(--text-gothic-secondary);
  border-radius: 15px;
  padding: 1.5rem;
}

.card-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--text-gothic-accent);
  border-bottom: 2px solid rgba(102, 126, 234, 0.3);
  padding-bottom: 0.5rem;
}


.cast-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.cast-member {
  text-align: center;
}

.cast-photo {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 0.75rem;
}

.cast-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cast-placeholder {
  width: 100%;
  height: 100%;
  background: var(--gothic-black);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cast-icon {
  width: 30px;
  height: 30px;
  color: var(--text-gothic-secondary);
}

.cast-name {
  font-weight: 600;
  color: var(--text-gothic-primary);
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.cast-character {
  color: var(--text-gothic-secondary);
  font-size: 0.8rem;
}

.crew-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.crew-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.crew-role {
  font-weight: 600;
  color: var(--text-gothic-accent);
  font-size: 0.9rem;
}

.crew-name {
  color: var(--text-gothic-primary);
}

.technical-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.technical-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.tech-label {
  font-weight: 600;
  color: var(--text-gothic-accent);
  font-size: 0.9rem;
}

.tech-value {
  color: var(--text-gothic-primary);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .movie-header {
    grid-template-columns: 250px 1fr;
    gap: 2rem;
  }

  .poster-container {
    width: 250px;
    height: 375px;
  }

  .movie-title {
    font-size: 2.5rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .content-container {
    padding: 0 1rem;
    margin-top: -150px;
  }

  .movie-header {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    text-align: center;
  }

  .poster-section {
    order: -1;
  }

  .poster-container {
    width: 200px;
    height: 300px;
  }

  .movie-title {
    font-size: 2rem;
  }

  .movie-meta {
    flex-direction: column;
    gap: 1rem;
  }

  .genres-container {
    justify-content: center;
  }

  .cast-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .details-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .backdrop-section {
    height: 250px;
  }

  .content-container {
    margin-top: -100px;
  }

  .movie-title {
    font-size: 1.8rem;
  }

  .poster-container {
    width: 180px;
    height: 270px;
  }

  .detail-card {
    padding: 1rem;
  }

  .cast-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
