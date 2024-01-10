import { overlayFactory, useMapStore } from '@sp/shared/map'
import { message } from 'ant-design-vue'
import { cloneDeep, isEqual } from 'lodash-es'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  PolygonProps,
  LayerItem,
  OverlayItem,
  OverlayInstance,
  OverlayType,
  OverlayModule,
} from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

function synchronization(mapStore: ReturnType<typeof useMapStore>) {
  if (!(mapStore.activeInstance instanceof window.AMap.Polygon)) return

  const path = mapStore.activeInstance.getPath() as AMap.LngLat[]
  const newPath = path.map((item): AMap.Vector2 => [item.lng, item.lat])

  if (!isEqual((mapStore.editData!.props as PolygonProps).path, newPath)) {
    ;(mapStore.editData!.props as PolygonProps).path = newPath
  }
}

export default {
  type: 'Polygon',
  sort: 7,
  defaultZIndex: 10,
  overlay: Overlay,
  form: Form,
  name: '多边形',
  icon: 'i-ph:polygon',
  drawHelp: ['单击目标位置新增顶点，双击结束绘制'],
  editHelp: [
    '拖动白色控制点移动顶点位置',
    '拖动蓝色控制点新增顶点',
    '单击白色控制点删除顶点',
    '拖动非控制点移动整体位置',
  ],
  handleDraw: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (open) {
      mapStore.mousetool?.polygon({})
    } else {
      mapStore.mousetool?.close(false)
    }
  },
  afterDraw: (
    mapStore: ReturnType<typeof useMapStore>,
    obj: OverlayInstance['Polygon'],
  ) => {
    const path = obj.getPath() as AMap.LngLat[]
    if (path.length < 3) {
      message.warn('请至少添加三个端点！')
      mapStore.map?.remove(obj)
      return
    }

    const newPolygon = overlayFactory('Polygon', mapStore.activeLayer!, {
      path: path.map((item): AMap.Vector2 => [item.lng, item.lat]),
    })
    mapStore.mapData[mapStore.activeLayerIndex!].overlays.push(newPolygon)
    mapStore.map?.remove(obj)
  },
  handleEdit: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (!(mapStore.activeInstance instanceof window.AMap.Polygon)) return

    if (open) {
      mapStore.polygonEditor?.setTarget(mapStore.activeInstance)
      mapStore.polygonEditor?.open()
      mapStore.activeInstance.setOptions({ cursor: 'grab' })
      ;(mapStore.polygonEditor as any).on(
        'addnode',
        synchronization.bind(null, mapStore),
      )
      ;(mapStore.polygonEditor as any).on(
        'removenode',
        synchronization.bind(null, mapStore),
      )
      ;(mapStore.polygonEditor as any).on(
        'adjust',
        synchronization.bind(null, mapStore),
      )
      ;(mapStore.polygonEditor as any).on(
        'move',
        synchronization.bind(null, mapStore),
      )
    } else {
      ;(mapStore.polygonEditor as any).clearEvents()
      mapStore.polygonEditor?.close()
      mapStore.activeInstance.setOptions({ cursor: 'pointer' })
    }
  },
  cancelEdit: (
    mapStore: ReturnType<typeof useMapStore>,
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Polygon'>,
  ) => {
    if (
      (mapStore.editData!.props as PolygonProps).path &&
      !isEqual(
        (mapStore.editData!.props as PolygonProps).path,
        (mapStore.activeOverlay!.props as PolygonProps).path,
      )
    ) {
      ;(layer.overlays[index].props as PolygonProps).path = cloneDeep(
        overlay.props.path,
      )
    }
  },
} as OverlayModule
