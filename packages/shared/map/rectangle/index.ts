import { overlayFactory, useMapStore } from '@sp/shared/map'
import { message } from 'ant-design-vue'
import { cloneDeep, isEqual } from 'lodash-es'
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

const mapStore = useMapStore()
const {
  activeInstance,
  activeOverlay,
  editData,
  mapData,
  activeLayerIndex,
  activeLayer,
  mousetool,
  rectangleEditor,
  map,
} = storeToRefs(mapStore)

function synchronization() {
  if (!(activeInstance.value instanceof window.AMap.Rectangle)) return

  const bounds = activeInstance.value.getBounds()
  const sw = bounds!.getSouthWest()
  const ne = bounds!.getNorthEast()
  const newBounds: AMap.Vector2[] = [
    [sw.lng, sw.lat],
    [ne.lng, ne.lat],
  ]

  if (!isEqual((editData.value!.props as RectangleProps).bounds, newBounds)) {
    ;(editData.value!.props as RectangleProps).bounds = newBounds
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
  drawHelp: ['从目标位置点击并拖动，松开鼠标后完成绘制'],
  editHelp: ['拖动控制点移动顶点位置', '拖动非控制点移动整体位置'],
  handleDraw: (open: boolean) => {
    if (open) {
      mousetool.value?.rectangle({})
    } else {
      mousetool.value?.close(false)
    }
  },
  afterDraw: (obj: OverlayInstance['Rectangle']) => {
    const bounds = obj.getBounds()!
    const sw = bounds.getSouthWest()
    const ne = bounds.getNorthEast()
    if (sw.lng === ne.lng && sw.lat === ne.lat) {
      message.warn('请拖动扩展矩形面积！')
      return
    }
    const newRectangle = overlayFactory('Rectangle', activeLayer.value!, {
      bounds: [
        [sw.lng, sw.lat],
        [ne.lng, ne.lat],
      ],
    })
    mapData.value[activeLayerIndex.value!].overlays.push(newRectangle)
    map.value?.remove(obj)
  },
  handleEdit: (open: boolean) => {
    if (!(activeInstance.value instanceof window.AMap.Rectangle)) return

    if (open) {
      rectangleEditor.value?.setTarget(activeInstance.value)
      rectangleEditor.value?.open()
      activeInstance.value.setOptions({ cursor: 'grab' })
      ;(rectangleEditor.value as any).on('addnode', synchronization)
      ;(rectangleEditor.value as any).on('adjust', synchronization)
      ;(rectangleEditor.value as any).on('move', synchronization)
    } else {
      rectangleEditor.value?.close()
      activeInstance.value.setOptions({ cursor: 'pointer' })
      ;(rectangleEditor.value as any).clearEvents()
    }
  },
  cancelEdit: (
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Rectangle'>,
  ) => {
    if (
      (editData.value!.props as RectangleProps).bounds &&
      !isEqual(
        (editData.value!.props as RectangleProps).bounds,
        (activeOverlay.value!.props as RectangleProps).bounds,
      )
    ) {
      ;(layer.overlays[index].props as RectangleProps).bounds = cloneDeep(
        (overlay.props as RectangleProps).bounds,
      )
    }
  },
} as OverlayModule
