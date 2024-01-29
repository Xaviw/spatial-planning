import { overlayFactory, useMapStore } from '@sp/shared/helpers/map'
import { message } from 'ant-design-vue'
import { clone, equals } from 'ramda'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  BezierCurveProps,
  LayerItem,
  OverlayInstance,
  OverlayItem,
  OverlayModule,
  OverlayType,
} from '#/overlays'
import type { AMap } from '@amap/amap-jsapi-types'

function synchronization(mapStore: ReturnType<typeof useMapStore>) {
  if (!(mapStore.activeInstance instanceof window.AMap.BezierCurve)) return

  const path = mapStore.activeInstance.getPath() as AMap.Vector[]

  if (!equals((mapStore.editData!.props as BezierCurveProps).path, path)) {
    ;(mapStore.editData!.props as BezierCurveProps).path = path
  }
}

export default {
  type: 'BezierCurve',
  sort: 6,
  defaultZIndex: 10,
  overlay: Overlay,
  form: Form,
  name: '曲线',
  icon: 'i-bi:bezier2',
  drawHelp: [
    '单击目标位置新增端点，双击结束绘制',
    '先绘制折线后再在编辑中新增弧度控制点',
  ],
  editHelp: [
    '拖动白色控制点移动端点位置',
    '右击白色控制点增加弧度控制点(每个端点最多两个弧度控制点)',
    '拖动弧度控制点调整线条弧度',
    '拖动蓝色控制点新增端点(删除弧度控制点才会显示)',
    '单击删除端点',
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

    const newPolyline = overlayFactory('BezierCurve', mapStore.activeLayer!, {
      path: path.map((item): AMap.Vector2 => [item.lng, item.lat]),
    })
    mapStore.mapData[mapStore.activeLayerIndex!].overlays.push(newPolyline)
    mapStore.map?.remove(obj)
  },
  handleEdit: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (!(mapStore.activeInstance instanceof window.AMap.BezierCurve)) return

    if (open) {
      mapStore.bezierCurveEditor?.setTarget(mapStore.activeInstance)
      mapStore.bezierCurveEditor?.open()
      mapStore.activeInstance.setOptions({ cursor: 'grab', draggable: true })
      mapStore.activeInstance.on(
        'dragend',
        synchronization.bind(null, mapStore),
      )
      ;(mapStore.bezierCurveEditor as any).on(
        'addnode',
        synchronization.bind(null, mapStore),
      )
      ;(mapStore.bezierCurveEditor as any).on(
        'adjust',
        synchronization.bind(null, mapStore),
      )
      ;(mapStore.bezierCurveEditor as any).on(
        'removenode',
        synchronization.bind(null, mapStore),
      )
    } else {
      mapStore.activeInstance.clearEvents('dragend')
      ;(mapStore.bezierCurveEditor as any).clearEvents()
      mapStore.bezierCurveEditor?.close()
      mapStore.bezierCurveEditor?.setTarget()
      mapStore.activeInstance.setOptions({
        cursor: 'pointer',
        draggable: false,
      })
    }
  },
  cancelEdit: (
    mapStore: ReturnType<typeof useMapStore>,
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Marker'>,
  ) => {
    if (
      (mapStore.editData!.props as BezierCurveProps).path &&
      !equals(
        (mapStore.editData!.props as BezierCurveProps).path,
        (mapStore.activeOverlay!.props as BezierCurveProps).path,
      )
    ) {
      ;(layer.overlays[index].props as BezierCurveProps).path = clone(
        (overlay.props as BezierCurveProps).path,
      )
    }
  },
} as OverlayModule
