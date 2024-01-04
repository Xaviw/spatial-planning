<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import { omit } from 'lodash-es'
import { useMapStore } from '../mapStore'
import type { OverlayProps } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const circleProps = defineProps<OverlayProps<'Circle'>>()

const mapStore = useMapStore()

let circle: AMap.Circle

createCircle()

mapStore.map?.setFitView()

onUnmounted(() => {
  mapStore.map?.remove(circle)
})

function createCircle() {
  circle = new window.AMap.Circle({
    ...circleProps.props,
    cursor: 'pointer',
  })

  circle.setExtData(circleProps.id)

  mapStore.bindMenu(circle)

  if (mapStore.map) {
    mapStore.map.add(circle)
  }
}

watch(
  () => circleProps.visible,
  visible => {
    if (visible) {
      circle.show()
    } else {
      circle.hide()
    }
  },
)

watch(
  () => circleProps.props.center,
  center => {
    center && circle.setCenter(center)
  },
)

watch(
  () => circleProps.props.radius,
  radius => {
    typeof radius === 'number' && circle.setRadius(radius)
  },
)

watch(
  () => circleProps.props,
  options => {
    options && circle.setOptions(omit(options, 'center', 'radius'))
  },
  { deep: true },
)
</script>
