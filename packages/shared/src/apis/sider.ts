import { request } from '../utils/request'
import type { SiderItem } from '#/client'

export function getSider(position: 'left' | 'right', menuId: string) {
  return request.get<SiderItem[]>('/sider', { params: { position, menuId } })
}
