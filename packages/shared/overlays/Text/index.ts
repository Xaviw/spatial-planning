import { overlayFactory, useMapStore } from '@sp/shared/helpers/map'
import { isEqual } from '@sp/shared/utils'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  LayerItem,
  TextProps,
  OverlayItem,
  OverlayType,
  MapEvent,
  OverlayModule,
} from '#/business'

function synchronization(mapStore: ReturnType<typeof useMapStore>) {
  if (!(mapStore.activeInstance instanceof window.AMap.Text)) return

  const pos = mapStore.activeInstance.getPosition()!
  const newPos: [number, number] = [pos.lng, pos.lat]

  if (!isEqual((mapStore.editData!.props as TextProps).position, newPos)) {
    ;(mapStore.editData!.props as TextProps).position = newPos
  }
}

function add(mapStore: ReturnType<typeof useMapStore>, e: MapEvent) {
  const newText = overlayFactory('Text', mapStore.activeLayer!, {
    position: [e.lnglat.lng, e.lnglat.lat],
    text: '新增文本',
  })
  mapStore.mapData[mapStore.activeLayerIndex!].overlays.push(newText)
}

export default {
  type: 'Text',
  sort: 2,
  defaultZIndex: 12,
  overlay: Overlay,
  form: Form,
  name: '文本',
  icon: 'i-ph:text-t',
  drawHelp: ['在目标位置单击新增文本'],
  editHelp: ['拖动文本移动位置'],
  handleDraw: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (open) {
      mapStore.map?.setDefaultCursor('crosshair')
      mapStore.map?.on('click', e => add(mapStore, e))
    } else {
      mapStore.map?.setDefaultCursor('inherit')
      mapStore.map?.clearEvents('click')
    }
  },
  handleEdit: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (!(mapStore.activeInstance instanceof window.AMap.Text)) return

    if (open) {
      mapStore.activeInstance.setDraggable(true)
      mapStore.activeInstance.setCursor('grab')
      mapStore.activeInstance.on(
        'dragend',
        synchronization.bind(null, mapStore),
      )
    } else {
      mapStore.activeInstance.clearEvents('dragend')
      mapStore.activeInstance.setDraggable(false)
      mapStore.activeInstance.setCursor('pointer')
    }
  },
  cancelEdit: (
    mapStore: ReturnType<typeof useMapStore>,
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Text'>,
  ) => {
    if (
      (mapStore.editData!.props as TextProps).position &&
      !isEqual(
        (mapStore.editData!.props as TextProps).position,
        (mapStore.activeOverlay!.props as TextProps).position,
      )
    ) {
      ;(layer.overlays[index].props as TextProps).position = structuredClone(
        overlay.props.position,
      )
    }
  },
} as OverlayModule
