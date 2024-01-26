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

const polygonProps = defineProps<OverlayProps<'Polygon'>>()

const map = inject(mapKey)
const hasRightMenu = inject(hasRightMenuKey)

let polygon: AMap.Polygon

createPolygon()

map?.value?.setFitView()

onUnmounted(() => {
  map?.value?.remove(polygon)
})

function createPolygon() {
  polygon = new (window.AMap.Polygon as any)({
    ...polygonProps.props,
    cursor: 'pointer',
  })

  polygon.setExtData(polygonProps.id)

  bindClickEvent(polygon, toRef(polygonProps))

  hasRightMenu && bindRightClickEvent(polygon)

  if (map?.value) {
    map?.value?.add(polygon)
  }
}

watch(
  () => polygonProps.visible,
  visible => {
    if (visible) {
      polygon.show()
    } else {
      polygon.hide()
    }
  },
)

watch(
  () => polygonProps.props.path,
  path => {
    path && polygon.setPath(path)
  },
)

watch(
  () => polygonProps.props,
  options => {
    options && polygon.setOptions(options)
  },
  { deep: true },
)
</script>
