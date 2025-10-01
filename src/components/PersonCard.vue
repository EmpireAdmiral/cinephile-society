<template>
  <div class="person-card" @click="$emit('click', person)">
    <!-- Person Photo -->
    <div class="photo-container">
      <img
        v-if="person.profile_path"
        :src="`https://image.tmdb.org/t/p/w342${person.profile_path}`"
        :alt="person.name"
        class="person-photo"
        loading="lazy"
      />
      <div v-else class="photo-placeholder">
        <svg class="person-icon" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Person Badge -->
      <div class="person-badge">
        <span class="person-label">Person</span>
      </div>

      <!-- Hover Overlay -->
      <div class="hover-overlay">
        <div class="overlay-content">
          <svg class="info-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
      </div>
    </div>

    <!-- Person Information -->
    <div class="person-info">
      <!-- Person Name -->
      <h3 class="person-name">{{ person.name }}</h3>

      <!-- Known For Department -->
      <div class="person-meta">
        <span v-if="person.known_for_department" class="department">
          {{ person.known_for_department }}
        </span>
      </div>

      <!-- Known For Works -->
      <div v-if="knownForTitles" class="known-for">
        <span class="known-for-label">Known for:</span>
        <span class="known-for-titles">{{ knownForTitles }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PersonCard',
  props: {
    person: {
      type: Object,
      required: true
    }
  },
  emits: ['click'],
  computed: {
    knownForTitles() {
      if (!this.person.known_for || !this.person.known_for.length) {
        return ''
      }

      // Get titles from known_for array (mix of movies and TV shows)
      return this.person.known_for
        .slice(0, 3)
        .map(item => item.title || item.name)
        .filter(Boolean)
        .join(', ')
    }
  }
}
</script>

<style scoped>
.person-card {
  background: var(--gothic-charcoal);
  border: 2px solid transparent;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  max-width: 250px;
}

.person-card:hover {
  border-color: var(--text-gothic-accent);
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.2);
}

.photo-container {
  position: relative;
  aspect-ratio: 2/3;
  overflow: hidden;
}

.person-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.person-card:hover .person-photo {
  transform: scale(1.05);
}

.photo-placeholder {
  width: 100%;
  height: 100%;
  background: var(--gothic-black);
  display: flex;
  align-items: center;
  justify-content: center;
}

.person-icon {
  width: 60px;
  height: 60px;
  color: var(--text-gothic-secondary);
}

.person-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  background: rgba(34, 197, 94, 0.9);
  backdrop-filter: blur(5px);
  border-radius: 12px;
  padding: 0.25rem 0.5rem;
}

.person-label {
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

.person-card:hover .hover-overlay {
  opacity: 1;
}

.overlay-content {
  color: white;
  text-align: center;
}

.info-icon {
  width: 48px;
  height: 48px;
  color: var(--text-gothic-accent);
}

.person-info {
  padding: 1rem;
}

.person-name {
  font-size: 1rem;
  font-weight: bold;
  color: var(--text-gothic-primary);
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  overflow: hidden;
  min-height: 2.6em;
}

.person-meta {
  margin-bottom: 0.75rem;
  min-height: 20px;
}

.department {
  color: var(--text-gothic-accent);
  font-weight: 500;
  font-size: 0.9rem;
  text-transform: capitalize;
}

.known-for {
  min-height: 2.4em;
}

.known-for-label {
  color: var(--text-gothic-accent);
  font-weight: 600;
  font-size: 0.8rem;
  display: block;
  margin-bottom: 0.25rem;
}

.known-for-titles {
  color: var(--text-gothic-secondary);
  font-size: 0.85rem;
  line-height: 1.3;
  display: -webkit-box;
  overflow: hidden;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .person-card {
    max-width: 180px;
  }

  .person-name {
    font-size: 0.9rem;
  }

  .person-info {
    padding: 0.75rem;
  }

  .known-for-titles {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .person-card {
    max-width: 160px;
  }

  .person-name {
    font-size: 0.85rem;
  }

  .department {
    font-size: 0.8rem;
  }

  .known-for-titles {
    font-size: 0.75rem;
  }
}
</style>
