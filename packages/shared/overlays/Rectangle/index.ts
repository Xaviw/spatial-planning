import { overlayFactory, toolManage, useMapStore } from '@sp/shared/helpers/map'
import { isEqual } from '@sp/shared/utils'
import { message } from 'ant-design-vue'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  RectangleProps,
  LayerItem,
  OverlayItem,
  OverlayInstance,
  OverlayType,
  OverlayModule,
} from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

function synchronization(mapStore: ReturnType<typeof useMapStore>) {
  if (!(mapStore.activeInstance instanceof window.AMap.Rectangle)) return

  const bounds = mapStore.activeInstance.getBounds()
  const sw = bounds!.getSouthWest()
  const ne = bounds!.getNorthEast()
  const newBounds: AMap.Vector2[] = [
    [sw.lng, sw.lat],
    [ne.lng, ne.lat],
  ]

  if (
    !isEqual((mapStore.editData!.props as RectangleProps).bounds, newBounds)
  ) {
    ;(mapStore.editData!.props as RectangleProps).bounds = newBounds
  }
}

export default {
  type: 'Rectangle',
  sort: 8,
  defaultZIndex: 10,
  overlay: Overlay,
  form: Form,
  name: '矩形',
  icon: 'i-mdi:vector-rectangle',
  drawHelp: ['从目标位置点击并拖动，松开鼠标后完成绘制', '不能连续绘制'],
  editHelp: ['拖动控制点移动顶点位置', '拖动非控制点移动整体位置'],
  handleDraw: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (open) {
      mapStore.mousetool?.rectangle({})
    } else {
      mapStore.mousetool?.close(false)
    }
  },
  afterDraw: (
    mapStore: ReturnType<typeof useMapStore>,
    obj: OverlayInstance['Rectangle'],
  ) => {
    const bounds = obj.getBounds()!
    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()
    if (sw.lng === ne.lng && sw.lat === ne.lat) {
      message.warn('请拖动扩展矩形面积！')
      return
    }
    const newRectangle = overlayFactory('Rectangle', mapStore.activeLayer!, {
      bounds: [
        [sw.lng, sw.lat],
        [ne.lng, ne.lat],
      ],
    })
    mapStore.mapData[mapStore.activeLayerIndex!].overlays.push(newRectangle)
    mapStore.map?.remove(obj)
    toolManage(mapStore)
  },
  handleEdit: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (!(mapStore.activeInstance instanceof window.AMap.Rectangle)) return

    if (open) {
      mapStore.rectangleEditor?.setTarget(mapStore.activeInstance)
      mapStore.rectangleEditor?.open()
      mapStore.activeInstance.setOptions({ cursor: 'grab' })
      ;(mapStore.rectangleEditor as any).on(
        'addnode',
        synchronization.bind(null, mapStore),
      )
      ;(mapStore.rectangleEditor as any).on(
        'adjust',
        synchronization.bind(null, mapStore),
      )
      ;(mapStore.rectangleEditor as any).on(
        'move',
        synchronization.bind(null, mapStore),
      )
    } else {
      mapStore.rectangleEditor?.close()
      mapStore.activeInstance.setOptions({ cursor: 'pointer' })
      ;(mapStore.rectangleEditor as any).clearEvents()
    }
  },
  cancelEdit: (
    mapStore: ReturnType<typeof useMapStore>,
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Rectangle'>,
  ) => {
    if (
      (mapStore.editData!.props as RectangleProps).bounds &&
      !isEqual(
        (mapStore.editData!.props as RectangleProps).bounds,
        (mapStore.activeOverlay!.props as RectangleProps).bounds,
      )
    ) {
      ;(layer.overlays[index].props as RectangleProps).bounds = structuredClone(
        (overlay.props as RectangleProps).bounds,
      )
    }
  },
} as OverlayModule
