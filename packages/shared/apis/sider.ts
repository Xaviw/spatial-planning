import 'alova/GlobalFetch'
import { request } from '@sp/shared/utils'
import type { SiderPosition, SiderItem, OperationItem } from '#/business'

export interface GetSiderParams {
  menuId: string
  filter: boolean
  position: SiderPosition
}

export function getSider(params: GetSiderParams) {
  return request.Get<SiderItem[]>('/sider', {
    params,
    localCache: 100 * 60 * 5,
  })
}

export function setSider(data: OperationItem<SiderItem>[]) {
  return request.Post<boolean>('/sider', data)
}
