<template>
  <Navbar />
  <div class="tv-detail-page">

    <!-- Loading State -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <span class="loading-text">Loading show details...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-container">
      <div class="error-card">
        <h3 class="error-title">Error Loading Show</h3>
        <p class="error-message">{{ error }}</p>
        <button @click="$router.go(-1)" class="back-button">
          Go Back
        </button>
      </div>
    </div>

    <!-- Show Details -->
    <div v-else-if="show" class="show-content">
      <!-- Backdrop with overlay -->
      <div class="backdrop-section">
        <div v-if="show.backdrop_path" class="backdrop-image"
          :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${show.backdrop_path})` }"></div>
        <div class="backdrop-overlay"></div>
      </div>

      <!-- Main Content Container -->
      <div class="content-container">
        <div class="show-header">
          <!-- Poster Section -->
          <div class="poster-section">
            <div class="poster-container">
              <img v-if="show.poster_path" :src="`https://image.tmdb.org/t/p/w500${show.poster_path}`" :alt="show.name"
                class="show-poster" />
              <div v-else class="poster-placeholder">
                <svg class="poster-icon" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd"
                    d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                    clip-rule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Title and Basic Info -->
          <div class="title-section">
            <div class="title-and-creator">
              <h1 class="show-title">{{ show.name }}</h1>
              <span v-for="creator in getCreators" :key="creator.id" class="creator-name">
                Created by: {{ creator.name }}
              </span>
            </div>
            <div class="show-meta">
              <span v-if="show.first_air_date" class="meta-item">
                {{ new Date(show.first_air_date).getFullYear() }}{{ show.last_air_date && !show.in_production ? ' - ' +
                new Date(show.last_air_date).getFullYear() : '' }}
              </span>
              <span v-if="show.number_of_seasons" class="meta-item">
                {{ show.number_of_seasons }} {{ show.number_of_seasons === 1 ? 'Season' : 'Seasons' }}
              </span>
              <span v-if="show.number_of_episodes" class="meta-item">
                {{ show.number_of_episodes }} Episodes
              </span>

              <!-- User Score Donut -->
              <div v-if="show.vote_average > 0" class="donut-container">
                <span class="user-score">User score</span>
                <vc-donut :background="'#1a1a1a'" :sections="sections" :size="100" :unit="px" :thickness="40"
                  :animation="true" :auto-adjust-text-size :suppress-validation-warnings="false">
                  <h1> {{ show.vote_average.toFixed(1) }}</h1>
                </vc-donut>
                <span class="vote-count">({{ formatVoteCount(show.vote_count) }} votes)</span>
              </div>
            </div>

            <!-- Genres -->
            <div v-if="show.genres && show.genres.length > 0" class="genres-container">
              <span v-for="genre in show.genres" :key="genre.id" class="genre-tag">
                {{ genre.name }}
              </span>
            </div>

            <!-- Status -->
            <div class="status-info">
              <span class="status-badge" :class="show.in_production ? 'status-active' : 'status-ended'">
                {{ show.in_production ? 'Ongoing' : 'Ended' }}
              </span>
              <span v-if="show.last_air_date" class="last-aired">
                Last aired: {{ formatDate(show.last_air_date) }}
              </span>
            </div>

            <!-- Overview -->
            <div v-if="show.overview" class="overview-text">
              {{ show.overview }}
            </div>

            <!-- Action Buttons -->
            <div class="action-buttons">
              <button class="btn btn-secondary">
                <font-awesome-icon icon="plus" />
                Add to Watchlist
              </button>
              <button class="btn btn-secondary">
                <font-awesome-icon icon="check" />
                Mark as Watched
              </button>
              <button class="btn btn-secondary">
                <font-awesome-icon icon="heart" />
                Add to Favorites
              </button>
              <button class="btn btn-secondary">
                <font-awesome-icon icon="star" />
                Rate this show
              </button>
            </div>
          </div>
        </div>

        <!-- Details Grid -->
        <div class="details-grid">
          <!-- Cast Section -->
          <div v-if="cast.length > 0" class="detail-card cast-card">
            <h3 class="card-title">Cast</h3>
            <div class="cast-grid">
              <div v-for="actor in displayedCast" :key="actor.id" class="cast-member">
                <div class="cast-photo">
                  <img v-if="actor.profile_path" :src="`https://image.tmdb.org/t/p/w185${actor.profile_path}`"
                    :alt="actor.name" class="cast-image" />
                  <div v-else class="cast-placeholder">
                    <font-awesome-icon icon="user" style="width: 75px; height: 75px;" />
                  </div>
                </div>
                <div class="cast-info">
                  <p class="cast-name">{{ actor.name }}</p>
                  <p class="cast-character">{{ actor.roles[0].character }}</p>
                  <p class="cast-number-of-episodes">{{ actor.total_episode_count }} episodes</p>
                </div>
              </div>
            </div>
            <button v-if="cast.length > 10" @click="toggleCastExpanded" class="show-more-btn">
              {{ showAllCast ? 'Show Less' : `Show All ${cast.length} Cast Members` }}
            </button>
          </div>

          <!-- Crew Section -->
          <div class="detail-card crew-card">
            <h3 class="card-title">Key Crew</h3>
            <div class="crew-grid">
              <div v-for="member in displayedCrew" :key="`${member.id}-${job}`" class="crew-member">
                <div class="crew-photo">
                  <img v-if="member.profile_path" :src="`https://image.tmdb.org/t/p/w185${member.profile_path}`"
                    :alt="member.name" class="crew-image" />
                  <div v-else class="crew-placeholder">
                    <font-awesome-icon icon="user" style="width: 75px; height: 75px;" />
                  </div>
                </div>

                <div class="crew-info">
                  <p class="crew-name">{{ member.name }}</p>
                  <p class="crew-job-title">{{ member.jobs[0].job }}</p>
                  <p class="crew-number-of-episodes" v-if="member.total_episode_count">{{ member.total_episode_count }} episodes</p>
                </div>
              </div>
            </div>
            <button v-if="crew.length > 10" @click="toggleCrewExpanded" class="show-more-btn">
              {{ showAllCrew ? 'Show Less' : `Show All ${crew.length} Crew Members` }}
            </button>
          </div>
        </div>

        <!-- Seasons Section -->
        <div class="seasons-section" v-if="show && show.seasons && show.seasons.length">
          <div v-for="season in show.seasons" :key="season.id" class="season-card">
            <div class="season-header" @click="toggleSeason(season.id)">
              <h3 class="season-title">{{ season.name }}</h3>
              <img v-if="season.poster_path" class="season-poster" :src="getImageUrl(season.poster_path)"
                :alt="season.name" />
            </div>

            <transition name="expand">
              <div v-if="expandedSeasons.includes(season.id)" class="season-details">
                <p class="season-overview" v-if="season.overview">
                  {{ season.overview }}
                </p>

                <ul v-if="season.episodes && season.episodes.length" class="episode-list">
                  <li v-for="ep in season.episodes" :key="ep.id" class="episode-item">
                    <span class="episode-title">{{ ep.episode_number }}. {{ ep.name }}</span>
                    <span v-if="ep.runtime" class="episode-runtime">{{ ep.runtime }} min</span>
                  </li>
                </ul>
              </div>
            </transition>
          </div>
        </div>

        <!-- Recommendations Section -->
        <div v-if="allRecommendations.length > 0" class="recommendations-section">
          <h2 class="section-title">You May Also Like</h2>
          <div class="recommendations-scroll">
            <button class="scroll-btn scroll-left" @click="prevRecommendations" v-show="canScrollLeft">
              <font-awesome-icon icon="chevron-left" />
            </button>

            <div class="recommendations-container" ref="recommendationsContainer">
              <TVShowsCard v-for="rec in visibleRecommendations" :key="rec.id" :show="rec" :show-placeholder="false"
                @click="handleRecommendationClick" class="recommendation-card" />
            </div>

            <button class="scroll-btn scroll-right" @click="nextRecommendations" v-show="canScrollRight">
              <font-awesome-icon icon="chevron-right" />
            </button>
          </div>

          <div v-if="loadingRecommendations" class="recommendations-loading">
            <div class="loading-spinner-small"></div>
            <span>Loading recommendations...</span>
          </div>
        </div>

        <!-- Reviews Section -->
        <div v-if="reviews.length > 0" class="reviews-section">
          <h2 class="section-title">Reviews</h2>
          <div class="reviews-list">
            <div v-for="review in displayedReviews" :key="review.id" class="review-card">
              <div class="review-header">
                <div class="review-author">
                  <div class="author-avatar">
                    <img v-if="review.author_details?.avatar_path"
                      :src="getAvatarUrl(review.author_details.avatar_path)" :alt="review.author"
                      class="avatar-image" />
                    <div v-else class="avatar-placeholder">
                      {{ review.author.charAt(0).toUpperCase() }}
                    </div>
                  </div>
                  <div class="author-info">
                    <p class="author-name">{{ review.author }}</p>
                    <p class="review-date">{{ formatReviewDate(review.created_at) }}</p>
                  </div>
                </div>
                <div v-if="review.author_details?.rating" class="review-rating">
                  <font-awesome-icon icon="star" style="color: #d4af37;" />
                  <span class="rating-value">{{ review.author_details.rating }}/10</span>
                </div>
              </div>

              <div class="review-content">
                <p :class="['review-text', { expanded: expandedReviews.includes(review.id) }]">
                  {{ review.content }}
                </p>
                <button v-if="review.content.length > 400" @click="toggleReview(review.id)" class="read-more-btn">
                  {{ expandedReviews.includes(review.id) ? 'Read Less' : 'Read More' }}
                </button>
              </div>
            </div>
          </div>
          <button v-if="reviews.length > 3" @click="toggleReviewsExpanded" class="show-more-btn">
            {{ showAllReviews ? 'Show Less' : `Show All ${reviews.length} Reviews` }}
          </button>
          <div v-if="loadingReviews" class="reviews-loading">
            <div class="loading-spinner-small"></div>
            <span>Loading reviews...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tmdbService } from '@/services/tmdb'
