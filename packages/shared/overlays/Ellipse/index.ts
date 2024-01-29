import { overlayFactory, toolManage, useMapStore } from '@sp/shared/helpers/map'
import { message } from 'ant-design-vue'
import { clone, equals } from 'ramda'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  EllipseProps,
  LayerItem,
  OverlayItem,
  OverlayInstance,
  OverlayType,
  OverlayModule,
} from '#/overlays'
import type { AMap } from '@amap/amap-jsapi-types'

function synchronization(mapStore: ReturnType<typeof useMapStore>) {
  if (!(mapStore.activeInstance instanceof window.AMap.Ellipse)) return

  const center = mapStore.activeInstance.getCenter()
  const radius = mapStore.activeInstance.getRadius()

  const newCenter: AMap.Vector2 = [center.lng, center.lat]

  if (!equals((mapStore.editData!.props as EllipseProps).center, newCenter)) {
    ;(mapStore.editData!.props as EllipseProps).center = newCenter
  }

  if (!equals((mapStore.editData!.props as EllipseProps).radius, radius)) {
    ;(mapStore.editData!.props as EllipseProps).radius = radius
  }
}

export default {
  type: 'Ellipse',
  sort: 10,
  defaultZIndex: 10,
  overlay: Overlay,
  form: Form,
  name: '椭圆形',
  icon: 'i-mdi:ellipse-outline',
  drawHelp: [
    '从圆心位置点击并拖动，松开鼠标后完成绘制',
    '先绘制圆形后再在编辑中调整弧度',
    '不能连续绘制',
  ],
  editHelp: ['拖动边缘控制点调整尺寸', '拖动中心控制点移动位置'],
  handleDraw: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (open) {
      mapStore.mousetool?.circle({})
    } else {
      mapStore.mousetool?.close(false)
    }
  },
  afterDraw: (
    mapStore: ReturnType<typeof useMapStore>,
    obj: OverlayInstance['Circle'],
  ) => {
    const radius = obj.getRadius()
    if (radius === 0) {
      message.warn('请拖动扩展椭圆形面积！')
      return
    }
    const center = obj.getCenter()
    const newEllipse = overlayFactory('Ellipse', mapStore.activeLayer!, {
      center: [center.lng, center.lat],
      radius: [radius, radius],
    })
    mapStore.mapData[mapStore.activeLayerIndex!].overlays.push(newEllipse)
    mapStore.map?.remove(obj)
    toolManage(mapStore)
  },
  handleEdit: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (!(mapStore.activeInstance instanceof window.AMap.Ellipse)) return

    if (open) {
      mapStore.ellipseEditor?.setTarget(mapStore.activeInstance)
      mapStore.ellipseEditor?.open()
      ;(mapStore.ellipseEditor as any).on(
        'addnode',
        synchronization.bind(null, mapStore),
      )
      ;(mapStore.ellipseEditor as any).on(
        'adjust',
        synchronization.bind(null, mapStore),
      )
      ;(mapStore.ellipseEditor as any).on(
        'move',
        synchronization.bind(null, mapStore),
      )
    } else {
      ;(mapStore.ellipseEditor as any).clearEvents()
      mapStore.ellipseEditor?.close()
    }
  },
  cancelEdit: (
    mapStore: ReturnType<typeof useMapStore>,
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Ellipse'>,
  ) => {
    if (
      (mapStore.editData!.props as EllipseProps).center &&
      (mapStore.editData!.props as EllipseProps).radius
    ) {
      if (
        !equals(
          (mapStore.editData!.props as EllipseProps).center,
          (mapStore.activeOverlay!.props as EllipseProps).center,
        )
      ) {
        ;(layer.overlays[index].props as EllipseProps).center = clone(
          (overlay.props as EllipseProps).center,
        )
      }
      if (
        !equals(
          (mapStore.editData!.props as EllipseProps).radius,
          (mapStore.activeOverlay!.props as EllipseProps).radius,
        )
      ) {
        ;(layer.overlays[index].props as EllipseProps).radius = clone(
          (overlay.props as EllipseProps).radius,
        )
      }
    }
  },
} as OverlayModule
