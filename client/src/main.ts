import { extendErrorHandler } from '@sp/shared'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './routes'
import 'ant-design-vue/dist/reset.css'
import 'virtual:uno.css'

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')

extendErrorHandler()
