// Composables
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import MovieDetail from '@/components/MovieDetail.vue'
import SearchResults from '@/components/SearchResults.vue'
import Discover from '@/views/Discover.vue'

const routes = [
  { path: '/', name: 'Home', component: Home },
  {
    path: '/search',
    name: 'SearchResults',
    component: SearchResults,
    // This allows the search query to be passed via query parameter
    props: (route:any) => ({ query: route.query.q })
  },
  {
    path: '/discover',
    name: 'Discover',
    component: Discover,
    props: true
  },
  {
    path: '/movie/:id',
    name: 'MovieDetail',
    component: MovieDetail,
    props: true
  },
  // Add other routes as needed
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
