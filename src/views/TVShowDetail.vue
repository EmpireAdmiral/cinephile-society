<template>
  <Navbar />
  <div class="tvshow-detail-page">
    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span class="loading-text">Loading TV show details...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-card">
        <h3 class="error-title">Error Loading TV Show</h3>
        <p class="error-message">{{ error }}</p>
        <button @click="$router.go(-1)" class="back-button">Go Back</button>
      </div>
    </div>

    <!-- TV Show Details -->
    <div v-else-if="tvShow" class="tvshow-content">
      <!-- Backdrop with overlay -->
      <div class="backdrop-section">
        <div
          v-if="tvShow.backdrop_path"
          class="backdrop-image"
          :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${tvShow.backdrop_path})` }"
        ></div>
        <div class="backdrop-overlay"></div>
      </div>

      <!-- Main Content Container -->
      <div class="content-container">
        <div class="tvshow-header">
          <!-- Poster Section -->
          <div class="poster-section">
            <div class="poster-container">
              <img
                v-if="tvShow.poster_path"
                :src="`https://image.tmdb.org/t/p/w500${tvShow.poster_path}`"
                :alt="tvShow.name"
                class="tvshow-poster"
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
            <h1 class="tvshow-title">{{ tvShow.name }}</h1>

            <div class="tvshow-meta">
              <span v-if="tvShow.first_air_date" class="meta-item">
                {{ new Date(tvShow.first_air_date).getFullYear() }}{{ tvShow.status === 'Ended' && tvShow.last_air_date ? ` - ${new Date(tvShow.last_air_date).getFullYear()}` : ' - Present' }}
              </span>
              <span v-if="tvShow.number_of_seasons" class="meta-item">
                {{ tvShow.number_of_seasons }} Season{{ tvShow.number_of_seasons > 1 ? 's' : '' }}
              </span>
              <span v-if="tvShow.episode_run_time && tvShow.episode_run_time.length > 0" class="meta-item">
                {{ tvShow.episode_run_time[0] }}min
              </span>
              <div v-if="tvShow.vote_average > 0" class="rating-container">
                <svg class="single-star" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span class="rating-text">{{ tvShow.vote_average.toFixed(1) }}<span class="rating-scale">/10</span></span>
                <span class="vote-count">({{ formatVoteCount(tvShow.vote_count) }} votes)</span>
              </div>
            </div>

            <!-- Genres -->
            <div v-if="tvShow.genres && tvShow.genres.length > 0" class="genres-container">
              <span v-for="genre in tvShow.genres" :key="genre.id" class="genre-tag">
                {{ genre.name }}
              </span>
            </div>

            <!-- Tagline -->
            <div v-if="tvShow.tagline" class="tagline">
              "{{ tvShow.tagline }}"
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="details-grid">
          <!-- Overview Section -->
          <div class="detail-card overview-card">
            <h3 class="card-title">Overview</h3>
            <p class="overview-text">{{ tvShow.overview || 'No overview available.' }}</p>
          </div>

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
              <div v-if="creators.length > 0" class="crew-item">
                <span class="crew-role">Creator{{ creators.length > 1 ? 's' : '' }}:</span>
                <span class="crew-name">{{ creators.map(c => c.name).join(', ') }}</span>
              </div>
              <div v-if="producers.length > 0" class="crew-item">
                <span class="crew-role">Executive Producer{{ producers.length > 1 ? 's' : '' }}:</span>
                <span class="crew-name">{{ producers.slice(0, 3).map(p => p.name).join(', ') }}</span>
              </div>
            </div>
          </div>

          <!-- Technical Details -->
          <div class="detail-card technical-card">
            <h3 class="card-title">Technical Details</h3>
            <div class="technical-list">
              <div v-if="tvShow.first_air_date" class="technical-item">
                <span class="tech-label">First Air Date:</span>
                <span class="tech-value">{{ formatDate(tvShow.first_air_date) }}</span>
              </div>
              <div v-if="tvShow.status" class="technical-item">
                <span class="tech-label">Status:</span>
                <span class="tech-value">{{ tvShow.status }}</span>
              </div>
              <div v-if="tvShow.number_of_episodes" class="technical-item">
                <span class="tech-label">Total Episodes:</span>
                <span class="tech-value">{{ tvShow.number_of_episodes }}</span>
              </div>
              <div v-if="tvShow.networks && tvShow.networks.length > 0" class="technical-item">
                <span class="tech-label">Network:</span>
                <span class="tech-value">{{ tvShow.networks.map(n => n.name).join(', ') }}</span>
              </div>
              <div v-if="tvShow.production_companies && tvShow.production_companies.length > 0" class="technical-item">
                <span class="tech-label">Production:</span>
                <span class="tech-value">{{ tvShow.production_companies.slice(0, 2).map(c => c.name).join(', ') }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Seasons Section -->
        <div v-if="tvShow.seasons && tvShow.seasons.length > 0" class="seasons-section">
          <h2 class="section-title">Seasons</h2>

          <div class="seasons-list">
            <div
              v-for="season in tvShow.seasons.filter(s => s.season_number > 0)"
              :key="season.id"
              class="season-card"
              @click="toggleSeason(season.season_number)"
            >
              <div class="season-header">
                <img
                  v-if="season.poster_path"
                  :src="`https://image.tmdb.org/t/p/w185${season.poster_path}`"
                  :alt="season.name"
                  class="season-poster"
                />
                <div v-else class="season-poster-placeholder">
                  <svg class="season-icon" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                  </svg>
                </div>

                <div class="season-info">
                  <h3 class="season-title">{{ season.name }}</h3>
                  <p class="season-meta">
                    {{ season.episode_count }} Episodes
                    <span v-if="season.air_date"> • {{ new Date(season.air_date).getFullYear() }}</span>
                  </p>
                  <p v-if="season.overview" class="season-overview">{{ season.overview }}</p>
                </div>

                <button class="expand-btn" :class="{ expanded: expandedSeasons.includes(season.season_number) }">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
              </div>

              <!-- Episodes List -->
              <div v-if="expandedSeasons.includes(season.season_number)" class="episodes-container">
                <div v-if="loadingSeasons.includes(season.season_number)" class="episodes-loading">
                  <div class="loading-spinner-small"></div>
                  <span>Loading episodes...</span>
                </div>

                <div v-else-if="seasonEpisodes[season.season_number]" class="episodes-list">
                  <div
                    v-for="episode in seasonEpisodes[season.season_number]"
                    :key="episode.id"
                    class="episode-item"
                  >
                    <img
                      v-if="episode.still_path"
                      :src="`https://image.tmdb.org/t/p/w300${episode.still_path}`"
                      :alt="episode.name"
                      class="episode-thumbnail"
                    />
                    <div v-else class="episode-thumbnail-placeholder">
                      <svg fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                      </svg>
                    </div>

                    <div class="episode-details">
                      <div class="episode-header">
                        <h4 class="episode-title">
                          {{ episode.episode_number }}. {{ episode.name }}
                        </h4>
                        <span v-if="episode.runtime" class="episode-runtime">{{ episode.runtime }}min</span>
                      </div>
                      <p v-if="episode.air_date" class="episode-date">
                        {{ formatDate(episode.air_date) }}
                      </p>
                      <p v-if="episode.overview" class="episode-overview">{{ episode.overview }}</p>
                      <div v-if="episode.vote_average > 0" class="episode-rating">
                        <svg class="star-small" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {{ episode.vote_average.toFixed(1) }}
                      </div>
                    </div>
                  </div>
                </div>
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
  name: 'TVShowDetail',
  components: { Navbar },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tvShow: null,
      loading: true,
      error: null,
      expandedSeasons: [],
      seasonEpisodes: {},
      loadingSeasons: []
    }
  },
  computed: {
    creators() {
      if (!this.tvShow || !this.tvShow.created_by) return [];
      return this.tvShow.created_by;
    },
    producers() {
      if (!this.tvShow || !this.tvShow.credits) return [];
      return this.tvShow.credits.crew.filter(person =>
        person.job === 'Producer' ||
        person.job === 'Executive Producer'
      );
    },
    cast() {
      if (!this.tvShow || !this.tvShow.credits) return [];
      return this.tvShow.credits.cast || [];
    }
  },
  async mounted() {
    await this.fetchTVShowDetails();
  },
  methods: {
    async fetchTVShowDetails() {
      try {
        const tvData = await tmdbService.getCompleteTVShowDetails(this.id);
        this.tvShow = tvData;
      } catch (err) {
        this.error = err.message || 'An error occurred while loading TV show details';
        console.error('TV show detail error:', err);
      } finally {
        this.loading = false;
      }
    },

    async toggleSeason(seasonNumber) {
      const index = this.expandedSeasons.indexOf(seasonNumber);

      if (index > -1) {
        this.expandedSeasons.splice(index, 1);
      } else {
        this.expandedSeasons.push(seasonNumber);

        if (!this.seasonEpisodes[seasonNumber]) {
          await this.loadSeasonEpisodes(seasonNumber);
        }
      }
    },

    async loadSeasonEpisodes(seasonNumber) {
      this.loadingSeasons.push(seasonNumber);

      try {
        const seasonData = await tmdbService.getTVSeasonDetails(this.id, seasonNumber);
        this.seasonEpisodes[seasonNumber] = seasonData.episodes || [];
      } catch (error) {
        console.error(`Error loading season ${seasonNumber}:`, error);
      } finally {
        const index = this.loadingSeasons.indexOf(seasonNumber);
        if (index > -1) {
          this.loadingSeasons.splice(index, 1);
        }
      }
    },

    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
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
/* Base styles - similar to MovieDetail */
.tvshow-detail-page {
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

.tvshow-content {
  position: relative;
}

.backdrop-section {
  position: relative;
  height: 400px;
  overflow: hidden;
}

.backdrop-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center;
  filter: blur(2px);
  opacity: 0.3;
}

.backdrop-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, transparent 0%, var(--gothic-black) 100%);
}

