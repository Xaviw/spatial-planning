<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import { omit } from 'lodash-es'
import { useMapStore } from '../mapStore'
import type { OverlayProps } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const rectangleProps = defineProps<OverlayProps<'Rectangle'>>()

const mapStore = useMapStore()

let rectangle: AMap.Rectangle

createRectangle()

mapStore.map?.setFitView()

onUnmounted(() => {
  mapStore.map?.remove(rectangle)
})

function createRectangle() {
  const [sw, ne] = rectangleProps.props.bounds!
  rectangle = new window.AMap.Rectangle({
    ...rectangleProps.props,
    bounds: new window.AMap.Bounds(sw, ne),
    cursor: 'pointer',
  })

  rectangle.setExtData(rectangleProps.id)

  mapStore.bindMenu(rectangle)

  if (mapStore.map) {
    mapStore.map.add(rectangle)
  }
}

watch(
  () => rectangleProps.visible,
  visible => {
    if (visible) {
      rectangle.show()
    } else {
      rectangle.hide()
    }
  },
)

watch(
  () => rectangleProps.props.bounds,
  bounds => {
    if (!bounds) return
    const [sw, ne] = bounds
    rectangle.setBounds(new window.AMap.Bounds(sw, ne))
  },
)

watch(
  () => rectangleProps.props,
  options => {
    options && rectangle.setOptions(omit(options, 'bounds'))
  },
  { deep: true },
)
</script>
