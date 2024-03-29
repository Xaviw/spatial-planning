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

const ellipseProps = defineProps<OverlayProps<'Ellipse'>>()

const map = inject(mapKey)
const hasRightMenu = inject(hasRightMenuKey)

let ellipse: AMap.Ellipse

watch(
  () => map?.value,
  _map => {
    if (_map) {
      createEllipse()
    }
  },
  {
    immediate: true,
  },
)

onUnmounted(() => {
  map?.value?.remove(ellipse)
})

function createEllipse() {
  ellipse = new window.AMap.Ellipse({
    ...ellipseProps.props,
    cursor: 'pointer',
  })

  ellipse.setExtData(ellipseProps.id)

  bindClickEvent(ellipse, toRef(ellipseProps))

  hasRightMenu && bindRightClickEvent(ellipse)

  if (map?.value) {
    map?.value?.add(ellipse)
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
    const { center, radius, ...option } = options
    options && ellipse.setOptions(option)
  },
  { deep: true },
)
</script>
