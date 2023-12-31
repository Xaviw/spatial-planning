import { setErrorHandler } from '@sp/shared/utils'
import App from './App.vue'
import router from './routes'
import 'ant-design-vue/dist/reset.css'
import 'virtual:uno.css'
import '../../unocss-icon'

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')

setErrorHandler(() => {
  console.log('manage error')
})
