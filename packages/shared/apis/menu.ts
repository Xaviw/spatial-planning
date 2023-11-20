import { request } from '../utils/request'
import type { Menu } from '#/client'

export function getMenu() {
  const method = request.Get<Menu[]>('/menu')
  method.meta = {
    errorMessageMode: 'none',
  }
  return method
}
