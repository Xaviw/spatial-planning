import { request } from '../utils/request'
import type { MenuItem } from '#/client'
import type { RequestMeta } from '#/request'

export function getMenu<T = MenuItem[]>(
  /** 是否筛选掉禁用的菜单 */
  filter: boolean,
  errorMessageMode: RequestMeta['errorMessageMode'] = 'none',
) {
  const method = request.Get<T>('/menu', { params: { filter } })
  method.meta = { errorMessageMode }
  return method
}

export function addMenu(data: Pick<MenuItem, 'parentId' | 'name' | 'status'>) {
  return request.Post<string>('/menu', data)
}

export function setMenu(data: Pick<MenuItem, 'id' | 'name' | 'status'>) {
  return request.Put<boolean>('/menu', data)
}

export function removeMenu(id: string) {
  return request.Delete<boolean>('/menu', { id })
}

export function moveMenu(data: {
  oldParentId?: string
  oldIndex: number
  currentParentId?: string
  currentIndex: number
}) {
  return request.Post<boolean>('/menu/move', data)
}
