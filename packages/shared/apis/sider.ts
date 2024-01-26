import 'alova/GlobalFetch'
import { request } from '@sp/shared/utils'
import type { SetSiderParams, SiderItem, GetSiderParams } from '#/business'

export function getSider(params: GetSiderParams) {
  return request.Get<SiderItem[]>('/sider', { params })
}

export function setSider(data: SetSiderParams) {
  return request.Post('/sider', data)
}
