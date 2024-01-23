import 'alova/GlobalFetch'
import { request } from '@sp/shared/utils'

export function login(param: { name: string; password: string }) {
  return request.Post<{ name: string; id: string }>('/user/login', param)
}

export function updateInfo(param: {
  name: string
  oldPassword: string
  password: string
}) {
  return request.Put('/user', param)
}
