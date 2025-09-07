<template>
  <MainLayout>
    <div class="home-page">
      <!-- Hero Section -->
      <HeroSection
        title="Track Every Film & Show"
        subtitle="Join the ultimate community for movie and TV enthusiasts. Discover, rate, review, and connect with fellow cinephiles."
        :primary-button="{ text: 'Join the Society', link: '/signup' }"
        :secondary-button="{ text: 'Explore Movies', link: '/movies' }"
      />

      <!-- Features Section -->
      <FeaturesSection
        :show-header="true"
        section-title="Why Choose Cinephile Society"
        section-subtitle="Everything you need to track, discover, and discuss movies and TV shows"
      />

      <!-- Stats Section -->
      <section class="stats-section">
        <div class="stats-header">
          <h2 class="stats-title">Join Our Growing Community</h2>
        </div>
        <div class="stats-grid">
          <div class="stat-item" v-for="stat in communityStats" :key="stat.id">
            <div class="stat-number">{{ stat.number }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </section>

      <!-- Call to Action Section -->
      <section class="cta-section">
        <div class="cta-content">
          <h2 class="cta-title">Ready to Start Your Journey?</h2>
          <p class="cta-text">
            Join thousands of film enthusiasts who are already tracking their favorite movies and shows.
          </p>
          <div class="cta-buttons">
            <router-link to="/signup" class="btn btn-primary large">
              Create Account
            </router-link>
            <router-link to="/about" class="btn btn-secondary large">
              Learn More
            </router-link>
          </div>
        </div>
      </section>
    </div>
  </MainLayout>
</template>

<script>
import MainLayout from '@/components/MainLayout.vue'
import HeroSection from '@/components/HeroSection.vue'
import FeaturesSection from '@/components/FeaturesSection.vue'

export default {
  name: 'Home',
  components: {
    MainLayout,
    HeroSection,
    FeaturesSection
  },
  data() {
    return {
      communityStats: [
        { id: 1, number: '50K+', label: 'Active Members' },
        { id: 2, number: '2M+', label: 'Movies Rated' },
        { id: 3, number: '150K+', label: 'Reviews Written' },
        { id: 4, number: '25K+', label: 'Custom Lists' }
      ]
    }
  },
  mounted() {
    // Add any page-specific initialization here
    document.title = 'Cinephile Society - Your Movie & TV Community'
  }
}
</script>

<style scoped>
.home-page {
  width: 100%;
}

/* Stats Section */
.stats-section {
  margin: 4rem 0;
  text-align: center;
}

.stats-header {
  margin-bottom: 3rem;
}

.stats-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: white;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  margin-bottom: 1rem;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.stat-item {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 2rem 1rem;
  transition: all 0.3s ease;
  animation: fadeInUp 1s ease 0.8s both;
}

.stat-item:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.15);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.stat-number {
  font-size: 3rem;
  font-weight: bold;
  color: white;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.stat-label {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

/* CTA Section */
.cta-section {
  margin: 5rem 0;
  text-align: center;
}

.cta-content {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 30px;
  padding: 3rem 2rem;
  max-width: 700px;
  margin: 0 auto;
  animation: fadeInUp 1s ease 1s both;
}

.cta-title {
  font-size: 2.2rem;
  font-weight: bold;
  color: white;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.cta-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 2rem;
  line-height: 1.6;
}

.cta-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
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

.btn.large {
  padding: 1.2rem 2.5rem;
  font-size: 1.2rem;
}

.btn-primary {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  border: 2px solid rgba(255, 255, 255, 0.9);
}

.btn-primary:hover {
  background: white;
  transform: translateY(-3px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
}

.btn-secondary {
  background: transparent;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
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
  .stats-title {
    font-size: 2rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }

  .stat-number {
    font-size: 2.5rem;
  }

  .stat-label {
    font-size: 1rem;
  }

  .cta-content {
    padding: 2rem 1.5rem;
    border-radius: 20px;
  }

  .cta-title {
    font-size: 1.8rem;
  }

  .cta-text {
    font-size: 1rem;
  }

  .cta-buttons {
    flex-direction: column;
    align-items: center;
  }

  .btn.large {
    width: 100%;
    max-width: 300px;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .stat-item {
    padding: 1.5rem 1rem;
  }

  .stat-number {
    font-size: 2rem;
  }

  .cta-content {
    padding: 1.5rem 1rem;
  }

  .cta-title {
    font-size: 1.6rem;
  }
}

/* Reduced motion preference */
@media (prefers-reduced-motion: reduce) {
  .stat-item,
  .cta-content {
    animation: none;
  }

  .stat-item:hover,
  .btn:hover {
    transform: none;
  }
}
</style>
