import { request } from '../utils/request'
import type { Menu } from '#/client'

export function getMenu() {
  return request.get<Menu[]>('/menu')
}
