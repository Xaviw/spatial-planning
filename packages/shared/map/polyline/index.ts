import { overlayFactory, useMapStore } from '@sp/shared/map'
import { message } from 'ant-design-vue'
import { cloneDeep, isEqual } from 'lodash-es'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  PolylineProps,
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
  polylineEditor,
  map,
} = storeToRefs(mapStore)

function synchronization() {
  if (!(activeInstance.value instanceof window.AMap.Polyline)) return

  const path = activeInstance.value.getPath() as AMap.LngLat[]
  const newPath = path.map((item): AMap.Vector2 => [item.lng, item.lat])

  if (!isEqual((editData.value!.props as PolylineProps).path, newPath)) {
    ;(editData.value!.props as PolylineProps).path = newPath
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
  handleDraw: (open: boolean) => {
    if (open) {
      mousetool.value?.polyline({})
    } else {
      mousetool.value?.close(false)
    }
  },
  afterDraw: (obj: OverlayInstance['Polyline']) => {
    const path = obj.getPath() as AMap.LngLat[]
    if (path.length < 2) {
      message.warn('请至少添加两个端点！')
      map.value?.remove(obj)
      return
    }

    const newPolyline = overlayFactory('Polyline', activeLayer.value!, {
      path: path.map((item): AMap.Vector2 => [item.lng, item.lat]),
    })
    mapData.value[activeLayerIndex.value!].overlays.push(newPolyline)
    map.value?.remove(obj)
  },
  handleEdit: (open: boolean) => {
    if (!(activeInstance.value instanceof window.AMap.Polyline)) return

    if (open) {
      polylineEditor.value?.setTarget(activeInstance.value)
      polylineEditor.value?.open()
      activeInstance.value.setOptions({ cursor: 'grab', draggable: true })
      activeInstance.value.on('dragend', synchronization)
      ;(polylineEditor.value as any).on('addnode', synchronization)
      ;(polylineEditor.value as any).on('adjust', synchronization)
    } else {
      activeInstance.value.clearEvents('dragend')
      polylineEditor.value?.close()
      activeInstance.value.setOptions({ cursor: 'pointer', draggable: false })
      ;(polylineEditor.value as any).clearEvents()
    }
  },
  cancelEdit: (
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Polyline'>,
  ) => {
    if (
      (editData.value!.props as PolylineProps).path &&
      !isEqual(
        (editData.value!.props as PolylineProps).path,
        (activeOverlay.value!.props as PolylineProps).path,
      )
    ) {
      ;(layer.overlays[index].props as PolylineProps).path = cloneDeep(
        overlay.props.path,
      )
    }
  },
} as OverlayModule
