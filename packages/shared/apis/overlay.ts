import 'alova/GlobalFetch'
import { request } from '@sp/shared/utils'
import type { OverlayItem, RequestMeta } from '#/request'

export function getOverlay(menuId: string, filter: boolean) {
  const method = request.Get<OverlayItem[]>('/overlay', {
    params: { filter, menuId },
  })
  method.meta = { errorMessageMode: 'none' } as RequestMeta
  return method
}

export function setOverlay(menuId: string, data: any) {
  return request.Post('/overlay', { menuId, data })
}
