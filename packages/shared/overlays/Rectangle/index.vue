<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import {
  hasRightMenuKey,
  mapKey,
  bindClickEvent,
  bindRightClickEvent,
} from '@sp/shared/helpers/map'
import type { OverlayProps } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const rectangleProps = defineProps<OverlayProps<'Rectangle'>>()

const map = inject(mapKey)
const hasRightMenu = inject(hasRightMenuKey)

let rectangle: AMap.Rectangle

createRectangle()

map?.value?.setFitView()

onUnmounted(() => {
  map?.value?.remove(rectangle)
})

function createRectangle() {
  const [sw, ne] = rectangleProps.props.bounds!
  rectangle = new window.AMap.Rectangle({
    ...rectangleProps.props,
    bounds: new window.AMap.Bounds(sw, ne),
    cursor: 'pointer',
  })

  rectangle.setExtData(rectangleProps.id)

  bindClickEvent(rectangle, toRef(rectangleProps))

  hasRightMenu && bindRightClickEvent(rectangle)

  if (map?.value) {
    map?.value?.add(rectangle)
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
    const { bounds, ...option } = options
    options && rectangle.setOptions(option)
  },
  { deep: true },
)
</script>
