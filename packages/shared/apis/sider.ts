import 'alova/GlobalFetch'
import { request } from '@sp/shared/utils'
import type { SiderPosition, SiderItem, OperationItem } from '#/business'

export interface GetSiderParams {
  menuId: string
  filter: boolean
  position: SiderPosition
}

export function getSider(params: GetSiderParams) {
  return request.Get<SiderItem[]>('/sider', { params })
}

export function setSider(data: OperationItem<Partial<SiderItem>>[]) {
  return request.Post<boolean>('/sider', data)
}
