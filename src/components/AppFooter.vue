<template>
  <footer class="app-footer">
    <div class="footer-content">
      <div class="footer-section">
        <div class="footer-brand">
          <h3 class="brand-name">🎭 Cinephile Society</h3>
          <p class="brand-tagline">Where film lovers unite</p>
        </div>
      </div>

      <div class="footer-section">
        <h4 class="footer-title">Discover</h4>
        <ul class="footer-links">
          <li><router-link to="/movies">Movies</router-link></li>
          <li><router-link to="/shows">TV Shows</router-link></li>
          <li><router-link to="/trending">Trending</router-link></li>
          <li><router-link to="/genres">Genres</router-link></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4 class="footer-title">Community</h4>
        <ul class="footer-links">
          <li><router-link to="/reviews">Reviews</router-link></li>
          <li><router-link to="/lists">Lists</router-link></li>
          <li><router-link to="/discussions">Discussions</router-link></li>
          <li><router-link to="/members">Members</router-link></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4 class="footer-title">Account</h4>
        <ul class="footer-links">
          <li><router-link to="/profile">My Profile</router-link></li>
          <li><router-link to="/watchlist">Watchlist</router-link></li>
          <li><router-link to="/settings">Settings</router-link></li>
          <li><router-link to="/help">Help</router-link></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4 class="footer-title">Connect</h4>
        <div class="social-links">
          <a href="#" class="social-link" aria-label="Twitter">
            <span class="social-icon">🐦</span>
          </a>
          <a href="#" class="social-link" aria-label="Instagram">
            <span class="social-icon">📷</span>
          </a>
          <a href="#" class="social-link" aria-label="Discord">
            <span class="social-icon">💬</span>
          </a>
          <a href="#" class="social-link" aria-label="Reddit">
            <span class="social-icon">📱</span>
          </a>
        </div>
        <div class="newsletter">
          <p class="newsletter-text">Stay updated</p>
          <div class="newsletter-form">
            <input
              type="email"
              placeholder="Your email"
              v-model="email"
              class="newsletter-input"
            >
            <button
              @click="subscribeNewsletter"
              class="newsletter-btn"
              :disabled="!email"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p class="copyright">
          © {{ currentYear }} Cinephile Society. All rights reserved.
        </p>
        <div class="footer-bottom-links">
          <router-link to="/privacy">Privacy Policy</router-link>
          <router-link to="/terms">Terms of Service</router-link>
          <router-link to="/contact">Contact</router-link>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'AppFooter',
  setup() {
    const email = ref('')
    const currentYear = computed(() => new Date().getFullYear())

    const subscribeNewsletter = () => {
      if (email.value.trim()) {
        console.log('Subscribing:', email.value)
        // Handle newsletter subscription
        alert(`Thank you for subscribing with ${email.value}!`)
        email.value = ''
      }
    }

    return {
      email,
      currentYear,
      subscribeNewsletter
    }
  }
}
</script>

<style scoped>
.app-footer {
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem 2rem;
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.5fr;
  gap: 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
}

.footer-brand .brand-name {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-tagline {
  color: rgba(255, 255, 255, 0.7);
  font-style: italic;
}

.footer-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #667eea;
}

.footer-links {
  list-style: none;
  padding: 0;
}

.footer-links li {
  margin-bottom: 0.5rem;
}

.footer-links a {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.footer-links a:hover {
  color: white;
  transform: translateX(4px);
}

.social-links {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  text-decoration: none;
  transition: all 0.3s ease;
}

.social-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.social-icon {
  font-size: 1.2rem;
}

.newsletter-text {
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 0.8rem;
  font-size: 0.9rem;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
}

.newsletter-input {
  flex: 1;
  padding: 0.6rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.85rem;
  outline: none;
  transition: all 0.3s ease;
}

.newsletter-input:focus {
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.15);
}

.newsletter-input::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.newsletter-btn {
  padding: 0.6rem 1rem;
  background: linear-gradient(45deg, #667eea, #764ba2);
  border: none;
  border-radius: 6px;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.newsletter-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.newsletter-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 1.5rem 0;
  background: rgba(0, 0, 0, 0.3);
}

.footer-bottom-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.copyright {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.85rem;
}

.footer-bottom-links {
  display: flex;
  gap: 1.5rem;
}

.footer-bottom-links a {
  color: rgba(255, 255, 255, 0.7);
  text-decoration: none;
  font-size: 0.85rem;
  transition: color 0.3s ease;
}

.footer-bottom-links a:hover {
  color: white;
}

/* Mobile Responsiveness */
@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 2fr 1fr 1fr 1.5fr;
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
    padding: 2rem 1rem;
  }

  .footer-bottom-content {
    flex-direction: column;
    gap: 1rem;
    text-align: center;
    padding: 0 1rem;
  }

  .footer-bottom-links {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
    padding: 1.5rem 1rem;
  }

  .footer-section {
    text-align: center;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .social-links {
    justify-content: center;
  }

  .footer-bottom-links {
    flex-direction: column;
    gap: 0.5rem;
  }
}
</style>
