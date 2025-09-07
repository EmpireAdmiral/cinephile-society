<template>
  <section class="hero-section">
    <h1 class="hero-title">{{ title }}</h1>
    <p class="hero-subtitle">{{ subtitle }}</p>
    <div class="cta-buttons">
      <router-link
        :to="primaryButton.link"
        class="btn btn-primary"
      >
        {{ primaryButton.text }}
      </router-link>
      <router-link
        :to="secondaryButton.link"
        class="btn btn-secondary"
      >
        {{ secondaryButton.text }}
      </router-link>
    </div>
  </section>
</template>

<script>
export default {
  name: 'HeroSection',
  props: {
    title: {
      type: String,
      default: 'Track Every Film'
    },
    subtitle: {
      type: String,
      default: 'Discover, rate, and review movies. Keep track of what you\'ve watched and create lists of films you love.'
    },
    primaryButton: {
      type: Object,
      default: () => ({
        text: 'Get Started',
        link: '/signup'
      })
    },
    secondaryButton: {
      type: Object,
      default: () => ({
        text: 'Browse Movies',
        link: '/movies'
      })
    }
  }
}
</script>

<style scoped>
.hero-section {
  text-align: center;
  color: white;
  margin-bottom: 4rem;
  padding: 2rem 0;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: bold;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  animation: fadeInUp 1s ease;
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  animation: fadeInUp 1s ease 0.2s both;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
  animation: fadeInUp 1s ease 0.4s both;
}

.btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 30px;
  font-size: 1.1rem;
  font-weight: 600;
  text-decoration: none;
  display: inline-block;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  min-width: 160px;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
}

.btn-primary:hover {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
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
  .hero-title {
    font-size: 2.5rem;
    margin-bottom: 1.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
    padding: 0 1rem;
    margin-bottom: 2.5rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .btn {
    width: 100%;
    max-width: 280px;
    padding: 1.2rem 2rem;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 1rem 0;
    margin-bottom: 3rem;
  }

  .hero-title {
    font-size: 2rem;
    line-height: 1.2;
  }

  .hero-subtitle {
    font-size: 1rem;
    margin-bottom: 2rem;
  }

  .btn {
    font-size: 1rem;
    padding: 1rem 1.5rem;
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .hero-title,
  .hero-subtitle,
  .cta-buttons {
    animation: none;
  }

  .btn {
    transition: none;
  }

  .btn:hover {
    transform: none;
  }
}
</style>
