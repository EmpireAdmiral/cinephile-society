<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="logo">🎭 Cinephile Society</router-link>

      <div class="search-bar">
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search movies, shows, actors..."
          @keyup.enter="performSearch"
          class="search-input"
        >
      </div>

      <ul class="nav-links" :class="{ active: mobileMenuOpen }">
        <li><router-link to="/" @click="closeMobileMenu">Home</router-link></li>
        <li><router-link to="/movies" @click="closeMobileMenu">Movies</router-link></li>
        <li><router-link to="/shows" @click="closeMobileMenu">Shows</router-link></li>
        <li><router-link to="/watchlist" @click="closeMobileMenu">Watchlist</router-link></li>
        <li v-if="isLoggedIn">
          <router-link to="/profile" @click="closeMobileMenu">Profile</router-link>
        </li>
        <!-- Show Sign In only if user is NOT logged in -->
         <li v-if="!isLoggedIn">
          <router-link to="/login" @click="closeMobileMenu">Sign In</router-link>
        </li>
      </ul>

      <div class="hamburger" @click="toggleMobileMenu">
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  </nav>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

export default {
  name: 'Navbar',
  setup() {
    const searchQuery = ref('')
    const mobileMenuOpen = ref(false)
    const router = useRouter()

    const performSearch = () => {
      if (searchQuery.value.trim()) {
        console.log('Searching for:', searchQuery.value)
        // Navigate to search results page
        router.push({
          name: 'Search',
          query: { q: searchQuery.value }
        })
        searchQuery.value = ''
        closeMobileMenu()
      }
    }

    const toggleMobileMenu = () => {
      mobileMenuOpen.value = !mobileMenuOpen.value
    }

    const closeMobileMenu = () => {
      mobileMenuOpen.value = false
    }

    const handleClickOutside = (event) => {
      if (!event.target.closest('.nav-container') && mobileMenuOpen.value) {
        mobileMenuOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return {
      searchQuery,
      mobileMenuOpen,
      performSearch,
      toggleMobileMenu,
      closeMobileMenu,
      isLoggedIn: ref(true) // Placeholder for authentication state
    }
  }
}
</script>

<style scoped>
.navbar {
  background: var(--gothic-black);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
}


.nav-container {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: 1.8rem;
  font-weight: bold;
  background: linear-gradient(45deg, #667eea, #764ba2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: transform 0.3s ease;
}

.logo:hover {
  transform: scale(1.1);
}

.nav-links {
  display: flex;
  list-style: none;
  gap: 2rem;
  align-items: center;
}

.nav-links a {
  text-decoration: solid;
  color: var(--text-gothic-primary);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-links a::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  transition: left 0.3s ease;
  z-index: -1;
}

.nav-links a:hover {
  color: var(--gothic-bone);
  font-size: 1.3rem;
}

/* Active route styling */
.nav-links a.router-link-active {
  color: var(--text-gothic-accent);
  font-weight: 600;
}

/* .nav-links a.router-link-active::before {
  left: 0;
  background: rgba(102, 126, 234, 0.1);
} */

.search-bar {
  position: relative;
  margin: 0 2rem;
}

.search-input {
  padding: 0.7rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 25px;
  background: #c0c0c0;
  backdrop-filter: blur(10px);
  color: #333;
  width: 300px;
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  border-color: #667eea;
  background: rgba(255, 255, 255, 0.9);
  width: 350px;
}

.search-input::placeholder {
  color: #666;
}

.hamburger {
  display: none;
  flex-direction: column;
  cursor: pointer;
  padding: 0.5rem;
}

.hamburger span {
  width: 25px;
  height: 3px;
  background: #333;
  margin: 3px 0;
  transition: 0.3s;
  border-radius: 3px;
}

/* Mobile Styles */
@media (max-width: 768px) {
  .nav-links {
    display: none;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    flex-direction: column;
    padding: 1rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  }

  .nav-links.active {
    display: flex;
  }

  .nav-links li {
    width: 100%;
    text-align: center;
  }

  .nav-links a {
    display: block;
    width: 100%;
    padding: 1rem;
    margin: 0.5rem 0;
  }

  .hamburger {
    display: flex;
  }

  .search-bar {
    margin: 0 1rem;
  }

  .search-input {
    width: 200px;
  }

  .search-input:focus {
    width: 220px;
  }

  .nav-container {
    padding: 0 1rem;
  }

  /* Hamburger animation when active */
  .hamburger.active span:nth-child(1) {
    transform: rotate(45deg) translate(5px, 5px);
  }

  .hamburger.active span:nth-child(2) {
    opacity: 0;
  }

  .hamburger.active span:nth-child(3) {
    transform: rotate(-45deg) translate(7px, -6px);
  }
}

@media (max-width: 480px) {
  .logo {
    font-size: 1.4rem;
  }

  .search-input {
    width: 150px;
    font-size: 0.9rem;
  }

  .search-input:focus {
    width: 170px;
  }

  .navbar {
    padding: 0.8rem 1rem;
  }
}
</style>
