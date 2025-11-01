<template>
  <div class="movie-card" @click="$emit('click', movie)">
    <!-- Movie Poster -->
    <div class="poster-container">
      <img v-if="movie.poster_path" :src="`https://image.tmdb.org/t/p/w342${movie.poster_path}`" :alt="movie.title"
        class="movie-poster" loading="lazy" />
      <div v-else class="poster-placeholder">
        <svg class="poster-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Hover Overlay -->
      <div class="hover-overlay">
        <div class="overlay-content">
          <font-awesome-icon icon="eye" style="width: 60px; height: 60px; color: #d4af37;"/>
        </div>
      </div>
    </div>

    <!-- Movie Information -->
    <div class="movie-info">
      <!-- Movie Title -->
      <h3 class="movie-title">{{ movie.title }}</h3>

      <!-- Year and Rating Row -->
      <div v-if="movie.vote_average > 0" class="movie-meta">
        <span v-if="movie.release_date" class="release-year">
          {{ new Date(movie.release_date).getFullYear() }}
        </span>

        <div class="rating-container">
          <font-awesome-icon icon="star" class="star-rating"/>
          <span class="rating-text">
            {{ movie.vote_average.toFixed(1) }}<span class="rating-scale">/10</span>
          </span>
        </div>
      </div>
    </div>

    <!-- Key Cast -->
    <div v-if="keyCast.length > 0" class="cast-info">
      <span class="cast-names">{{ keyCast }}</span>
    </div>
    <div v-else-if="showPlaceholder" class="cast-info cast-placeholder">
      <span class="cast-names">Cast information unavailable</span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'MovieCard',
  props: {
    movie: {
      type: Object,
      required: true
    },
    showPlaceholder: {
      type: Boolean,
      default: true
    }
  },
  emits: ['click'],
  computed: {
    keyCast() {
      if (!this.movie.cast || !this.movie.cast.length) {
        return ''
      }

      // Get top 3 actors and join their names
      return this.movie.cast
        .slice(0, 3)
        .map(actor => actor.name)
        .join(', ')
    }
  },
  methods: {
    handleMovieClick(movie) {
      this.$router.push({
        name: 'Movies',
        params: { id: movie.id }
      });
    }
  }
}
</script>

<style scoped>
.movie-card {
  background: var(--gothic-charcoal);
  border: 2px solid transparent;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 300px;
}

.movie-card:hover {
  border-color: var(--text-gothic-accent);
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
}

.poster-container {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
}

.movie-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.movie-card:hover .movie-poster {
  transform: scale(1.05);
}

.poster-placeholder {
  width: 100%;
  height: 100%;
  background: var(--gothic-black);
  display: flex;
  align-items: center;
  justify-content: center;
}

.poster-icon {
  width: 60px;
  height: 60px;
  color: var(--text-gothic-secondary);
}

.hover-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.movie-card:hover .hover-overlay {
  opacity: 1;
}

.overlay-content {
  color: white;
  text-align: center;
}

.play-icon {
  width: 48px;
  height: 48px;
  color: var(--text-gothic-accent);
}

.movie-info {
  padding: 1rem;
}

.movie-title {
  font-size: 1.1rem;
  font-weight: bold;
  color: var(--text-gothic-primary);
  margin-bottom: 0.75rem;
  line-height: 1.3;
  display: flex;
  overflow: hidden;
  min-height: 2.6em;
}

.movie-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.8rem;
  min-height: 20px;
}

.release-year {
  color: var(--text-gothic-primary);
  font-weight: 500;
  font-size: 0.9rem;
}

.rating-container {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.star-rating {
  width: 20px;
  height: 20px;
  color: var(--gothic-gold);
}

.rating-text {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-gothic-primary);
}

.rating-scale {
  font-size: 0.9rem;
  font-weight: 400;
  color: var(--text-gothic-secondary);
}

.cast-info {
  min-height: 2em;
  padding: 0 1rem 1rem 1rem;
}

.cast-names {
  color: var(--text-gothic-secondary);
  font-size: 0.85rem;
  line-height: 1.3;
  display: -webkit-box;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cast-placeholder .cast-names {
  color: var(--text-gothic-secondary);
  font-style: italic;
  opacity: 0.7;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .movie-card {
    max-width: 180px;
  }

  .movie-title {
    font-size: 0.9rem;
  }

  .movie-info {
    padding: 0.75rem;
  }

  .star {
    width: 12px;
    height: 12px;
  }

  .rating-text {
    font-size: 0.8rem;
  }

  .cast-names {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .movie-card {
    max-width: 160px;
  }

  .movie-title {
    font-size: 0.85rem;
  }

  .release-year {
    font-size: 0.8rem;
  }

  .cast-names {
    font-size: 0.75rem;
  }
}
</style>
