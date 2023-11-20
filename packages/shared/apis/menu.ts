import { request } from '../utils/request'
import type { Menu } from '#/client'
import type { RequestMeta } from '#/request'

export function getMenu(errorMessageMode?: RequestMeta['errorMessageMode']) {
  const method = request.Get<Menu[]>('/menu')
  method.meta = {
    errorMessageMode: errorMessageMode || 'none',
  }
  return method
}

export function setMenu(data: any) {
  return request.Post<any>('/menu', data)
}
