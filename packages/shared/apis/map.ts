import 'alova/GlobalFetch'
import { request } from '@sp/shared/utils'
import type { LayerItem, SetMapParams } from '#/business'

export function getMap(menuId: string, filter: boolean) {
  const method = request.Get<LayerItem[]>('/map', {
    params: { filter, menuId },
  })
  method.meta = { errorMessageMode: 'none' } as RequestMeta
  return method
}

export function setMap(data: SetMapParams) {
  return request.Post('/map', data)
}
