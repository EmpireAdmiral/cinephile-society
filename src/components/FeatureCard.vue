<template>
  <div class="feature-card" :style="{ animationDelay: `${delay}s` }">
    <div class="feature-icon">{{ icon }}</div>
    <h3 class="feature-title">{{ title }}</h3>
    <p class="feature-description">{{ description }}</p>
    <router-link
      v-if="link"
      :to="link"
      class="feature-link"
    >
      {{ linkText }}
      <span class="arrow">→</span>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'FeatureCard',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    link: {
      type: String,
      default: null
    },
    linkText: {
      type: String,
      default: 'Learn More'
    },
    delay: {
      type: Number,
      default: 0
    }
  }
}
</script>

<style scoped>
.feature-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  color: white;
  transition: all 0.3s ease;
  animation: fadeInUp 1s ease 0.6s both;
  position: relative;
  overflow: hidden;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.feature-card:hover {
  transform: translateY(-10px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.feature-card:hover::before {
  opacity: 1;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
}

.feature-card:hover .feature-icon {
  transform: scale(1.1);
}

.feature-title {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #ffffff, #f0f0f0);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.feature-description {
  opacity: 0.9;
  line-height: 1.6;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: white;
  text-decoration: none;
  font-weight: 600;
  padding: 0.5rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  background: rgba(255, 255, 255, 0.05);
}

.feature-link:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.5);
  transform: translateY(-2px);
}

.arrow {
  transition: transform 0.3s ease;
}

.feature-link:hover .arrow {
  transform: translateX(4px);
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
@media (max-width: 768px) {
  .feature-card {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }

  .feature-icon {
    font-size: 2.5rem;
  }

  .feature-title {
    font-size: 1.3rem;
  }

  .feature-description {
    font-size: 0.9rem;
    line-height: 1.5;
  }

  .feature-link {
    font-size: 0.85rem;
    padding: 0.4rem 0.8rem;
  }
}

@media (max-width: 480px) {
  .feature-card {
    padding: 1.2rem;
  }

  .feature-icon {
    font-size: 2rem;
    margin-bottom: 0.8rem;
  }

  .feature-title {
    font-size: 1.2rem;
    margin-bottom: 0.8rem;
  }

  .feature-description {
    margin-bottom: 1.2rem;
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .feature-card {
    animation: none;
  }

  .feature-card:hover {
    transform: none;
  }

  .feature-card:hover .feature-icon {
    transform: none;
  }

  .feature-link:hover {
    transform: none;
  }

  .feature-link:hover .arrow {
    transform: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .feature-card {
    border: 2px solid rgba(255, 255, 255, 0.8);
    background: rgba(255, 255, 255, 0.2);
  }

  .feature-title {
    -webkit-text-fill-color: white;
  }
}
</style>
