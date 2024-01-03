<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import { useMapStore } from '../mapStore'
import type { OverlayProps } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const polylineProps = defineProps<OverlayProps<'Polyline'>>()

const mapStore = useMapStore()

let polyline: AMap.Polyline

createPolyline()

mapStore.map?.setFitView()

onUnmounted(() => {
  polyline.destroy()
})

function createPolyline() {
  polyline = new window.AMap.Polyline({
    ...polylineProps.props,
  })

  polyline.setExtData(polylineProps.id)

  mapStore.bindMenu(polyline)
  if (mapStore.map) {
    mapStore.map.add(polyline)
  }
}

watch(
  () => polylineProps.visible,
  visible => {
    if (visible) {
      polyline.show()
    } else {
      polyline.hide()
    }
  },
)

watch(
  () => polylineProps.props,
  options => {
    options && polyline.setOptions(options)
  },
  { deep: true },
)
</script>
