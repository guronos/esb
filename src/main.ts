import './assets/main.css'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ru from 'element-plus/es/locale/lang/ru'
import 'dayjs/locale/ru'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(ElementPlus, {
  locale: ru
})
app.use(createPinia())
app.use(router)

app.mount('#app')
