<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import { useMapStore } from '../mapStore'
import type { OverlayProps } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const labelMarkerProps = defineProps<OverlayProps<'LabelMarker'>>()

const mapStore = useMapStore()

let labelMarker: AMap.LabelMarker

createLabelMarker()

mapStore.map?.setFitView()

onUnmounted(() => {
  ;(mapStore.labelsLayer as any).remove(labelMarker)
})

function createLabelMarker() {
  labelMarker = new window.AMap.LabelMarker({
    ...labelMarkerProps.props,
  })

  labelMarker.setExtData(labelMarkerProps.id)

  mapStore.bindMenu(labelMarker, labelMarkerProps.bindMenu)

  if (mapStore.map) {
    ;(mapStore.labelsLayer as any).add(labelMarker)
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
