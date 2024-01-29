import { overlayFactory, toolManage, useMapStore } from '@sp/shared/helpers/map'
import { message } from 'ant-design-vue'
import { clone, equals } from 'ramda'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  CircleProps,
  LayerItem,
  OverlayItem,
  OverlayInstance,
  OverlayType,
  OverlayModule,
} from '#/overlays'
import type { AMap } from '@amap/amap-jsapi-types'

function synchronization(mapStore: ReturnType<typeof useMapStore>) {
  if (!(mapStore.activeInstance instanceof window.AMap.Circle)) return

  const center = mapStore.activeInstance.getCenter()
  const radius = mapStore.activeInstance.getRadius()

  const newCenter: AMap.Vector2 = [center.lng, center.lat]

  if (!equals((mapStore.editData!.props as CircleProps).center, newCenter)) {
    ;(mapStore.editData!.props as CircleProps).center = newCenter
  }

  if (!equals((mapStore.editData!.props as CircleProps).radius, radius)) {
    ;(mapStore.editData!.props as CircleProps).radius = radius
  }
}

export default {
  type: 'Circle',
  sort: 9,
  defaultZIndex: 10,
  overlay: Overlay,
  form: Form,
  name: '圆形',
  icon: 'i-mdi:circle-outline',
  drawHelp: ['从圆心位置点击并拖动，松开鼠标后完成绘制', '不能连续绘制'],
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
      message.warn('请拖动扩展圆形面积！')
      return
    }
    const center = obj.getCenter()
    const newCircle = overlayFactory('Circle', mapStore.activeLayer!, {
      center: [center.lng, center.lat],
      radius,
    })
    mapStore.mapData[mapStore.activeLayerIndex!].overlays.push(newCircle)
    mapStore.map?.remove(obj)
    toolManage(mapStore)
  },
  handleEdit: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (!(mapStore.activeInstance instanceof window.AMap.Circle)) return

    if (open) {
      mapStore.circleEditor?.setTarget(mapStore.activeInstance)
      mapStore.circleEditor?.open()
      ;(mapStore.circleEditor as any).on(
        'addnode',
        synchronization.bind(null, mapStore),
      )
      ;(mapStore.circleEditor as any).on(
        'adjust',
        synchronization.bind(null, mapStore),
      )
      ;(mapStore.circleEditor as any).on(
        'move',
        synchronization.bind(null, mapStore),
      )
    } else {
      ;(mapStore.circleEditor as any).clearEvents()
      mapStore.circleEditor?.close()
    }
  },
  cancelEdit: (
    mapStore: ReturnType<typeof useMapStore>,
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Circle'>,
  ) => {
    if (
      (mapStore.editData!.props as CircleProps).center &&
      (mapStore.editData!.props as CircleProps).radius
    ) {
      if (
        !equals(
          (mapStore.editData!.props as CircleProps).center,
          (mapStore.activeOverlay!.props as CircleProps).center,
        )
      ) {
        ;(layer.overlays[index].props as CircleProps).center = clone(
          (overlay.props as CircleProps).center,
        )
      }
      if (
        !equals(
          (mapStore.editData!.props as CircleProps).radius,
          (mapStore.activeOverlay!.props as CircleProps).radius,
        )
      ) {
        layer.overlays[index].props = {
          ...overlay.props,
        }
      }
    }
  },
} as OverlayModule
