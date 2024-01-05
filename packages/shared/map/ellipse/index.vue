<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import { omit } from 'lodash-es'
import { useMapStore } from '../mapStore'
import type { OverlayProps } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const ellipseProps = defineProps<OverlayProps<'Ellipse'>>()

const mapStore = useMapStore()

let ellipse: AMap.Ellipse

createEllipse()

mapStore.map?.setFitView()

onUnmounted(() => {
  mapStore.map?.remove(ellipse)
})

function createEllipse() {
  console.log('ellipseProps.props: ', ellipseProps.props)
  ellipse = new window.AMap.Ellipse({
    ...ellipseProps.props,
    cursor: 'pointer',
  })

  ellipse.setExtData(ellipseProps.id)

  mapStore.bindMenu(ellipse)

  if (mapStore.map) {
    mapStore.map.add(ellipse)
  }
}

watch(
  () => ellipseProps.visible,
  visible => {
    if (visible) {
      ellipse.show()
    } else {
      ellipse.hide()
    }
  },
)

watch(
  () => ellipseProps.props.center,
  center => {
    center && ellipse.setCenter(center)
  },
)

watch(
  () => ellipseProps.props.radius,
  radius => {
    radius && ellipse.setRadius(radius)
  },
)

watch(
  () => ellipseProps.props,
  options => {
    options && ellipse.setOptions(omit(options, 'center', 'radius'))
  },
  { deep: true },
)
</script>
