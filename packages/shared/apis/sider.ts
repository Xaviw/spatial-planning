import { request } from '../utils/request'
import type { SiderItem } from '#/client'

export function getSider(position: 'left' | 'right', menuId: string) {
  return request.Get<SiderItem[]>('/sider', {
    params: { position, menuId },
    localCache: 100 * 60 * 5,
  })
}
