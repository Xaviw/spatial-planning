import 'alova/GlobalFetch'
import { request } from '@sp/shared/utils'
import type { MenuItem, MenuMoveParams } from '#/business'

export function getMenu(
  /** 是否筛选掉禁用的菜单 */
  filter: boolean,
  errorMessageMode: RequestMeta['errorMessageMode'] = 'none',
) {
  const method = request.Get<MenuItem[]>('/menu', { params: { filter } })
  method.meta = { errorMessageMode }
  return method
}

export function addMenu(data: Pick<MenuItem, 'parentId' | 'name' | 'status'>) {
  return request.Post<string>('/menu', data)
}

export function setMenu({
  id,
  name,
  status,
}: Pick<MenuItem, 'id' | 'name' | 'status'>) {
  return request.Put(`/menu/${id}`, { name, status })
}

export function removeMenu(id: string) {
  return request.Delete(`/menu/${id}`)
}

export function moveMenu({
  currentIndex,
  id,
  currentParentId,
}: MenuMoveParams) {
  return request.Post(`/menu/move/${id}`, { currentIndex, currentParentId })
}
