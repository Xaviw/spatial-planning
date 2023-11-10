import { extendErrorHandler } from '@sp/shared'
import App from './App.vue'
import router from './routes'
import 'ant-design-vue/dist/reset.css'
import 'virtual:uno.css'

createApp(App).use(router).mount('#app')

extendErrorHandler()
