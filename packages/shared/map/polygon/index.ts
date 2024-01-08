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

const mapStore = useMapStore()
const {
  activeInstance,
  activeOverlay,
  editData,
  mapData,
  activeLayerIndex,
  activeLayer,
  mousetool,
  polygonEditor,
  map,
} = storeToRefs(mapStore)

function synchronization() {
  if (!(activeInstance.value instanceof window.AMap.Polygon)) return

  const path = activeInstance.value.getPath() as AMap.LngLat[]
  const newPath = path.map((item): AMap.Vector2 => [item.lng, item.lat])

  if (!isEqual((editData.value!.props as PolygonProps).path, newPath)) {
    ;(editData.value!.props as PolygonProps).path = newPath
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
  handleDraw: (open: boolean) => {
    if (open) {
      mousetool.value?.polygon({})
    } else {
      mousetool.value?.close(false)
    }
  },
  afterDraw: (obj: OverlayInstance['Polygon']) => {
    const path = obj.getPath() as AMap.LngLat[]
    if (path.length < 3) {
      message.warn('请至少添加三个端点！')
      map.value?.remove(obj)
      return
    }

    const newPolygon = overlayFactory('Polygon', activeLayer.value!, {
      path: path.map((item): AMap.Vector2 => [item.lng, item.lat]),
    })
    mapData.value[activeLayerIndex.value!].overlays.push(newPolygon)
    map.value?.remove(obj)
  },
  handleEdit: (open: boolean) => {
    if (!(activeInstance.value instanceof window.AMap.Polygon)) return

    if (open) {
      polygonEditor.value?.setTarget(activeInstance.value)
      polygonEditor.value?.open()
      activeInstance.value.setOptions({ cursor: 'grab' })
      ;(polygonEditor.value as any).on('addnode', synchronization)
      ;(polygonEditor.value as any).on('removenode', synchronization)
      ;(polygonEditor.value as any).on('adjust', synchronization)
      ;(polygonEditor.value as any).on('move', synchronization)
    } else {
      ;(polygonEditor.value as any).clearEvents()
      polygonEditor.value?.close()
      activeInstance.value.setOptions({ cursor: 'pointer' })
    }
  },
  cancelEdit: (
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Polygon'>,
  ) => {
    if (
      (editData.value!.props as PolygonProps).path &&
      !isEqual(
        (editData.value!.props as PolygonProps).path,
        (activeOverlay.value!.props as PolygonProps).path,
      )
    ) {
      ;(layer.overlays[index].props as PolygonProps).path = cloneDeep(
        overlay.props.path,
      )
    }
  },
} as OverlayModule
