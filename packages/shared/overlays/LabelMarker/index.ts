import { overlayFactory, useMapStore } from '@sp/shared/helpers/map'
import { clone, equals } from 'ramda'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  LayerItem,
  LabelMarkerProps,
  OverlayItem,
  OverlayType,
  MapEvent,
  OverlayModule,
} from '#/overlays'
import type { AMap } from '@amap/amap-jsapi-types'

function add(mapStore: ReturnType<typeof useMapStore>, e: MapEvent) {
  const newLabelMarker = overlayFactory('LabelMarker', mapStore.activeLayer!, {
    position: [e.lnglat.lng, e.lnglat.lat],
    name: '新增文本',
    text: { content: '新增文本' },
  })
  mapStore.mapData[mapStore.activeLayerIndex!].overlays.push(newLabelMarker)
}

export default {
  type: 'LabelMarker',
  sort: 3,
  defaultZIndex: 1,
  overlay: Overlay,
  form: Form,
  name: '文本标注',
  description: '相比于标记点支持设置文本以及标记间避让',
  icon: 'i-mdi:image-text',
  drawHelp: ['在目标位置单击新增文本标注'],
  editHelp: ['无法拖动移动位置，请使用坐标拾取工具选择坐标后手动填写'],
  handleDraw: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (open) {
      mapStore.map?.on('click', e => add(mapStore, e))
    } else {
      mapStore.map?.clearEvents('click')
    }
  },
  cancelEdit: (
    mapStore: ReturnType<typeof useMapStore>,
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'LabelMarker'>,
  ) => {
    if (
      (mapStore.editData!.props as LabelMarkerProps).position &&
      !equals(
        (mapStore.editData!.props as LabelMarkerProps).position,
        (mapStore.activeOverlay!.props as LabelMarkerProps).position,
      )
    ) {
      ;(layer.overlays[index].props as LabelMarkerProps).position =
        clone<AMap.Vector2>(overlay.props.position)
    }
  },
} as OverlayModule
