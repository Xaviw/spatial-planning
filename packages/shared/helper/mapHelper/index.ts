import { createMarker } from './marker'
import type { OverlayItem, ReactiveOverlay, OverlayType } from '#/request'

let contextMenu: AMap.ContextMenu

const strategies: Record<OverlayType, ReactiveOverlay> = {
  Marker: createMarker,
} as any

export function createLayer(data: OverlayItem[], map?: AMap.Map) {
  const list = new Map()
  if (!contextMenu) {
    contextMenu = createContextMenu()!
  }

  for (const item of data) {
    const handler = strategies[item.type]?.(item.props, map)
    handler.instance.on('rightclick', (e: any) => {
      console.log('e: ', e)
      contextMenu.open(e.map, e.position)
    })
    handler && list.set(item.id, handler)
  }

  return list
}

function createContextMenu() {
  if (!AMap?.ContextMenu) return
  const contextMenu = new AMap.ContextMenu()
  contextMenu.addItem('编辑', () => {}, 0)
  contextMenu.addItem('复制', () => {}, 0)
  contextMenu.addItem('移动至...图层', () => {}, 0)
  contextMenu.addItem('删除', () => {}, 0)
  return contextMenu
}
