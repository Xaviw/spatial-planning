import { overlayFactory, useMapStore } from '@sp/shared/map'
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

const mapStore = useMapStore()
const {
  activeInstance,
  activeOverlay,
  editData,
  mousetool,
  mapData,
  activeLayerIndex,
  activeLayer,
  map,
} = storeToRefs(mapStore)

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
  handleDraw: (open: boolean) => {
    if (open) {
      mousetool.value?.marker({})
    } else {
      mousetool.value?.close(false)
    }
  },
  afterDraw: (obj: OverlayInstance['Marker']) => {
    const pos = obj.getPosition()!
    const newMarker = overlayFactory('Marker', activeLayer.value!, {
      position: [pos.lng, pos.lat],
    })

    mapData.value[activeLayerIndex.value!].overlays.push(newMarker)
    map.value?.remove(obj)
  },
  handleEdit: (open: boolean) => {
    if (!(activeInstance.value instanceof window.AMap.Marker)) return

    if (open) {
      activeInstance.value.setDraggable(true)
      activeInstance.value.setCursor('grab')
      activeInstance.value.on('dragend', () => {
        if (!(activeInstance.value instanceof window.AMap.Marker)) return

        const pos = activeInstance.value.getPosition()!
        const newPos: [number, number] = [pos.lng, pos.lat]

        if (!isEqual((editData.value!.props as MarkerProps).position, newPos)) {
          ;(editData.value!.props as MarkerProps).position = newPos
        }
      })
    } else {
      activeInstance.value.clearEvents('dragend')
      activeInstance.value.setDraggable(false)
      activeInstance.value.setCursor('pointer')
    }
  },
  cancelEdit: (
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Marker'>,
  ) => {
    if (
      (editData.value!.props as MarkerProps).position &&
      !isEqual(
        (editData.value!.props as MarkerProps).position,
        (activeOverlay.value!.props as MarkerProps).position,
      )
    ) {
      ;(layer.overlays[index].props as MarkerProps).position = cloneDeep(
        overlay.props.position,
      )
    }
  },
} as OverlayModule
