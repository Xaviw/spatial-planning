import { overlayFactory, useMapStore } from '@sp/shared/map'
import { cloneDeep, isEqual } from 'lodash-es'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  BezierCurveProps,
  LayerItem,
  OverlayInstance,
  OverlayItem,
  OverlayType,
} from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const mapStore = useMapStore()
const {
  activeInstance,
  activeOverlay,
  editData,
  mousetool,
  mapData,
  activeLayerIndex,
  activeLayer,
  bezierCurveEditor,
} = storeToRefs(mapStore)

function synchronization() {
  if (!(activeInstance.value instanceof window.AMap.BezierCurve)) return

  const path = activeInstance.value.getPath() as AMap.Vector[]

  if (!isEqual((editData.value!.props as BezierCurveProps).path, path)) {
    ;(editData.value!.props as BezierCurveProps).path = path
  }
}

export default {
  type: 'BezierCurve',
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
  beforeDraw: () => {
    mousetool.value?.polyline({})
  },
  afterDraw: (obj: OverlayInstance['Polyline']) => {
    const path = obj.getPath() as AMap.LngLat[]

    const newPolyline = overlayFactory('BezierCurve', activeLayer.value!, {
      path: path.map((item): AMap.Vector2 => [item.lng, item.lat]),
    })
    mapData.value[activeLayerIndex.value!].overlays.push(newPolyline)
  },
  handleEdit: (open: boolean) => {
    if (!(activeInstance.value instanceof window.AMap.BezierCurve)) return

    if (open) {
      bezierCurveEditor.value?.setTarget(activeInstance.value)
      bezierCurveEditor.value?.open()
      activeInstance.value.setOptions({ cursor: 'grab', draggable: true })
      activeInstance.value.on('dragend', synchronization)
      ;(bezierCurveEditor.value as any).on('addnode', synchronization)
      ;(bezierCurveEditor.value as any).on('adjust', synchronization)
      ;(bezierCurveEditor.value as any).on('removenode', synchronization)
    } else {
      activeInstance.value.clearEvents('dragend')
      ;(bezierCurveEditor.value as any).clearEvents()
      bezierCurveEditor.value?.close()
      bezierCurveEditor.value?.setTarget()
      activeInstance.value.setOptions({ cursor: 'pointer', draggable: false })
    }
  },
  cancelEdit: (
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Marker'>,
  ) => {
    console.log(
      (editData.value!.props as BezierCurveProps).path,
      (activeOverlay.value!.props as BezierCurveProps).path,
    )

    if (
      (editData.value!.props as BezierCurveProps).path &&
      !isEqual(
        (editData.value!.props as BezierCurveProps).path,
        (activeOverlay.value!.props as BezierCurveProps).path,
      )
    ) {
      ;(layer.overlays[index].props as BezierCurveProps).path = cloneDeep(
        (overlay.props as BezierCurveProps).path,
      )
    }
  },
}