.content-container {
  position: relative;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  margin-top: -200px;
  z-index: 10;
}

.tvshow-header {
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
  height: 450px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
  margin-bottom: 1.5rem;
}

.tvshow-poster {
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
}

.tvshow-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  background-clip: text;
}

.tvshow-meta {
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

.single-star {
  width: 14px;
  height: 14px;
  color: #ffd700;
}

.rating-text {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-gothic-primary);
}

.rating-scale {
  font-size: 0.7rem;
  font-weight: normal;
  color: var
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
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
}

.tagline {
  font-size: 1.2rem;
  font-style: italic;
  color: var(--text-gothic-accent);
  text-align: center;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
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

.overview-card {
  grid-column: 1 / -1;
}

.overview-text {
  line-height: 1.7;
  color: var(--text-gothic-primary);
  font-size: 1.1rem;
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

/* Seasons Section */
.seasons-section {
  margin-top: 3rem;
}

.section-title {
  font-size: 2rem;
  font-weight: bold;
  color: var(--text-gothic-accent);
  margin-bottom: 2rem;
  text-align: center;
}

.seasons-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.season-card {
  background: var(--gothic-charcoal);
  border: 2px solid var(--text-gothic-secondary);
  border-radius: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.season-card:hover {
  border-color: var(--text-gothic-accent);
}

.season-header {
  display: grid;
  grid-template-columns: 120px 1fr auto;
  gap: 1.5rem;
  padding: 1.5rem;
  cursor: pointer;
  align-items: center;
}

.season-poster {
  width: 120px;
  height: 180px;
  object-fit: cover;
  border-radius: 10px;
}

.season-poster-placeholder {
  width: 120px;
  height: 180px;
  background: var(--gothic-black);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.season-icon {
  width: 40px;
  height: 40px;
  color: var(--text-gothic-secondary);
}

.season-info {
  flex: 1;
}

.season-title {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--text-gothic-primary);
  margin-bottom: 0.5rem;
}

.season-meta {
  color: var(--text-gothic-secondary);
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
}

.season-overview {
  color: var(--text-gothic-primary);
  line-height: 1.5;
  font-size: 0.95rem;
}

.expand-btn {
  background: none;
  border: none;
  color: var(--text-gothic-accent);
  cursor: pointer;
  padding: 0.5rem;
  transition: transform 0.3s ease;
}

.expand-btn svg {
  width: 24px;
  height: 24px;
}

.expand-btn.expanded {
  transform: rotate(180deg);
}

.episodes-container {
  border-top: 2px solid var(--text-gothic-secondary);
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.2);
}

.episodes-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: var(--text-gothic-secondary);
}

.loading-spinner-small {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(102, 126, 234, 0.3);
  border-top: 2px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.episodes-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.episode-item {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 1.5rem;
  padding: 1rem;
  background: var(--gothic-charcoal);
  border-radius: 10px;
  transition: all 0.3s ease;
}

.episode-item:hover {
  background: rgba(102, 126, 234, 0.1);
}

.episode-thumbnail {
  width: 200px;
  height: 112px;
  object-fit: cover;
  border-radius: 8px;
}

.episode-thumbnail-placeholder {
  width: 200px;
  height: 112px;
  background: var(--gothic-black);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.episode-thumbnail-placeholder svg {
  width: 40px;
  height: 40px;
  color: var(--text-gothic-secondary);
}

.episode-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.episode-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.episode-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-gothic-primary);
  flex: 1;
}

.episode-runtime {
  color: var(--text-gothic-secondary);
  font-size: 0.9rem;
  white-space: nowrap;
}

.episode-date {
  color: var(--text-gothic-secondary);
  font-size: 0.85rem;
}

.episode-overview {
  color: var(--text-gothic-primary);
  line-height: 1.5;
  font-size: 0.95rem;
}

.episode-rating {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-gothic-secondary);
  font-size: 0.9rem;
}

