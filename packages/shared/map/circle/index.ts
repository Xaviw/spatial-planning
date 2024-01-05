import { overlayFactory, useMapStore } from '@sp/shared/map'
import { cloneDeep, isEqual } from 'lodash-es'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  CircleProps,
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
  circleEditor,
} = storeToRefs(mapStore)

function synchronization() {
  if (!(activeInstance.value instanceof window.AMap.Circle)) return

  const center = activeInstance.value.getCenter()
  const radius = activeInstance.value.getRadius()

  const newCenter: AMap.Vector2 = [center.lng, center.lat]

  if (!isEqual((editData.value!.props as CircleProps).center, newCenter)) {
    ;(editData.value!.props as CircleProps).center = newCenter
  }

  if (!isEqual((editData.value!.props as CircleProps).radius, radius)) {
    ;(editData.value!.props as CircleProps).radius = radius
  }
}

export default {
  type: 'Circle',
  overlay: Overlay,
  form: Form,
  name: '圆形',
  icon: 'i-mdi:circle-outline',
  drawHelp: ['从圆心位置点击并拖动，松开鼠标后完成绘制'],
  editHelp: ['拖动边缘控制点调整尺寸', '拖动中心控制点移动位置'],
  beforeDraw: () => {
    mousetool.value?.circle({})
  },
  afterDraw: (obj: OverlayInstance['Circle']) => {
    const center = obj.getCenter()
    const radius = obj.getRadius()
    const newCircle = overlayFactory('Circle', activeLayer.value!, {
      center: [center.lng, center.lat],
      radius,
    })
    mapData.value[activeLayerIndex.value!].overlays.push(newCircle)
  },
  handleEdit: (open: boolean) => {
    if (!(activeInstance.value instanceof window.AMap.Circle)) return

    if (open) {
      circleEditor.value?.setTarget(activeInstance.value)
      circleEditor.value?.open()
      ;(circleEditor.value as any).on('addnode', synchronization)
      ;(circleEditor.value as any).on('adjust', synchronization)
      ;(circleEditor.value as any).on('move', synchronization)
    } else {
      ;(circleEditor.value as any).clearEvents()
      circleEditor.value?.close()
    }
  },
  cancelEdit: (
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Circle'>,
  ) => {
    if (
      (editData.value!.props as CircleProps).center &&
      (editData.value!.props as CircleProps).radius
    ) {
      if (
        !isEqual(
          (editData.value!.props as CircleProps).center,
          (activeOverlay.value!.props as CircleProps).center,
        )
      ) {
        ;(layer.overlays[index].props as CircleProps).center = cloneDeep(
          (overlay.props as CircleProps).center,
        )
      }
      if (
        !isEqual(
          (editData.value!.props as CircleProps).radius,
          (activeOverlay.value!.props as CircleProps).radius,
        )
      ) {
        layer.overlays[index].props = {
          ...overlay.props,
        }
      }
    }
  },
}
