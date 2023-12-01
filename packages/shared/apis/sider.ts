import { request } from '../utils/request'
import type { SiderPosition, SiderItem } from '#/request'

export interface GetSiderParams {
  menuId?: string
  filter: boolean
  position: SiderPosition
}

export function getSider(params: GetSiderParams) {
  return request.Get<SiderItem[]>('/sider', {
    params,
    localCache: 100 * 60 * 5,
  })
}
