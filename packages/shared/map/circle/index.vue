<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import {
  hasRightMenuKey,
  mapKey,
  bindClickEvent,
  bindRightClickEvent,
} from '@sp/shared/map'
import { omit } from 'lodash-es'
import type { OverlayProps } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const circleProps = defineProps<OverlayProps<'Circle'>>()

const map = inject(mapKey)
const hasRightMenu = inject(hasRightMenuKey)

let circle: AMap.Circle

createCircle()

map?.value?.setFitView()

onUnmounted(() => {
  map?.value?.remove(circle)
})

function createCircle() {
  circle = new window.AMap.Circle({
    ...circleProps.props,
    cursor: 'pointer',
  })

  circle.setExtData(circleProps.id)

  bindClickEvent(circle)

  hasRightMenu && bindRightClickEvent(circle)

  if (map?.value) {
    map?.value?.add(circle)
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
    radius && circle.setRadius(radius)
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
