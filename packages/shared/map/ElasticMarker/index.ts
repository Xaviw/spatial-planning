import { overlayFactory, useMapStore } from '@sp/shared/map'
import { cloneDeep, isEqual } from 'lodash-es'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  LayerItem,
  OverlayItem,
  OverlayType,
  MapEvent,
  ElasticMarker,
  ElasticMarkerProps,
} from '#/business'

const mapStore = useMapStore()
const {
  activeOverlay,
  editData,
  map,
  mapData,
  activeLayerIndex,
  activeLayer,
  activeInstance,
} = storeToRefs(mapStore)

function synchronization() {
  const pos = (activeInstance.value as ElasticMarker).getPosition()!
  const newPos: [number, number] = [pos.lng, pos.lat]

  if (
    !isEqual((editData.value!.props as ElasticMarkerProps).position, newPos)
  ) {
    ;(editData.value!.props as ElasticMarkerProps).position = newPos
  }
}

export default {
  type: 'ElasticMarker',
  sort: 4,
  overlay: Overlay,
  form: Form,
  name: '灵活点标记',
  description: '相比于标记点支持随地图缩放',
  icon: 'i-mdi:image-text',
  drawHelp: ['在目标位置单击新增文本标注'],
  editHelp: ['拖动移动标记位置'],
  beforeDraw: () => {
    map.value?.setDefaultCursor('crosshair')
    map.value?.on('click', (e: MapEvent) => {
      const newElasticMarker = overlayFactory(
        'ElasticMarker',
        activeLayer.value!,
        {
          position: [e.lnglat.lng, e.lnglat.lat],
          styles: [{ label: { content: '新增文本' } }],
        },
      )
      mapData.value[activeLayerIndex.value!].overlays.push(newElasticMarker)
    })
  },
  handleEdit: (open: boolean) => {
    if (open) {
      ;(activeInstance.value as ElasticMarker)
        .setDraggable(true)(activeInstance.value as ElasticMarker)
        .setCursor('grab')(activeInstance.value as ElasticMarker)
        .on('dragend', synchronization)
    } else {
      ;(activeInstance.value as ElasticMarker)
        .clearEvents('dragend')(activeInstance.value as ElasticMarker)
        .setDraggable(false)(activeInstance.value as ElasticMarker)
        .setCursor('pointer')
    }
  },
  cancelEdit: (
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'ElasticMarker'>,
  ) => {
    if (
      (editData.value!.props as ElasticMarkerProps).position &&
      !isEqual(
        (editData.value!.props as ElasticMarkerProps).position,
        (activeOverlay.value!.props as ElasticMarkerProps).position,
      )
    ) {
      ;(layer.overlays[index].props as ElasticMarkerProps).position = cloneDeep(
        overlay.props.position,
      )
    }
  },
}
