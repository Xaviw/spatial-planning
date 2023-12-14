import 'alova/GlobalFetch'
import { request } from '../utils/request'
import type {
  LegendTypeItem,
  LegendItem,
  LegendEditItem,
  LegendRequestItem,
} from '#/request'

export function getShowSingleType() {
  return request.Get<boolean>('/legendType/showSingle')
}

export function setShowSingleType(value: boolean) {
  return request.Put<boolean>('/legendType/showSingle', { value })
}

export function getLegendType() {
  return request.Get<LegendTypeItem[]>('/legendType')
}

export function addLegendType(data: Pick<LegendTypeItem, 'name'>) {
  return request.Post<string>('/legendType', data)
}

export function setLegendType(data: LegendTypeItem) {
  return request.Put<boolean>('/legendType', data)
}

export function removeLegendType(id: string) {
  return request.Delete<boolean>('/legendType', { id })
}

export function moveLegendType(data: { oldIndex: number; newIndex: number }) {
  const method = request.Post<boolean>('/legendType/move', data)
  method.meta = { errorMessageMode: 'none' }
  return method
}

export function getLegend() {
  return request.Get<LegendEditItem[], LegendItem[]>('/legend', {
    transformData(data) {
      return data.map(item => ({
        ...item,
        type: { label: item.type.name, value: item.type.id },
      }))
    },
  })
}

export function addLegend(data: Omit<LegendRequestItem, 'id'>) {
  return request.Post<string>('/legend', data)
}

export function setLegend(data: LegendRequestItem) {
  return request.Put<boolean>('/legend', data)
}

export function removeLegend(id: string) {
  return request.Delete<boolean>('/legend', { id })
}

export function moveLegend(data: { oldIndex: number; newIndex: number }) {
  return request.Post<boolean>('/legend/move', data)
}
