import { setErrorHandler } from '@sp/shared/utils'
import App from './App.vue'
import router from './routes'
import 'ant-design-vue/dist/reset.css'
import 'vue3-colorpicker/style.css'
import 'virtual:uno.css'
import '../../unocss-icon'

const pinia = createPinia()

createApp(App).use(router).use(pinia).mount('#app')

setErrorHandler(response => {
  if (response.status === 401) {
    localStorage.removeItem('Access-Token')
    localStorage.removeItem('Refresh-Token')
    router.replace({ name: 'login' })
  }
})
