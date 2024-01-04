<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import { useMapStore } from '../mapStore'
import type { OverlayProps } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const polygonProps = defineProps<OverlayProps<'Polygon'>>()

const mapStore = useMapStore()

let polygon: AMap.Polygon

createPolygon()

mapStore.map?.setFitView()

onUnmounted(() => {
  mapStore.map?.remove(polygon)
})

function createPolygon() {
  polygon = new (window.AMap.Polygon as any)({
    ...polygonProps.props,
    cursor: 'pointer',
  })

  polygon.setExtData(polygonProps.id)

  mapStore.bindMenu(polygon)

  if (mapStore.map) {
    mapStore.map.add(polygon)
  }
}

watch(
  () => polygonProps.visible,
  visible => {
    if (visible) {
      polygon.show()
    } else {
      polygon.hide()
    }
  },
)

watch(
  () => polygonProps.props.path,
  path => {
    path && polygon.setPath(path)
  },
)

watch(
  () => polygonProps.props,
  options => {
    options && polygon.setOptions(options)
  },
  { deep: true },
)
</script>
