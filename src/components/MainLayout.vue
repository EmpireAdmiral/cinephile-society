<template>
  <div class="main-layout">
    <!-- Navigation -->
    <Navbar />

    <!-- Main Content Area -->
    <main class="main-content" :class="{ 'full-width': fullWidth }">
      <slot />
    </main>

    <!-- Footer -->
    <AppFooter v-if="showFooter" />
  </div>
</template>

<script>
import Navbar from './Navbar.vue'
import AppFooter from './AppFooter.vue'

export default {
  name: 'MainLayout',
  components: {
    Navbar,
    AppFooter
  },
  props: {
    fullWidth: {
      type: Boolean,
      default: false
    },
    showFooter: {
      type: Boolean,
      default: true
    }
  }
}
</script>

<style scoped>
.main-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  background-attachment: fixed;
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
  width: 100%;
  box-sizing: border-box;
}

.main-content.full-width {
  max-width: none;
  padding: 3rem 0;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .main-content {
    padding: 2rem 1rem;
  }

  .main-content.full-width {
    padding: 2rem 0;
  }
}

@media (max-width: 480px) {
  .main-content {
    padding: 1.5rem 0.5rem;
  }

  .main-content.full-width {
    padding: 1.5rem 0;
  }
}

/* Ensure consistent background on all devices */
@media (max-width: 768px) {
  .main-layout {
    background-attachment: scroll;
  }
}
</style>
