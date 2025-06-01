import { createApp } from 'vue'
import App from './App.vue'            // ✅ 올바른 App 컴포넌트 경로
import { createPinia } from 'pinia'
import router from './router'

import './assets/main.css'             // TailwindCSS 엔트리

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')
