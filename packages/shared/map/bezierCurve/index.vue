<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import { useMapStore } from '../mapStore'
import type { OverlayProps } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const bezierCurveProps = defineProps<OverlayProps<'BezierCurve'>>()

const mapStore = useMapStore()

let bezierCurve: AMap.BezierCurve

createBezierCurve()

mapStore.map?.setFitView()

onUnmounted(() => {
  mapStore.map?.remove(bezierCurve)
})

function createBezierCurve() {
  bezierCurve = new window.AMap.BezierCurve({
    ...bezierCurveProps.props,
    cursor: 'pointer',
  })

  bezierCurve.setExtData(bezierCurveProps.id)

  mapStore.bindMenu(bezierCurve)

  if (mapStore.map) {
    mapStore.map.add(bezierCurve)
  }
}

watch(
  () => bezierCurveProps.visible,
  visible => {
    if (visible) {
      bezierCurve.show()
    } else {
      bezierCurve.hide()
    }
  },
)

watch(
  () => bezierCurveProps.props.path,
  path => {
    path && bezierCurve.setPath(path)
  },
)

watch(
  () => bezierCurveProps.props,
  options => {
    options && bezierCurve.setOptions(options)
  },
  { deep: true },
)
</script>
