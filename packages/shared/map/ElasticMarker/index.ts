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
  OverlayModule,
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

function add(e: MapEvent) {
  const newElasticMarker = overlayFactory('ElasticMarker', activeLayer.value!, {
    position: [e.lnglat.lng, e.lnglat.lat],
    styles: [
      { icon: { fitZoom: 12, scaleFactor: 1.2, maxScale: 10, minScale: 0.1 } },
    ],
  })
  mapData.value[activeLayerIndex.value!].overlays.push(newElasticMarker)
}

export default {
  type: 'ElasticMarker',
  sort: 4,
  defaultZIndex: 1,
  overlay: Overlay,
  form: Form,
  name: '灵活点标记',
  description: '相比于标记点支持随地图缩放',
  icon: 'i-mdi:map-marker-circle',
  drawHelp: ['在目标位置单击新增文本标注'],
  editHelp: ['拖动移动标记位置'],
  handleDraw: (open: boolean) => {
    if (open) {
      map.value?.on('click', add)
    } else {
      map.value?.off('click', add)
    }
  },
  handleEdit: (open: boolean) => {
    if (open) {
      ;(activeInstance.value as ElasticMarker).setDraggable(true)
      ;(activeInstance.value as ElasticMarker).setCursor('grab')
      ;(activeInstance.value as ElasticMarker).on('dragend', synchronization)
    } else {
      ;(activeInstance.value as ElasticMarker).off('dragend', synchronization)
      ;(activeInstance.value as ElasticMarker).setDraggable(false)
      ;(activeInstance.value as ElasticMarker).setCursor('pointer')
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
} as OverlayModule
