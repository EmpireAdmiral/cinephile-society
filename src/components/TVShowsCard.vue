<template>
  <div class="tv-card" @click="$emit('click', show)">
    <!-- TV Show Poster -->
    <div class="poster-container">
      <img
        v-if="show.poster_path"
        :src="`https://image.tmdb.org/t/p/w342${show.poster_path}`"
        :alt="show.name"
        class="tv-poster"
        loading="lazy"
      />
      <div v-else class="poster-placeholder">
        <svg class="poster-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- TV Show Badge -->
      <div class="tv-badge">
        <span class="tv-label">TV</span>
      </div>

      <!-- Hover Overlay -->
      <div class="hover-overlay">
        <div class="overlay-content">
          <svg class="play-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- TV Show Information -->
    <div class="tv-info">
      <!-- TV Show Title -->
      <h3 class="tv-title">{{ show.name }}</h3>

      <!-- Year and Rating Row -->
      <div class="tv-meta">
        <span v-if="show.first_air_date" class="air-year">
          {{ new Date(show.first_air_date).getFullYear() }}
        </span>

        <div v-if="show.vote_average > 0" class="rating-container">
          <svg class="single-star" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          <span class="rating-text">
            {{ show.vote_average.toFixed(1) }}<span class="rating-scale">/10</span>
          </span>
        </div>
      </div>

      <!-- Key Cast/Creators -->
      <div v-if="keyCreators.length > 0" class="cast-info">
        <span class="cast-names">{{ keyCreators }}</span>
      </div>
      <div v-else-if="keyCast.length > 0" class="cast-info">
        <span class="cast-names">{{ keyCast }}</span>
      </div>
      <div v-else-if="showPlaceholder" class="cast-info cast-placeholder">
        <span class="cast-names">Cast information loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TVCard',
  props: {
    show: {
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
    keyCreators() {
      if (!this.show.created_by || !this.show.created_by.length) {
        return ''
      }

      // Get top 2 creators and join their names
      return this.show.created_by
        .slice(0, 2)
        .map(creator => creator.name)
        .join(', ')
    },

    keyCast() {
      if (!this.show.cast || !this.show.cast.length) {
        return ''
      }

      // Get top 3 actors and join their names
      return this.show.cast
        .slice(0, 3)
        .map(actor => actor.name)
        .join(', ')
    }
  }
}
</script>

<style scoped>
.tv-card {
  background: var(--gothic-charcoal);
  border: 2px solid transparent;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 250px;
}

.tv-card:hover {
  border-color: var(--text-gothic-accent);
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
}

.poster-container {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
}

.tv-poster {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.tv-card:hover .tv-poster {
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

.tv-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(138, 43, 226, 0.9);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 0.25rem 0.5rem;
}

.tv-label {
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
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

.tv-card:hover .hover-overlay {
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

.tv-info {
  padding: 1rem;
}

.tv-title {
  font-size: 1rem;
  font-weight: bold;
  color: var(--text-gothic-primary);
  margin-bottom: 0.75rem;
  line-height: 1.3;
  display: -webkit-box;
  overflow: hidden;
  min-height: 2.6em;
}

.tv-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
  min-height: 20px;
}

.air-year {
  color: var(--text-gothic-secondary);
  font-weight: 500;
  font-size: 0.9rem;
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
  color: var(--text-gothic-secondary);
}

.cast-info {
  min-height: 2.4em;
}

.cast-names {
  color: var(--text-gothic-secondary);
  font-size: 0.85rem;
  line-height: 1.3;
  display: -webkit-box;
  overflow: hidden;
}

.cast-placeholder .cast-names {
  color: var(--text-gothic-secondary);
  font-style: italic;
  opacity: 0.7;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .tv-card {
    max-width: 180px;
  }

  .tv-title {
    font-size: 0.9rem;
  }

  .tv-info {
    padding: 0.75rem;
  }

  .single-star {
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
  .tv-card {
    max-width: 160px;
  }

  .tv-title {
    font-size: 0.85rem;
  }

  .air-year {
    font-size: 0.8rem;
  }

  .cast-names {
    font-size: 0.75rem;
  }
}
</style>
