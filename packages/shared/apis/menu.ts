import { request } from '../utils/request'
import type { MenuItem } from '#/client'
import type { RequestMeta } from '#/request'

export function getMenu(
  filter: boolean,
  errorMessageMode: RequestMeta['errorMessageMode'] = 'none',
) {
  const method = request.Get<MenuItem[]>('/menu', { params: { filter } })
  method.meta = { errorMessageMode }
  return method
}

export function addMenu(data: Omit<MenuItem, 'id'>) {
  return request.Post<boolean>('/menu', data)
}

export function setMenu(data: MenuItem) {
  return request.Put<boolean>('/menu', data)
}

export function removeMenu(id: string) {
  return request.Delete<boolean>('/menu', { id })
}
