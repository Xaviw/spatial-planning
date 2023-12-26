import 'alova/GlobalFetch'
import { request } from '@sp/shared/utils'
import type {
  OverlayItem,
  RequestMeta,
  OperationItem,
  LayerItem,
  MaterialItem,
} from '#/request'

export interface GetMapParams {
  menuId: string
  filter: boolean
}

export interface SetMapParams {
  layers: OperationItem<Omit<LayerItem, 'overlays'>>[]
  overlays: OperationItem<Omit<OverlayItem, 'details'>>[]
  details: OperationItem<MaterialItem>[]
}

export function getMap(menuId: string, filter: boolean) {
  const method = request.Get<LayerItem[]>('/map', {
    params: { filter, menuId },
  })
  method.meta = { errorMessageMode: 'none' } as RequestMeta
  return method
}

export function setMap(menuId: string, data: SetMapParams) {
  return request.Post('/map', { menuId, data })
}
