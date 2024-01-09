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

const ellipseProps = defineProps<OverlayProps<'Ellipse'>>()

const map = inject(mapKey)
const hasRightMenu = inject(hasRightMenuKey)

let ellipse: AMap.Ellipse

createEllipse()

map?.value?.setFitView()

onUnmounted(() => {
  map?.value?.remove(ellipse)
})

function createEllipse() {
  ellipse = new window.AMap.Ellipse({
    ...ellipseProps.props,
    cursor: 'pointer',
  })

  ellipse.setExtData(ellipseProps.id)

  bindClickEvent(ellipse)

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
    options && ellipse.setOptions(omit(options, 'center', 'radius'))
  },
  { deep: true },
)
</script>
