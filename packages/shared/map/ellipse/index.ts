import { overlayFactory, useMapStore } from '@sp/shared/map'
import { cloneDeep, isEqual } from 'lodash-es'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  EllipseProps,
  LayerItem,
  OverlayItem,
  OverlayInstance,
  OverlayType,
} from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const mapStore = useMapStore()
const {
  activeInstance,
  activeOverlay,
  editData,
  mapData,
  activeLayerIndex,
  activeLayer,
  mousetool,
  ellipseEditor,
} = storeToRefs(mapStore)

function synchronization() {
  if (!(activeInstance.value instanceof window.AMap.Ellipse)) return

  const center = activeInstance.value.getCenter()
  const radius = activeInstance.value.getRadius()

  const newCenter: AMap.Vector2 = [center.lng, center.lat]

  if (!isEqual((editData.value!.props as EllipseProps).center, newCenter)) {
    ;(editData.value!.props as EllipseProps).center = newCenter
  }

  if (!isEqual((editData.value!.props as EllipseProps).radius, radius)) {
    ;(editData.value!.props as EllipseProps).radius = radius
  }
}

export default {
  type: 'Ellipse',
  sort: 9,
  overlay: Overlay,
  form: Form,
  name: '椭圆形',
  icon: 'i-mdi:ellipse-outline',
  drawHelp: [
    '从圆心位置点击并拖动，松开鼠标后完成绘制',
    '先绘制圆形后再在编辑中调整弧度',
  ],
  editHelp: ['拖动边缘控制点调整尺寸', '拖动中心控制点移动位置'],
  beforeDraw: () => {
    mousetool.value?.circle({})
  },
  afterDraw: (obj: OverlayInstance['Circle']) => {
    const center = obj.getCenter()
    const radius = obj.getRadius()
    const newEllipse = overlayFactory('Ellipse', activeLayer.value!, {
      center: [center.lng, center.lat],
      radius: [radius, radius],
    })
    mapData.value[activeLayerIndex.value!].overlays.push(newEllipse)
  },
  handleEdit: (open: boolean) => {
    if (!(activeInstance.value instanceof window.AMap.Ellipse)) return

    if (open) {
      ellipseEditor.value?.setTarget(activeInstance.value)
      ellipseEditor.value?.open()
      ;(ellipseEditor.value as any).on('addnode', synchronization)
      ;(ellipseEditor.value as any).on('adjust', synchronization)
      ;(ellipseEditor.value as any).on('move', synchronization)
    } else {
      ;(ellipseEditor.value as any).clearEvents()
      ellipseEditor.value?.close()
    }
  },
  cancelEdit: (
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Ellipse'>,
  ) => {
    if (
      (editData.value!.props as EllipseProps).center &&
      (editData.value!.props as EllipseProps).radius
    ) {
      if (
        !isEqual(
          (editData.value!.props as EllipseProps).center,
          (activeOverlay.value!.props as EllipseProps).center,
        )
      ) {
        ;(layer.overlays[index].props as EllipseProps).center = cloneDeep(
          (overlay.props as EllipseProps).center,
        )
      }
      if (
        !isEqual(
          (editData.value!.props as EllipseProps).radius,
          (activeOverlay.value!.props as EllipseProps).radius,
        )
      ) {
        ;(layer.overlays[index].props as EllipseProps).radius = cloneDeep(
          (overlay.props as EllipseProps).radius,
        )
      }
    }
  },
}
