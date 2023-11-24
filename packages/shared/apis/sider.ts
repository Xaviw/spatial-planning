import { request } from '../utils/request'
import type { SiderPosition, SiderItem } from '#/client'

export function getSider(params: {
  menuId: string
  filter: boolean
  position: SiderPosition
}) {
  return request.Get<SiderItem[]>('/sider', {
    params,
    localCache: 100 * 60 * 5,
  })
}
