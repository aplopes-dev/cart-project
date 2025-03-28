import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './i18n'
import { Toast, options } from './plugins/toast'
import './assets/tailwind.css'
import { createPinia } from 'pinia'

const app = createApp(App)

app.use(store)
app.use(router)
app.use(i18n)
app.use(Toast, options)

const pinia = createPinia()
app.use(pinia)

app.mount('#app')








