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
        <div v-if="movie.backdrop_path" class="backdrop-image"
          :style="{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }"></div>
        <div class="backdrop-overlay"></div>
      </div>

      <!-- Main Content Container -->
      <div class="content-container">
        <div class="movie-header">
          <!-- Poster Section -->
          <div class="poster-section">
            <div class="poster-container">
              <img v-if="movie.poster_path" :src="`https://image.tmdb.org/t/p/w500${movie.poster_path}`"
                :alt="movie.title" class="movie-poster" />
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
            <h1 class="movie-title">{{ movie.title }}</h1>
            <div class="movie-meta">
              <span v-if="movie.release_date" class="meta-item">
                {{ new Date(movie.release_date).getFullYear() }}
              </span>
              <span v-if="movie.runtime" class="meta-item">
                {{ formatRuntime(movie.runtime) }}
              </span>
              <div v-if="movie.vote_average > 0" class="donut-container">
                <span class="user-score">User score</span>
                <vc-donut :background="'#6a4c7c'" :sections="sections" :size="100" :unit="px" :thickness="40"
                  :animation="true" :auto-adjust-text-size :suppress-validation-warnings="false">
                  <h1> {{ movie.vote_average.toFixed(1) }}</h1>
                </vc-donut>
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
                Rate this movie
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
                  <p class="cast-character">{{ actor.character }}</p>
                </div>
              </div>
            </div>
            <button v-if="cast.length > 8" @click="toggleCastExpanded" class="show-more-btn">
              {{ showAllCast ? 'Show Less' : `Show All ${cast.length} Cast Members` }}
            </button>
          </div>

          <!-- Crew Section -->
          <div v-if="displayedCrew.length > 0" class="detail-card crew-card">
            <h3 class="card-title">Key Crew</h3>
            <div class="crew-grid">
              <div v-for="member in displayedCrew" :key="`${member.id}-${member.job}`" class="crew-member">
                <div class="crew-photo">
                  <img v-if="member.profile_path" :src="`https://image.tmdb.org/t/p/w185${member.profile_path}`"
                    :alt="member.name" class="crew-image" />
                  <div v-else class="crew-placeholder">
                    <font-awesome-icon icon="user" style="width: 75px; height: 75px;" />
                  </div>
                </div>
                <div class="crew-info">
                  <p class="crew-name">{{ member.name }}</p>
                  <p class="crew-job">{{ member.job }}</p>
                </div>
              </div>
            </div>
            <button v-if="keyCrewMembers.length > 12" @click="toggleCrewExpanded" class="show-more-btn">
              {{ showAllCrew ? 'Show Less' : `Show All ${keyCrewMembers.length} Crew Members` }}
            </button>
          </div>
        </div>
        <!-- Recommendations Section -->
        <div v-if="allRecommendations.length > 0" class="recommendations-section">
          <h2 class="section-title">You May Also Like</h2>
          <div class="recommendations-scroll">
            <button class="scroll-btn scroll-left" @click="prevRecommendations" v-show="canScrollLeft">
             <font-awesome-icon icon="chevron-left"/>
            </button>

            <div class="recommendations-container" ref="recommendationsContainer">
              <MovieCard v-for="rec in visibleRecommendations" :key="rec.id" :movie="rec" :show-placeholder="false"
                @click="handleRecommendationClick" class="recommendation-card" />
            </div>

            <button class="scroll-btn scroll-right" @click="nextRecommendations" v-show="canScrollRight">
              <font-awesome-icon icon="chevron-right"/>
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
                  <svg class="rating-star" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
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
  name: 'MovieDetail',
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
      movie: null,
      loading: true,
      error: null,
      allRecommendations: [],
      loadingRecommendations: false,
      recommendationsPage: 0, // current page index
      pageSize: 7,
      canScrollLeft: false,
      canScrollRight: false,
      showAllCast: false,
      showAllCrew: false,
      reviews: [],
      loadingReviews: false,
      showAllReviews: false,
      expandedReviews: []
    }
  },
  computed: {
    sections() {
      const percentage = (this.movie.vote_average / 10) * 100;
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
    displayedCast() {
      return this.showAllCast ? this.cast : this.cast.slice(0, 8);
    },
    keyCrewMembers() {
      if (!this.movie || !this.movie.credits) return [];

      // Get unique crew members with important roles
      const importantJobs = [
        'Director', 'Producer', 'Executive Producer', 'Writer',
        'Screenplay', 'Story', 'Director of Photography', 'Cinematography',
        'Editor', 'Original Music Composer', 'Production Design',
        'Costume Design', 'Casting'
      ];

      const crewMap = new Map();

      this.movie.credits.crew.forEach(member => {
        if (importantJobs.includes(member.job)) {
          const key = `${member.id}-${member.job}`;
          if (!crewMap.has(key)) {
            crewMap.set(key, member);
          }
        }
      });
      return Array.from(crewMap.values());
      },
      displayedCrew() {
      return this.showAllCrew ? this.keyCrewMembers : this.keyCrewMembers.slice(0, 12);
      },
      displayedReviews() {
        return this.showAllReviews ? this.reviews : this.reviews.slice(0, 3);
      },
      visibleRecommendations() {
        const arr = this.allRecommendations || []; // guard
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
    // Watch for changes to the id prop and re-fetch data
    id(newId) {
      if (newId) {
        this.resetState();
        this.fetchMovieDetails();
        this.fetchRecommendations();
        this.fetchReviews();
      }
    }
  },
  async mounted() {
    await this.fetchMovieDetails();
    await this.fetchRecommendations();
    await this.fetchReviews();
  },
  methods: {
    resetState() {
    this.showAllCast = false;
    this.showAllCrew = false;
    this.loading = true;
    this.error = null;
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    async fetchMovieDetails() {
      try {
        const movieData = await tmdbService.getCompleteMovieDetails(this.id);
        this.movie = movieData;
        console.log('Fetched movie details:', this.movie);
      } catch (err) {
        this.error = err.message || 'An error occurred while loading movie details';
        console.error('Movie detail error:', err);
      } finally {
        this.loading = false;
      }
    },
     async fetchRecommendations() {
      this.loadingRecommendations = true;
      try {
        const data = await tmdbService.getMovieRecommendations(this.id);
        this.allRecommendations = data.results;
        this.recommendationsPage = 0;
        console.log('Recommendations set to:', this.recommendations);
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
        const data = await tmdbService.getMovieReviews(this.id);
        this.reviews = data.results || [];
      } catch (error) {
        console.error('Error loading reviews:', error);
        this.reviews = [];
      } finally {
        this.loadingReviews = false;
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
      // TMDB sometimes returns gravatar URLs starting with /https://
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

    handleRecommendationClick(movie) {
      // Navigate to the recommended movie
      this.$router.push({
        name: 'MovieDetail',
        params: { id: movie.id }
      });
      // Scroll to top when navigating
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
    },
    toggleCastExpanded() {
      this.showAllCast = !this.showAllCast;
    },

    toggleCrewExpanded() {
      this.showAllCrew = !this.showAllCrew;
    },
  }
}
</script>

<style scoped>
  .movie-detail-page {
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

  .movie-content {
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

  .movie-header {
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

  .movie-title {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 1rem;
    color: var(--text-gothic-primary);
  }

  .movie-meta {
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

  .donut-center-text {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .donut-percentage {
    font-size: 1.8rem;
    font-weight: bold;
    color: var(--text-gothic-primary);
  }


  .vote-count,
  .user-score {
    font-size: 0.9rem;
    color: var(--text-gothic-secondary);
  }

  .genres-container {
    display: flex;
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
    margin-bottom: 1rem;
  }

  .overview-text {
    font-size: 1rem;
    color: var(--text-gothic-primary);
    line-height: 1.6;
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
    grid-template-columns: repeat(5, 1fr);
    gap: 1.5rem;
    row-gap: 2rem;
  }

  .cast-member {
    text-align: center;
  }

  .cast-photo {
    width: 100px;
    height: 100px;
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

  .cast-name {
    font-weight: 600;
    color: var(--text-gothic-primary);
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
  }

  .cast-character {
    color: var(--text-gothic-accent);
    font-size: 0.8rem;
  }

  /* Crew Grid - 3 columns with reduced spacing */
  .crew-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 1.5rem;
    row-gap: 2rem;
  }

  .crew-member {
    text-align: center;
  }

  .crew-photo {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    margin: 0 auto 0.75rem;
  }

  .crew-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .crew-placeholder, .cast-placeholder {
    width: 100%;
    height: 100%;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .crew-icon {
    width: 30px;
    height: 30px;
    color: var(--text-gothic-secondary);
  }

  .crew-info {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .crew-name {
    font-weight: 600;
    color: var(--text-gothic-primary);
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
  }

  .crew-job {
    color: var(--text-gothic-accent);
    font-size: 0.8rem;
  }

  /* Show More Button */
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

  .crew-name {
    color: var(--text-gothic-primary);
  }

  /* Recommendations Section */
  .recommendations-section {
    margin-top: 4rem;
    margin-bottom: 2rem;
  }

  .section-title {
    font-size: 2rem;
    font-weight: bold;
    color: var(--text-gothic-accent);
    margin-bottom: 2rem;
    text-align: center;
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
    grid-auto-columns: calc((100% / var(--visible)) - ( (var(--gap) * (var(--visible) - 1)) / var(--visible) ));
  }
  .recommendations-container { --gap: 6px; }
  @media (min-width: 1400px) { .recommendations-container { --visible: 6; } }
  @media (min-width: 1200px) { .recommendations-container { --visible: 5; } }
  @media (min-width: 992px)  { .recommendations-container { --visible: 4; } }
  @media (min-width: 768px)  { .recommendations-container { --visible: 3; } }
  @media (min-width: 480px)  { .recommendations-container { --visible: 2; } }
  @media (max-width: 479px)  { .recommendations-container { --visible: 1; } }

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

  .rating-star {
    width: 16px;
    height: 16px;
    color: #d4af37;
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
    overflow: none;
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


  @media (max-width: 1024px) {
    .movie-header {
      grid-template-columns: 250px 1fr;
      gap: 2rem;
    }

    .poster-container {
      width: 250px;
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
    }

    .poster-section {
      order: -1;
    }

    .poster-container {
      width: 200px;
    }

    .movie-title {
      font-size: 2rem;
      text-align: center;
    }

    .title-section {
      text-align: center;
    }

    .movie-meta {
      justify-content: center;
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

    .recommendations-scroll {
      padding: 0 2rem;
    }

    .recommendation-card {
      width: 160px;
    }

    .scroll-btn {
      width: 40px;
      height: 40px;
    }

    .scroll-btn svg {
      width: 20px;
      height: 20px;
    }

    .cast-grid,
    .crew-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
      row-gap: 1.5rem;
    }

    .review-header {
      flex-direction: column;
      align-items: flex-start;
    }

    .review-rating {
      align-self: flex-start;
    }

    .author-avatar {
      width: 45px;
      height: 45px;
    }

    .author-name {
      font-size: 1rem;
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
    }

    .detail-card {
      padding: 1rem;
    }

    .cast-grid {
      grid-template-columns: repeat(2, 1fr);
    }

    .recommendations-scroll {
      padding: 0 1rem;
    }

    .recommendation-card {
      width: 140px;
    }

    .section-title {
      font-size: 1.6rem;
    }

    .cast-grid,
    .crew-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 0.75rem;
      row-gap: 1.25rem;
    }

    .reviews-section {
      margin-top: 3rem;
    }

    .review-card {
      padding: 1rem;
    }

    .author-avatar {
      width: 40px;
      height: 40px;
    }

    .author-name {
      font-size: 0.95rem;
    }

    .review-date {
      font-size: 0.8rem;
    }

    .review-text {
      font-size: 0.9rem;
      line-height: 1.6;
    }

    .review-rating {
      padding: 0.4rem 0.75rem;
    }

    .rating-value {
      font-size: 0.85rem;
    }
  }
</style>
