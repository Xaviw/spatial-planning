<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import { useMapStore } from '../mapStore'
import type { ElasticMarker, OverlayProps } from '#/business'

const elasticMarkerProps = defineProps<OverlayProps<'ElasticMarker'>>()

const mapStore = useMapStore()

let elasticMarker: ElasticMarker

createElasticMarker()

mapStore.map?.setFitView()

onUnmounted(() => {
  mapStore.map?.remove(elasticMarker as any)
})

function createElasticMarker() {
  elasticMarker = new (window.AMap as any).ElasticMarker({
    ...elasticMarkerProps.props,
  })

  elasticMarker.setExtData(elasticMarkerProps.id)

  mapStore.bindMenu(elasticMarker)

  if (mapStore.map) {
    mapStore.map.add(elasticMarker as any)
  }
}

watch(
  () => elasticMarkerProps.visible,
  visible => {
    if (visible) {
      elasticMarker.show()
    } else {
      elasticMarker.hide()
    }
  },
)

watch(
  () => elasticMarkerProps.props.position,
  position => {
    position && elasticMarker.setPosition(position)
  },
)

watch(
  () => elasticMarkerProps.props.zIndex,
  zIndex => {
    typeof zIndex === 'number' && elasticMarker.setzIndex(zIndex)
  },
)

watch(
  () => elasticMarkerProps.props.offset,
  offset => {
    offset && elasticMarker.setOffset(offset)
  },
)

watch(
  () => elasticMarkerProps.props.styles,
  styles => {
    styles?.length && elasticMarker.setStyle(styles)
  },
  { deep: true },
)

watch(
  () => elasticMarkerProps.props.anchor,
  anchor => {
    anchor && elasticMarker.setAnchor(anchor)
  },
)
</script>
