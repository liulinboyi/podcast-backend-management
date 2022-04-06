import '@/styles/index.scss'
import 'uno.css'

import { createApp } from 'vue'
import { setupRouter } from '@/router'
import { setupStore } from '@/store'
import App from './App.vue'
import 'plyr/dist/plyr.css'

async function setupApp() {
  const app = createApp(App)

  setupStore(app)

  await setupRouter(app)

  app.mount('#app')
}

setupApp()
