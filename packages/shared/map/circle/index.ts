import { overlayFactory, useMapStore } from '@sp/shared/map'
import { message } from 'ant-design-vue'
import { cloneDeep, isEqual } from 'lodash-es'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  CircleProps,
  LayerItem,
  OverlayItem,
  OverlayInstance,
  OverlayType,
  OverlayModule,
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
  map,
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
  sort: 9,
  defaultZIndex: 10,
  overlay: Overlay,
  form: Form,
  name: '圆形',
  icon: 'i-mdi:circle-outline',
  drawHelp: ['从圆心位置点击并拖动，松开鼠标后完成绘制', '不能连续绘制'],
  editHelp: ['拖动边缘控制点调整尺寸', '拖动中心控制点移动位置'],
  handleDraw: (open: boolean) => {
    if (open) {
      mousetool.value?.circle({})
    } else {
      mousetool.value?.close(false)
    }
  },
  afterDraw: (obj: OverlayInstance['Circle']) => {
    const radius = obj.getRadius()
    if (radius === 0) {
      message.warn('请拖动扩展圆形面积！')
      return
    }
    const center = obj.getCenter()
    const newCircle = overlayFactory('Circle', activeLayer.value!, {
      center: [center.lng, center.lat],
      radius,
    })
    mapData.value[activeLayerIndex.value!].overlays.push(newCircle)
    map.value?.remove(obj)
    mapStore.toolManage()
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
} as OverlayModule
