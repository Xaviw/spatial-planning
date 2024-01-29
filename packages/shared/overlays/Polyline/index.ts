import { overlayFactory, useMapStore } from '@sp/shared/helpers/map'
import { message } from 'ant-design-vue'
import { clone, equals } from 'ramda'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  PolylineProps,
  LayerItem,
  OverlayItem,
  OverlayInstance,
  OverlayType,
  OverlayModule,
} from '#/overlays'
import type { AMap } from '@amap/amap-jsapi-types'

function synchronization(mapStore: ReturnType<typeof useMapStore>) {
  if (!(mapStore.activeInstance instanceof window.AMap.Polyline)) return

  const path = mapStore.activeInstance.getPath() as AMap.LngLat[]
  const newPath = path.map((item): AMap.Vector2 => [item.lng, item.lat])

  if (!equals((mapStore.editData!.props as PolylineProps).path, newPath)) {
    ;(mapStore.editData!.props as PolylineProps).path = newPath
  }
}

export default {
  type: 'Polyline',
  sort: 5,
  defaultZIndex: 10,
  overlay: Overlay,
  form: Form,
  name: '折线',
  icon: 'i-material-symbols:polyline-outline',
  drawHelp: ['单击目标位置新增端点，双击结束绘制'],
  editHelp: [
    '拖动白色控制点移动端点位置',
    '拖动蓝色控制点新增端点',
    '单击白色控制点删除端点',
    '拖动非控制点移动整体位置',
  ],
  handleDraw: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (open) {
      mapStore.mousetool?.polyline({})
    } else {
      mapStore.mousetool?.close(false)
    }
  },
  afterDraw: (
    mapStore: ReturnType<typeof useMapStore>,
    obj: OverlayInstance['Polyline'],
  ) => {
    const path = obj.getPath() as AMap.LngLat[]
    if (path.length < 2) {
      message.warn('请至少添加两个端点！')
      mapStore.map?.remove(obj)
      return
    }

    const newPolyline = overlayFactory('Polyline', mapStore.activeLayer!, {
      path: path.map((item): AMap.Vector2 => [item.lng, item.lat]),
    })
    mapStore.mapData[mapStore.activeLayerIndex!].overlays.push(newPolyline)
    mapStore.map?.remove(obj)
  },
  handleEdit: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (!(mapStore.activeInstance instanceof window.AMap.Polyline)) return

    if (open) {
      mapStore.polylineEditor?.setTarget(mapStore.activeInstance)
      mapStore.polylineEditor?.open()
      mapStore.activeInstance.setOptions({ cursor: 'grab', draggable: true })
      mapStore.activeInstance.on(
        'dragend',
        synchronization.bind(null, mapStore),
      )
      ;(mapStore.polylineEditor as any).on(
        'addnode',
        synchronization.bind(null, mapStore),
      )
      ;(mapStore.polylineEditor as any).on(
        'adjust',
        synchronization.bind(null, mapStore),
      )
    } else {
      mapStore.activeInstance.clearEvents('dragend')
      mapStore.polylineEditor?.close()
      mapStore.activeInstance.setOptions({
        cursor: 'pointer',
        draggable: false,
      })
      ;(mapStore.polylineEditor as any).clearEvents()
    }
  },
  cancelEdit: (
    mapStore: ReturnType<typeof useMapStore>,
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Polyline'>,
  ) => {
    if (
      (mapStore.editData!.props as PolylineProps).path &&
      !equals(
        (mapStore.editData!.props as PolylineProps).path,
        (mapStore.activeOverlay!.props as PolylineProps).path,
      )
    ) {
      ;(layer.overlays[index].props as PolylineProps).path = clone(
        overlay.props.path,
      )
    }
  },
} as OverlayModule
