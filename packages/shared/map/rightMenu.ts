import type { MapEvent } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

interface OverlayRightMenu {
  edit: Fn
  copy: Fn
  move: Fn
  remove: Fn
  hide: Fn
  moveUp: Fn
  moveDown: Fn
  rightClick: Fn<[MapEvent]>
  click: Fn<[MapEvent]>
}

let contextMenu: AMap.ContextMenu

export function rightMenu(handlers: OverlayRightMenu) {
  return (overlay: AMap.Eventable) => {
    if (!contextMenu) {
      contextMenu = new window.AMap.ContextMenu()
      contextMenu.addItem(
        '编辑',
        () => {
          handlers.edit()
          contextMenu.close()
        },
        0,
      )
      contextMenu.addItem(
        '复制',
        () => {
          handlers.copy()
          contextMenu.close()
        },
        0,
      )
      contextMenu.addItem(
        '移动到...图层',
        () => {
          handlers.move()
          contextMenu.close()
        },
        0,
      )
      contextMenu.addItem(
        '删除',
        () => {
          handlers.remove()
          contextMenu.close()
        },
        0,
      )
      contextMenu.addItem(
        '隐藏',
        () => {
          handlers.hide()
          contextMenu.close()
        },
        0,
      )
      contextMenu.addItem(
        '上移一层',
        () => {
          handlers.moveUp()
          contextMenu.close()
        },
        0,
      )
      contextMenu.addItem(
        '下移一层',
        () => {
          handlers.moveDown()
          contextMenu.close()
        },
        0,
      )
    }

    overlay.on('rightclick', (e: MapEvent) => {
      handlers.rightClick(e)
      contextMenu.open(e.target._map, [e.lnglat.lng, e.lnglat.lat])
    })

    overlay.on('click', (e: MapEvent) => {
      handlers.click(e)
    })
  }
}