import Navbar from '@/components/Navbar.vue'
import { VcDonut } from 'vue-css-donut-chart';
export default {
  name: 'TVShowDetail',
  components: {
    VcDonut
  },
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      show: null,
      loading: true,
      error: null,
      allRecommendations: [],
      loadingRecommendations: false,
      recommendationsPage: 0,
      pageSize: 7,
      showAllCast: false,
      showAllCrew: false,
      showOtherCrew: false,
      expandedSeasons: [],
      loadingSeasons: [],
      seasonEpisodes: {},
      reviews: [],
      loadingReviews: false,
      showAllReviews: false,
      expandedReviews: []
    }
  },
  computed: {
    sections() {
      const percentage = (this.show.vote_average / 10) * 100;
      return [
        {
          value: percentage,
          color: '#d4af37'
        },
        {
          value: 100 - percentage,
          color: '#4a4a4a'
        }
      ];
    },
    cast() {
      if (!this.show || !this.show.credits) return [];
      return this.show.credits.cast || [];
    },
    crew() {
      if (!this.show || !this.show.credits) return [];
      return this.show.credits.crew || [];
    },
    getCreators() {
      if (!this.show || !this.show.created_by) return [];
      return this.show.created_by;
    },
    displayedCast() {
      return this.showAllCast ? this.cast : this.cast.slice(0, 10);
    },
    displayedCrew() {
       if (!this.show.credits.crew) return []
       return this.showAllCrew ? [...this.show.credits.crew].sort((a, b) => (b.total_episode_count || 0) - (a.total_episode_count || 0)) : [...this.show.credits.crew].sort((a, b) => (b.total_episode_count || 0) - (a.total_episode_count || 0)).slice(0, 10)
    },
    displayedSeasons() {
      return this.showAllSeasons ? this.show.seasons : this.show.seasons;
    },
    displayedReviews() {
      return this.showAllReviews ? this.reviews : this.reviews.slice(0, 3);
    },
    visibleRecommendations() {
      const arr = this.allRecommendations || [];
      const start = this.recommendationsPage * this.pageSize;
      return arr.slice(start, start + this.pageSize);
    },
    canScrollLeft() {
      return this.recommendationsPage > 0;
    },
    canScrollRight() {
      return (this.recommendationsPage + 1) * this.pageSize < this.allRecommendations.length;
    }
  },

  watch: {
    id(newId) {
      if (newId) {
        this.resetState();
        this.fetchShowDetails();
        this.fetchRecommendations();
        this.fetchReviews();
      }
    }
  },
  async mounted() {
    await this.fetchShowDetails();
    await this.fetchRecommendations();
    await this.fetchReviews();
  },
  methods: {
    resetState() {
      this.showAllCast = false;
      this.showAllCrew = false;
      this.showAllSeasons = false;
      this.loading = true;
      this.error = null;
      this.seasonEpisodes = {};
      this.loadingSeasons = [];
      this.expandedSeasons = [];
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async fetchShowDetails() {
      try {
        const showData = await tmdbService.getCompleteTVShowDetails(this.id);
        this.show = showData;
        console.log(this.show);
        const season1 = this.show.seasons?.find(s => s.season_number === 1)
        if (season1) {
          this.expandedSeasons = [season1.id]
          this.fetchSeasonEpisodes(season1);
        }
        console.log('Fetched show details:', this.show);
      } catch (err) {
        this.error = err.message || 'An error occurred while loading show details';
        console.error('Show detail error:', err);
      } finally {
        this.loading = false;
      }
    },
    async fetchRecommendations() {
      this.loadingRecommendations = true;
      try {
        const data = await tmdbService.getTvShowRecommendations(this.id);
        this.allRecommendations = data.results;
        this.recommendationsPage = 0;
        console.log('Recommendations set to:', this.allRecommendations);
      } catch (error) {
        console.error('Error loading recommendations:', error);
        this.allRecommendations = [];
      } finally {
        this.loadingRecommendations = false;
      }
    },

    async fetchReviews() {
      this.loadingReviews = true;
      try {
        const data = await tmdbService.getTvShowsReviews(this.id);
        this.reviews = data.results || [];
      } catch (error) {
        console.error('Error loading reviews:', error);
        this.reviews = [];
      } finally {
        this.loadingReviews = false;
      }
    },

    async fetchSeasonEpisodes(seasonNumber) {
      if (!this.loadingSeasons.includes(seasonNumber)) {
        this.loadingSeasons.push(seasonNumber);
      }

      try {
        const data = await tmdbService.getTVSeasonDetails(this.id, seasonNumber);
        this.seasonEpisodes[seasonNumber] = data.episodes
      } catch (error) {
        console.error(`Error loading episodes for season ${seasonNumber}:`, error);
      } finally {
        const index = this.loadingSeasons.indexOf(seasonNumber);
        if (index > -1) {
          this.loadingSeasons.splice(index, 1);
        }
      }
    },

    async fetchEpisodeDetails(seasonNumber, episodeNumber) {
      try {
        const data = await tmdbService.getTVSeasonEpisodeDetails(this.id, seasonNumber, episodeNumber);
        season.episodes = data.episodes || []
        console.log(season.episodes);
        return data;
      } catch (error) {
        console.error(`Error loading details for S${seasonNumber}E${episodeNumber}:`, error);
        return null;
      }
    },

    async toggleSeasonEpisodes(seasonNumber) {
      const index = this.expandedSeasons.indexOf(seasonNumber);
      if (index > -1) {
        // Collapse
        this.expandedSeasons.splice(index, 1);
      } else {
        // Expand
        this.expandedSeasons.push(seasonNumber);
        // Fetch episodes if not already loaded
        if (!this.seasonEpisodes[seasonNumber]) {
          await this.fetchSeasonEpisodes(seasonNumber);
        }
      }
    },

    toggleReviewsExpanded() {
      this.showAllReviews = !this.showAllReviews;
    },

    toggleReview(reviewId) {
      const index = this.expandedReviews.indexOf(reviewId);
      if (index > -1) {
        this.expandedReviews.splice(index, 1);
      } else {
        this.expandedReviews.push(reviewId);
      }
    },

    getAvatarUrl(avatarPath) {
      if (!avatarPath) return '';
      if (avatarPath.startsWith('/https://') || avatarPath.startsWith('/http://')) {
        return avatarPath.substring(1);
      }
      return `https://image.tmdb.org/t/p/w185${avatarPath}`;
    },

    formatReviewDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    },

    handleRecommendationClick(show) {
      this.$router.push({
        name: 'TVShowDetail',
        params: { id: show.id }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    nextRecommendations() {
      const maxPage = Math.floor((this.allRecommendations.length - 1) / this.pageSize);
      if (this.recommendationsPage < maxPage)
        this.recommendationsPage++;
    },

    prevRecommendations() {
      if (this.recommendationsPage > 0) {
        this.recommendationsPage--;
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
    },

    toggleCastExpanded() {
      this.showAllCast = !this.showAllCast;
    },

    toggleCrewExpanded() {
      this.showAllCrew = !this.showAllCrew;
    },

    async toggleSeason(id) {
      const index = this.expandedSeasons.indexOf(id)
      if (index === -1) {
        this.expandedSeasons.push(id)

        // find the selected season
        const season = this.show.seasons.find(s => s.id === id)
        // only fetch if not already loaded
        if (season && !season.episodes) {
          await this.fetchEpisodeDetails(season)
        }
      } else {
        this.expandedSeasons.splice(index, 1)
      }
    },
    getImageUrl(path) {
      return path ? `https://image.tmdb.org/t/p/w300${path}` : '/placeholder.jpg'
    },
  }
}
</script>

<style scoped>
.tv-detail-page {
  min-height: 100vh;
  background: var(--gothic-black);
  color: var(--text-gothic-primary);
}

.loading-container,
.error-container {
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
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
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

.show-content {
  position: relative;
}

.backdrop-section {
  position: relative;
  height: 500px;
  overflow: hidden;
}

.backdrop-image {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-size: cover;
  background-position: center top;
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
  max-width: 1600px;
  margin: 0 auto;
  padding: 0 2rem;
  margin-top: -400px;
  z-index: 10;
}

.show-header {
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 3rem;
  align-items: start;
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

.show-poster {
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
  flex-direction: row;
  gap: 0.75rem;
  padding-top: 2vh;
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
  justify-content: flex-start;
  text-align: left;
  max-width: 1000px;
}

.title-and-creator {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 0.5rem;
}

.show-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: var(--text-gothic-primary);
}

.creator-name {
  font-size: 1rem;
  color: var(--text-gothic-secondary);
  margin-left: 1rem;
}

.show-meta {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.meta-item {
  font-size: 1.1rem;
  color: var(--text-gothic-secondary);
  font-weight: 500;
}

.donut-container {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 1rem;
}

.vote-count,
.user-score {
  font-size: 0.9rem;
  color: var(--text-gothic-secondary);
}

.status-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.status-badge {
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
}

.status-active {
  background: var(--gothic-success);
  color: var(--text-gothic-primary);
}

.status-ended {
  background: var(--gothic-crimson);
  color: var(--text-gothic-primary);
}

.last-aired {
  color: var(--text-gothic-secondary);
  font-size: 0.9rem;
}

.genres-container {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.genre-tag {
  background: var(--gothic-stone);
  color: var(--text-gothic-primary);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
  opacity: 0.9;
}

.overview-text {
  font-size: 1rem;
  color: var(--text-gothic-primary);
  line-height: 1.6;
  margin-bottom: 1.5rem;
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
  text-align: center;
}

.cast-grid,
.crew-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1.5rem;
  row-gap: 2rem;
}

.cast-member,
.crew-member {
  text-align: center;
}

.cast-photo,
.crew-photo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 auto 0.75rem;
}

.cast-image,
.crew-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.cast-placeholder,
.crew-placeholder {
  width: 100%;
  height: 100%;
  background: var(--gothic-black);
  display: flex;
  align-items: center;
  justify-content: center;
}

.cast-name,
.crew-name {
  font-weight: 600;
  color: var(--text-gothic-primary);
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
}

.cast-character,
.crew-job-title {
  color: var(--text-gothic-accent);
  font-size: 0.8rem;
}

.cast-number-of-episodes,
.crew-number-of-episodes {
  color: var(--text-gothic-secondary);
  font-size: 0.7rem;
}

.crew-job {
  color: var(--text-gothic-accent);
  font-size: 0.8rem;
}

.show-more-btn {
  width: 100%;
  margin-top: 1.5rem;
  padding: 0.75rem;
  background: transparent;
  border: 2px solid var(--text-gothic-accent);
  color: var(--text-gothic-accent);
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.show-more-btn:hover {
  background: var(--text-gothic-accent);
  color: white;
  transform: translateY(-2px);
}

/* Seasons Section */
.seasons-section {
  margin-top: 4rem;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2rem;

}

.season-card {
  border: 2px solid var(--text-gothic-secondary);
  border-radius: 15px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
}

.season-card:hover {
  border-color: var(--text-gothic-accent);
}

.season-header {
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.season-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--text-gothic-accent);
  margin-bottom: 1rem;
  text-align: center;
}

.season-poster {
  width: 150px;
  border-radius: 0.5rem;
  transition: transform 0.2s;
}

.season-poster:hover {
  transform: scale(1.05);
}

.season-details {
  margin-top: 1.5rem;
  text-align: left;
}

.season-overview {
  margin-bottom: 1rem;
  line-height: 1.6;
}

.episode-list {
  list-style: none;
  padding: 0;
}

.episode-item {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.episode-title {
  font-weight: 500;
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s ease;
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
  overflow: hidden;
}

/* Recommendations Section */
.recommendations-section {
  margin-top: 4rem;
  margin-bottom: 2rem;
}

.recommendations-scroll {
  position: relative;
  padding: 0 3rem;
}

.recommendations-container {
  display: flex;
  gap: 1.5rem;
  overflow-x: hidden;
  overscroll-behavior-x: contain;
  scroll-behavior: smooth;
  padding: 1rem 0;
  grid-auto-flow: column;
  gap: var(--gap);
  grid-auto-columns: calc((100% / var(--visible)) - ((var(--gap) * (var(--visible) - 1)) / var(--visible)));
}

.recommendations-container {
  --gap: 6px;
}

@media (min-width: 1400px) {
  .recommendations-container {
    --visible: 6;
  }
}

@media (min-width: 1200px) {
  .recommendations-container {
    --visible: 5;
  }
}

@media (min-width: 992px) {
  .recommendations-container {
    --visible: 4;
  }
}

@media (min-width: 768px) {
  .recommendations-container {
    --visible: 3;
  }
}

@media (min-width: 480px) {
  .recommendations-container {
    --visible: 2;
  }
}

@media (max-width: 479px) {
  .recommendations-container {
    --visible: 1;
  }
}

.recommendations-container::-webkit-scrollbar {
  display: none;
}

.recommendation-card {
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

.scroll-btn:hover {
  background: var(--text-gothic-accent);
  transform: translateY(-50%) scale(1.1);
}

.scroll-btn svg {
  width: 24px;
  height: 24px;
}

.scroll-left {
  left: -10px;
}

.scroll-right {
  right: -10px;
}

.recommendations-loading {
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

/* Reviews Section */
.reviews-section {
  margin-top: 4rem;
  padding-bottom: 3rem;
}

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 2rem;
}

.review-card {
  background: var(--gothic-charcoal);
  border: 2px solid var(--text-gothic-secondary);
  border-radius: 15px;
  padding: 1.5rem;
  transition: all 0.3s ease;
}

.review-card:hover {
  border-color: var(--text-gothic-accent);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.review-author {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex: 1;
}

.author-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--gothic-black);
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--text-gothic-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: white;
}

.author-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 0;
}

.author-name {
  font-weight: 600;
  color: var(--text-gothic-primary);
  font-size: 1.1rem;
  margin: 0;
}

.review-date {
  color: var(--text-gothic-secondary);
  font-size: 0.9rem;
  margin: 0;
}

.review-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(212, 175, 55, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  flex-shrink: 0;
}

.rating-value {
  font-weight: 600;
  color: var(--text-gothic-primary);
  font-size: 0.9rem;
  white-space: nowrap;
}

.review-content {
  position: relative;
}

.review-text {
  color: var(--text-gothic-primary);
  white-space: pre-wrap;
  word-wrap: break-word;
  overflow-wrap: break-word;
  margin: 0;
  max-height: 250px;
  overflow: auto;
  position: relative;
}

.review-text.expanded {
  max-height: none;
  overflow: visible;
}

.review-text:not(.expanded)::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 80px;
  background: linear-gradient(to bottom, transparent, var(--gothic-charcoal));
  pointer-events: none;
}

.read-more-btn {
  margin-top: 1rem;
  background: transparent;
  border: none;
  color: var(--text-gothic-accent);
  font-weight: 600;
  padding: 0;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  cursor: pointer;
}

.read-more-btn:hover {
  color: #667eea;
  text-decoration: underline;
}

.reviews-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  padding: 2rem;
  color: var(--text-gothic-secondary);
}
</style>
