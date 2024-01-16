import { setErrorHandler } from '@sp/shared/utils'
import App from './App.vue'
import router from './routes'
import 'ant-design-vue/dist/reset.css'
import 'vue3-colorpicker/style.css'
import 'virtual:uno.css'
import '../../unocss-icon'

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')

setErrorHandler((...args: any[]) => {
  console.log('manage error', ...args)
})
