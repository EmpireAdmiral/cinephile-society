<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="logo">🎭 Cinephile Society</router-link>

      <div class="search-bar">
        <div class="search-wrapper">
          <input
            type="text"
            v-model="searchQuery"
            placeholder="Search movies, shows, actors..."
            @keyup.enter="performSearch"
            @input="onSearchInput"
            @focus="showSuggestions = true"
            @blur="hideSuggestions"
            class="search-input"
          >

          <!-- Clear button -->
          <button
            v-if="searchQuery"
            type="button"
            @click="clearSearch"
            class="clear-button"
          >
            ×
          </button>

          <!-- Search Suggestions Dropdown -->
          <div
            v-if="showSuggestions && suggestions.length > 0"
            class="suggestions-dropdown"
          >
            <button
              v-for="suggestion in suggestions"
              :key="suggestion.id"
              type="button"
              @mousedown="selectSuggestion(suggestion)"
              class="suggestion-item"
            >
              <img
                v-if="suggestion.poster_path"
                :src="`https://image.tmdb.org/t/p/w92${suggestion.poster_path}`"
                :alt="suggestion.title"
                class="suggestion-poster"
              />
              <div class="suggestion-info">
                <p class="suggestion-title">{{ suggestion.title }}</p>
                <p class="suggestion-year">
                  {{ suggestion.release_date ? new Date(suggestion.release_date).getFullYear() : 'Unknown' }}
                </p>
              </div>
            </button>
          </div>
        </div>
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
import { tmdbService } from '@/services/tmdb'

export default {
  name: 'Navbar',
  setup() {
    const searchQuery = ref('')
    const mobileMenuOpen = ref(false)
    const showSuggestions = ref(false)
    const suggestions = ref([])
    const searchTimeout = ref(null)
    const router = useRouter()

    // TMDB API configuration
    const apiKey = process.env.VUE_APP_TMDB_API_KEY || ''

    const performSearch = () => {
      if (searchQuery.value.trim()) {
        console.log('Searching for:', searchQuery.value)
        // Navigate to search results page
        router.push({
          name: 'SearchResults', // Changed from 'Search' to match the router config
          query: { q: searchQuery.value.trim() }
        })
        searchQuery.value = ''
        showSuggestions.value = false
        closeMobileMenu()
      }
    }

    const fetchSuggestions = async () => {
      try {
        const results = await tmdbService.getMultiSearchSuggestions(searchQuery.value)
        suggestions.value = results
        // Keep suggestions visible when we have results
        showSuggestions.value = true
      } catch (error) {
        console.error('Error fetching suggestions:', error)
        suggestions.value = []
        showSuggestions.value = false
      }
    }

    const onSearchInput = () => {
      // Clear existing timeout
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
      }

      // Debounce search suggestions
      if (searchQuery.value.trim().length >= 2) {
        searchTimeout.value = setTimeout(() => {
          fetchSuggestions()
        }, 800)
      } else {
        suggestions.value = []
        showSuggestions.value = false
      }
    }

    const selectSuggestion = (item) => {
      // Clear the search and hide suggestions
      searchQuery.value = ''
      showSuggestions.value = false

      if (item.media_type === 'movie') {
        router.push({
          name: 'Movies',
          params: { id: item.id }
        })
      } else if (item.media_type === 'tv') {
        router.push({
          name: 'TVShow',
          params: { id: item.id }
        })
      } else {
        router.push({
          name: 'SearchResults',
          query: { q: item.title || item.name }
        })
      }
    }

    const clearSearch = () => {
      searchQuery.value = ''
      suggestions.value = []
      showSuggestions.value = false
    }

    const hideSuggestions = () => {
      // Small delay to allow for suggestion clicks
      setTimeout(() => {
        showSuggestions.value = false
      }, 250)
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
      // Close suggestions when clicking outside
      if (!event.target.closest('.search-wrapper')) {
        showSuggestions.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onUnmounted(() => {
      document.removeEventListener('click', handleClickOutside)
      if (searchTimeout.value) {
        clearTimeout(searchTimeout.value)
      }
    })

    return {
      searchQuery,
      mobileMenuOpen,
      showSuggestions,
      suggestions,
      performSearch,
      onSearchInput,
      selectSuggestion,
      clearSearch,
      hideSuggestions,
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

.search-bar {
  position: relative;
  margin: 0 2rem;
}

.search-wrapper {
  position: relative;
}

.search-input {
  padding: 0.7rem 1.5rem;
  padding-right: 2.5rem; /* Make room for clear button */
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

.clear-button {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.clear-button:hover {
  color: #333;
  background: rgba(0, 0, 0, 0.1);
}

/* Search Suggestions Dropdown */
.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--gothic-black);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 10px;
  margin-top: 5px;
  max-height: 300px;
  overflow-y: auto;
  z-index: 1001;
  backdrop-filter: blur(10px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
}

.suggestion-item {
  width: 100%;
  padding: 0.75rem;
  background: none;
  border: none;
  color: var(--text-gothic-primary);
  text-align: left;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background: rgba(102, 126, 234, 0.1);
  color: var(--text-gothic-accent);
}

.suggestion-poster {
  width: 30px;
  height: 45px;
  object-fit: cover;
  border-radius: 4px;
  flex-shrink: 0;
}

.suggestion-info {
  flex: 1;
  min-width: 0;
}

.suggestion-title {
  font-weight: 500;
  margin: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.suggestion-year {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.6);
  margin: 0;
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

  .suggestions-dropdown {
    left: -1rem;
    right: -1rem;
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

  .suggestions-dropdown {
    left: -0.5rem;
    right: -0.5rem;
  }

  .suggestion-item {
    padding: 0.5rem;
    gap: 0.5rem;
  }

  .suggestion-poster {
    width: 25px;
    height: 37px;
  }
}
</style>
