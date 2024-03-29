<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import {
  hasRightMenuKey,
  mapKey,
  bindClickEvent,
  bindRightClickEvent,
} from '@sp/shared/helpers/map'
import type { OverlayProps } from '#/overlays'
import type { AMap } from '@amap/amap-jsapi-types'

const circleProps = defineProps<OverlayProps<'Circle'>>()

const map = inject(mapKey)
const hasRightMenu = inject(hasRightMenuKey)

let circle: AMap.Circle

watch(
  () => map?.value,
  _map => {
    if (_map) {
      createCircle()
    }
  },
  {
    immediate: true,
  },
)

onUnmounted(() => {
  map?.value?.remove(circle)
})

function createCircle() {
  circle = new window.AMap.Circle({
    ...circleProps.props,
    cursor: 'pointer',
  })

  circle.setExtData(circleProps.id)

  bindClickEvent(circle, toRef(circleProps))

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
    const { center, radius, ...option } = options
    options && circle.setOptions(option)
  },
  { deep: true },
)
</script>
