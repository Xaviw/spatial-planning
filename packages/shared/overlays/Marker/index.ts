import { overlayFactory, useMapStore } from '@sp/shared/helpers/map'
import { cloneDeep, isEqual } from 'lodash-es'
import Form from './form.vue'
import Overlay from './index.vue'
import type {
  LayerItem,
  MarkerProps,
  OverlayInstance,
  OverlayItem,
  OverlayModule,
  OverlayType,
} from '#/business'

export default {
  type: 'Marker',
  sort: 1,
  defaultZIndex: 12,
  overlay: Overlay,
  form: Form,
  name: '标记点',
  icon: 'i-material-symbols:location-on',
  drawHelp: ['在目标位置单击新增标记点'],
  editHelp: ['拖动标记点移动位置'],
  handleDraw: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (open) {
      mapStore.mousetool?.marker({})
    } else {
      mapStore.mousetool?.close(false)
    }
  },
  afterDraw: (
    mapStore: ReturnType<typeof useMapStore>,
    obj: OverlayInstance['Marker'],
  ) => {
    const pos = obj.getPosition()!
    const newMarker = overlayFactory('Marker', mapStore.activeLayer!, {
      position: [pos.lng, pos.lat],
    })

    mapStore.mapData[mapStore.activeLayerIndex!].overlays.push(newMarker)
    mapStore.map?.remove(obj)
  },
  handleEdit: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (!(mapStore.activeInstance instanceof window.AMap.Marker)) return

    if (open) {
      mapStore.activeInstance.setDraggable(true)
      mapStore.activeInstance.setCursor('grab')
      mapStore.activeInstance.on('dragend', () => {
        if (!(mapStore.activeInstance instanceof window.AMap.Marker)) return

        const pos = mapStore.activeInstance.getPosition()!
        const newPos: [number, number] = [pos.lng, pos.lat]

        if (
          !isEqual((mapStore.editData!.props as MarkerProps).position, newPos)
        ) {
          ;(mapStore.editData!.props as MarkerProps).position = newPos
        }
      })
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
    overlay: OverlayItem<'Marker'>,
  ) => {
    if (
      (mapStore.editData!.props as MarkerProps).position &&
      !isEqual(
        (mapStore.editData!.props as MarkerProps).position,
        (mapStore.activeOverlay!.props as MarkerProps).position,
      )
    ) {
      ;(layer.overlays[index].props as MarkerProps).position = cloneDeep(
        overlay.props.position,
      )
    }
  },
} as OverlayModule
