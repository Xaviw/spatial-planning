<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import {
  hasRightMenuKey,
  mapKey,
  bindClickEvent,
  bindRightClickEvent,
  labelsLayerKey,
} from '@sp/shared/helpers/map'
import type { OverlayProps } from '#/overlays'
import type { AMap } from '@amap/amap-jsapi-types'

const labelMarkerProps = defineProps<OverlayProps<'LabelMarker'>>()

const map = inject(mapKey)
const hasRightMenu = inject(hasRightMenuKey)
const labelsLayer = inject(labelsLayerKey)

let labelMarker: AMap.LabelMarker

watch(
  () => map?.value,
  _map => {
    if (_map) {
      createLabelMarker()
      map!.value!.setFitView()
    }
  },
  {
    immediate: true,
  },
)

onUnmounted(() => {
  ;(labelsLayer?.value as any)?.remove(labelMarker)
})

function createLabelMarker() {
  labelMarker = new window.AMap.LabelMarker({
    ...labelMarkerProps.props,
  })

  labelMarker.setExtData(labelMarkerProps.id)

  bindClickEvent(labelMarker, toRef(labelMarkerProps))

  hasRightMenu && bindRightClickEvent(labelMarker)

  if (map?.value) {
    ;(labelsLayer?.value as any)?.add(labelMarker)
  }
}

watch(
  () => labelMarkerProps.visible,
  visible => {
    if (visible) {
      labelMarker.show()
    } else {
      labelMarker.hide()
    }
  },
)

watch(
  () => labelMarkerProps.props.name,
  name => {
    labelMarker.setName(name!)
  },
)

watch(
  () => labelMarkerProps.props.position,
  position => {
    position && labelMarker.setPosition(position)
  },
)

watch(
  () => labelMarkerProps.props.zooms,
  zooms => {
    labelMarker.setZooms(zooms)
  },
)

watch(
  () => labelMarkerProps.props.opacity,
  opacity => {
    labelMarker.setOpacity(opacity!)
  },
)

watch(
  () => labelMarkerProps.props.rank,
  rank => {
    labelMarker.setRank(rank!)
  },
)

watch(
  () => labelMarkerProps.props.zIndex,
  zIndex => {
    labelMarker.setzIndex(zIndex!)
  },
)

watch(
  () => labelMarkerProps.props.icon,
  icon => {
    labelMarker.setIcon(icon!)
  },
  { deep: true },
)

watch(
  () => labelMarkerProps.props.text,
  text => {
    labelMarker.setText(text!)
  },
  { deep: true },
)
</script>
