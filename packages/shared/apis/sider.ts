import 'alova/GlobalFetch'
import { request } from '@sp/shared/utils'
import type { SiderPosition, SiderItem } from '#/request'
import type { Patches } from 'mutative'

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

export function setSider(data: Patches) {
  return request.Post<boolean>('/sider', data)
}
