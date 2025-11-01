/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from '@/plugins'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import 'unfonts.css'
import '@/styles/default-styles.css'
import 'vue-css-donut-chart/dist/vcdonut.css';

// import only the icons you use
import { faPlus, faStar, faHeart, faCheck, faUser, faChevronLeft, faChevronRight, faEye} from '@fortawesome/free-solid-svg-icons'
import { fa } from 'vuetify/locale'
library.add(faPlus, faStar, faHeart, faCheck, faUser, faChevronLeft, faChevronRight, faEye)

const app = createApp(App)
app.component('font-awesome-icon', FontAwesomeIcon)
registerPlugins(app)

app.mount('#app')
