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

const polylineProps = defineProps<OverlayProps<'Polyline'>>()

const map = inject(mapKey)
const hasRightMenu = inject(hasRightMenuKey)

let polyline: AMap.Polyline

watch(
  () => map?.value,
  _map => {
    if (_map) {
      createPolyline()
    }
  },
  {
    immediate: true,
  },
)

onUnmounted(() => {
  // 如果调用 destroy 方法，切换数据后地图报错
  // polyline.destroy()
  map?.value?.remove(polyline)
})

function createPolyline() {
  polyline = new window.AMap.Polyline({
    ...polylineProps.props,
    cursor: 'pointer',
  })

  polyline.setExtData(polylineProps.id)

  bindClickEvent(polyline, toRef(polylineProps))

  hasRightMenu && bindRightClickEvent(polyline)

  if (map?.value) {
    map?.value?.add(polyline)
  }
}

watch(
  () => polylineProps.visible,
  visible => {
    if (visible) {
      polyline.show()
    } else {
      polyline.hide()
    }
  },
)

watch(
  () => polylineProps.props.path,
  path => {
    path && polyline.setPath(path)
  },
)

watch(
  () => polylineProps.props,
  options => {
    options && polyline.setOptions(options)
  },
  { deep: true },
)
</script>
