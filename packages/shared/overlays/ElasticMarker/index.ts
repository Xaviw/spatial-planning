import { overlayFactory, useMapStore } from '@sp/shared/helpers/map'
import { clone, equals } from 'ramda'
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
} from '#/overlays'
import type { AMap } from '@amap/amap-jsapi-types'

function synchronization(mapStore: ReturnType<typeof useMapStore>) {
  const pos = (mapStore.activeInstance as ElasticMarker).getPosition()!
  const newPos: [number, number] = [pos.lng, pos.lat]

  if (
    !equals((mapStore.editData!.props as ElasticMarkerProps).position, newPos)
  ) {
    ;(mapStore.editData!.props as ElasticMarkerProps).position = newPos
  }
}

function add(mapStore: ReturnType<typeof useMapStore>, e: MapEvent) {
  const newElasticMarker = overlayFactory(
    'ElasticMarker',
    mapStore.activeLayer!,
    {
      position: [e.lnglat.lng, e.lnglat.lat],
      styles: [
        {
          icon: { fitZoom: 12, scaleFactor: 1.2, maxScale: 10, minScale: 0.1 },
        },
      ],
    },
  )
  mapStore.mapData[mapStore.activeLayerIndex!].overlays.push(newElasticMarker)
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
  handleDraw: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (open) {
      mapStore.map?.on('click', e => add(mapStore, e))
    } else {
      mapStore.map?.clearEvents('click')
    }
  },
  handleEdit: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (open) {
      ;(mapStore.activeInstance as ElasticMarker).setDraggable(true)
      ;(mapStore.activeInstance as ElasticMarker).setCursor('grab')
      ;(mapStore.activeInstance as ElasticMarker).on(
        'dragend',
        synchronization.bind(null, mapStore),
      )
    } else {
      ;(mapStore.activeInstance as ElasticMarker).clearEvents('dragend')
      ;(mapStore.activeInstance as ElasticMarker).setDraggable(false)
      ;(mapStore.activeInstance as ElasticMarker).setCursor('pointer')
    }
  },
  cancelEdit: (
    mapStore: ReturnType<typeof useMapStore>,
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'ElasticMarker'>,
  ) => {
    if (
      (mapStore.editData!.props as ElasticMarkerProps).position &&
      !equals(
        (mapStore.editData!.props as ElasticMarkerProps).position,
        (mapStore.activeOverlay!.props as ElasticMarkerProps).position,
      )
    ) {
      ;(layer.overlays[index].props as ElasticMarkerProps).position =
        clone<AMap.Vector2>(overlay.props.position)
    }
  },
} as OverlayModule
