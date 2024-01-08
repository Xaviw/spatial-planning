import { overlayFactory, useMapStore } from '@sp/shared/map'
import { cloneDeep, isEqual } from 'lodash-es'
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

const mapStore = useMapStore()
const {
  activeInstance,
  activeOverlay,
  editData,
  map,
  mapData,
  activeLayerIndex,
  activeLayer,
} = storeToRefs(mapStore)

function synchronization() {
  if (!(activeInstance.value instanceof window.AMap.Text)) return

  const pos = activeInstance.value.getPosition()!
  const newPos: [number, number] = [pos.lng, pos.lat]

  if (!isEqual((editData.value!.props as TextProps).position, newPos)) {
    ;(editData.value!.props as TextProps).position = newPos
  }
}

function add(e: MapEvent) {
  const newText = overlayFactory('Text', activeLayer.value!, {
    position: [e.lnglat.lng, e.lnglat.lat],
    text: '新增文本',
  })
  mapData.value[activeLayerIndex.value!].overlays.push(newText)
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
  handleDraw: (open: boolean) => {
    if (open) {
      map.value?.setDefaultCursor('crosshair')
      map.value?.on('click', add)
    } else {
      map.value?.setDefaultCursor('inherit')
      map.value?.off('click', add)
    }
  },
  handleEdit: (open: boolean) => {
    if (!(activeInstance.value instanceof window.AMap.Text)) return

    if (open) {
      activeInstance.value.setDraggable(true)
      activeInstance.value.setCursor('grab')
      activeInstance.value.on('dragend', synchronization)
    } else {
      activeInstance.value.clearEvents('dragend')
      activeInstance.value.setDraggable(false)
      activeInstance.value.setCursor('pointer')
    }
  },
  cancelEdit: (
    layer: LayerItem<OverlayType>,
    index: number,
    overlay: OverlayItem<'Text'>,
  ) => {
    if (
      (editData.value!.props as TextProps).position &&
      !isEqual(
        (editData.value!.props as TextProps).position,
        (activeOverlay.value!.props as TextProps).position,
      )
    ) {
      ;(layer.overlays[index].props as TextProps).position = cloneDeep(
        overlay.props.position,
      )
    }
  },
} as OverlayModule
