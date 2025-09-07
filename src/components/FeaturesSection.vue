<template>
  <section class="features-section">
    <div class="features-header" v-if="showHeader">
      <h2 class="features-title">{{ sectionTitle }}</h2>
      <p class="features-subtitle" v-if="sectionSubtitle">{{ sectionSubtitle }}</p>
    </div>

    <div class="features-grid">
      <FeatureCard
        v-for="(feature, index) in featuresData"
        :key="feature.id"
        :icon="feature.icon"
        :title="feature.title"
        :description="feature.description"
        :link="feature.link"
        :link-text="feature.linkText"
        :delay="index * animationDelay"
      />
    </div>
  </section>
</template>

<script>
import FeatureCard from './FeatureCard.vue'

export default {
  name: 'FeaturesSection',
  components: {
    FeatureCard
  },
  props: {
    features: {
      type: Array,
      default: null
    },
    sectionTitle: {
      type: String,
      default: 'Why Choose Cinephile Society'
    },
    sectionSubtitle: {
      type: String,
      default: 'Discover powerful tools to enhance your movie and TV show experience'
    },
    showHeader: {
      type: Boolean,
      default: false
    },
    animationDelay: {
      type: Number,
      default: 0.1
    },
    columns: {
      type: String,
      default: 'repeat(auto-fit, minmax(300px, 1fr))'
    }
  },
  computed: {
    featuresData() {
      return this.features || this.defaultFeatures
    }
  },
  data() {
    return {
      defaultFeatures: [
        {
          id: 1,
          icon: '🎭',
          title: 'Rate & Review',
          description: 'Share your thoughts on every film you watch. Rate movies and write detailed reviews to help others discover great cinema.',
          link: '/reviews',
          linkText: 'Write Reviews'
        },
        {
          id: 2,
          icon: '📝',
          title: 'Create Lists',
          description: 'Organize your favorite films into custom lists. From "Best of 2024" to "Comfort Food Movies" - the possibilities are endless.',
          link: '/lists',
          linkText: 'Create Lists'
        },
        {
          id: 3,
          icon: '👥',
          title: 'Follow Friends',
          description: 'Connect with fellow film enthusiasts. See what your friends are watching and get personalized recommendations.',
          link: '/social',
          linkText: 'Find Friends'
        },
        {
          id: 4,
          icon: '📊',
          title: 'Track Statistics',
          description: 'View detailed statistics about your viewing habits. Discover patterns in your taste and explore new genres.',
          link: '/stats',
          linkText: 'View Stats'
        },
        {
          id: 5,
          icon: '🎯',
          title: 'Watchlist',
          description: 'Never forget a movie recommendation again. Keep track of films you want to watch and get notified when they\'re available.',
          link: '/watchlist',
          linkText: 'Manage Watchlist'
        },
        {
          id: 6,
          icon: '🏆',
          title: 'Discover',
          description: 'Find your next favorite film through curated recommendations, trending movies, and community favorites.',
          link: '/discover',
          linkText: 'Start Exploring'
        }
      ]
    }
  }
}
</script>

<style scoped>
.features-section {
  width: 100%;
  margin: 2rem 0;
}

.features-header {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInUp 1s ease 0.2s both;
}

.features-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.features-subtitle {
  font-size: 1.2rem;
  color: rgba(255, 255, 255, 0.9);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.features-grid {
  display: grid;
  grid-template-columns: v-bind(columns);
  gap: 2rem;
  width: 100%;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Mobile Responsiveness */
@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .features-section {
    margin: 1.5rem 0;
  }

  .features-header {
    margin-bottom: 2rem;
    padding: 0 1rem;
  }

  .features-title {
    font-size: 2rem;
    margin-bottom: 0.8rem;
  }

  .features-subtitle {
    font-size: 1.1rem;
  }

  .features-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 0 1rem;
  }
}

@media (max-width: 480px) {
  .features-title {
    font-size: 1.8rem;
  }

  .features-subtitle {
    font-size: 1rem;
  }

  .features-grid {
    gap: 1rem;
  }
}

/* Alternative grid layouts */
.features-grid.two-columns {
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
}

.features-grid.three-columns {
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
}

.features-grid.four-columns {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .features-header {
    animation: none;
  }
}

/* Container queries support (future-proofing) */
@container (max-width: 600px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
