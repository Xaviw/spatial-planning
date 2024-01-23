import { login as loginApi, updateInfo } from '@sp/shared/apis'
import { useRequest } from 'alova'
import { message } from 'ant-design-vue'

export const useUserStore = defineStore('user', () => {
  const username = ref<string>(localStorage.getItem('username') || '')
  const id = ref<string>(localStorage.getItem('id') || '')
  const router = useRouter()

  const {
    send: login,
    loading: loginLoading,
    onSuccess: onLoginSuccess,
  } = useRequest(param => loginApi(param), { immediate: false })

  const {
    send: update,
    loading: updateLoading,
    onSuccess: onUpdateSuccess,
  } = useRequest(param => updateInfo(param), { immediate: false })

  onLoginSuccess(({ data }) => {
    message.success('登录成功!')
    username.value = data.name
    id.value = data.id
    localStorage.setItem('id', id.value)
    localStorage.setItem('username', username.value)
    router.replace({ name: 'home' })
  })

  onUpdateSuccess(() => {
    message.success('修改成功，请重新登录!')
    logout()
  })

  function logout() {
    username.value = ''
    localStorage.removeItem('Access-Token')
    localStorage.removeItem('Refresh-Token')
    router.replace({ name: 'login' })
  }

  return {
    login,
    loginLoading,
    update,
    updateLoading,
    logout,
    username,
    id,
  }
})
