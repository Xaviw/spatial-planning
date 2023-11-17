import { request } from '../utils/request'
import type { Menu } from '#/client'

export function getMenu() {
  return request.Get<Menu[]>('/menu')
}
