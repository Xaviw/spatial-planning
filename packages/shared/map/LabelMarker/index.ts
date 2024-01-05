import { overlayFactory, useMapStore } from '@sp/shared/map'
import { cloneDeep, isEqual } from 'lodash-es'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  LayerItem,
  LabelMarkerProps,
  OverlayItem,
  OverlayType,
  MapEvent,
} from '#/business'

const mapStore = useMapStore()
const { activeOverlay, editData, map, mapData, activeLayerIndex, activeLayer } =
  storeToRefs(mapStore)

export default {
  type: 'LabelMarker',
  overlay: Overlay,
  form: Form,
  name: '文本标注',
  description: '相比于标记点支持设置文本以及标记间避让',
  icon: 'i-ic:outline-text-fields',
  drawHelp: ['在目标位置单击新增文本标注'],
  editHelp: ['无法移动位置'],
  beforeDraw: () => {
    map.value?.setDefaultCursor('crosshair')
    map.value?.on('click', (e: MapEvent) => {
      const newLabelMarker = overlayFactory('LabelMarker', activeLayer.value!, {
        position: [e.lnglat.lng, e.lnglat.lat],
        name: '新增文本',
        text: { content: '新增文本' },
      })
      mapData.value[activeLayerIndex.value!].overlays.push(newLabelMarker)
    })
  },
  handleEdit: () => {},
  cancelEdit: (
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'LabelMarker'>,
  ) => {
    if (
      (editData.value!.props as LabelMarkerProps).position &&
      !isEqual(
        (editData.value!.props as LabelMarkerProps).position,
        (activeOverlay.value!.props as LabelMarkerProps).position,
      )
    ) {
      ;(layer.overlays[index].props as LabelMarkerProps).position = cloneDeep(
        overlay.props.position,
      )
    }
  },
}
