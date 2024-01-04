import 'alova/GlobalFetch'
import { request } from '@sp/shared/utils'
import type {
  OverlayItem,
  OperationItem,
  LayerItem,
  MaterialItem,
  OverlayType,
} from '#/business'
import type { RequestMeta } from '#/request'

export interface GetMapParams {
  menuId: string
  filter: boolean
}

export interface SetMapParams {
  layers: OperationItem<Omit<LayerItem<OverlayType>, 'overlays'>>[]
  overlays: OperationItem<Omit<OverlayItem<OverlayType>, 'details'>>[]
  details: OperationItem<MaterialItem>[]
}

export function getMap(menuId: string, filter: boolean) {
  const method = request.Get<LayerItem<OverlayType>[]>('/map', {
    params: { filter, menuId },
  })
  method.meta = { errorMessageMode: 'none' } as RequestMeta
  return method
}

export function setMap(data: SetMapParams) {
  return request.Post('/map', data)
}
