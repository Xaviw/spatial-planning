import 'alova/GlobalFetch'
import { request } from '@sp/shared/utils'

export function login(param: { name: string; password: string }) {
  return request.Post<{ name: string; id: string }>('/user/login', param)
}

export function updateInfo({
  id,
  name,
  oldPassword,
  password,
}: {
  id: string
  name: string
  oldPassword: string
  password: string
}) {
  return request.Put(`/user/${id}`, { name, oldPassword, password })
}
