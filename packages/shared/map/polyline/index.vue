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
  // 如果调用 destroy 方法，切换数据后地图报错
  // polyline.destroy()
  mapStore.map?.remove(polyline)
})

function createPolyline() {
  polyline = new window.AMap.Polyline({
    ...polylineProps.props,
    cursor: 'pointer',
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
  () => polylineProps.props.path,
  path => {
    path && polyline.setPath(path)
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