.star-small {
  width: 12px;
  height: 12px;
  color: #ffd700;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .tvshow-header {
    grid-template-columns: 250px 1fr;
    gap: 2rem;
  }

  .poster-container {
    width: 250px;
    height: 375px;
  }

  .tvshow-title {
    font-size: 2.5rem;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .season-header {
    grid-template-columns: 100px 1fr auto;
    gap: 1rem;
  }

  .season-poster, .season-poster-placeholder {
    width: 100px;
    height: 150px;
  }

  .episode-item {
    grid-template-columns: 150px 1fr;
    gap: 1rem;
  }

  .episode-thumbnail, .episode-thumbnail-placeholder {
    width: 150px;
    height: 84px;
  }
}

@media (max-width: 768px) {
  .content-container {
    padding: 0 1rem;
    margin-top: -150px;
  }

  .tvshow-header {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .poster-section {
    order: -1;
  }

  .poster-container {
    width: 200px;
    height: 300px;
  }

  .tvshow-title {
    font-size: 2rem;
  }

  .tvshow-meta {
    flex-direction: column;
    gap: 1rem;
  }

  .cast-grid {
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  }

  .season-header {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .season-poster, .season-poster-placeholder {
    margin: 0 auto;
  }

  .expand-btn {
    margin: 0 auto;
  }

  .episode-item {
    grid-template-columns: 1fr;
  }

  .episode-thumbnail, .episode-thumbnail-placeholder {
    width: 100%;
    height: auto;
    aspect-ratio: 16/9;
  }
}

@media (max-width: 480px) {
  .backdrop-section {
    height: 250px;
  }

  .content-container {
    margin-top: -100px;
  }

  .tvshow-title {
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

  .episode-item {
    padding: 0.75rem;
  }
}
</style>
