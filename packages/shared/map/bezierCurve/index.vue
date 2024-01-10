<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import {
  hasRightMenuKey,
  mapKey,
  bindClickEvent,
  bindRightClickEvent,
} from '@sp/shared/map'
import type { OverlayProps } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const bezierCurveProps = defineProps<OverlayProps<'BezierCurve'>>()

const map = inject(mapKey)
const hasRightMenu = inject(hasRightMenuKey)

let bezierCurve: AMap.BezierCurve

createBezierCurve()

map?.value?.setFitView()

onUnmounted(() => {
  map?.value?.remove(bezierCurve)
})

function createBezierCurve() {
  bezierCurve = new window.AMap.BezierCurve({
    ...bezierCurveProps.props,
    cursor: 'pointer',
  })

  bezierCurve.setExtData(bezierCurveProps.id)

  bindClickEvent(bezierCurve, toRef(bezierCurveProps))

  hasRightMenu && bindRightClickEvent(bezierCurve)

  if (map?.value) {
    map?.value?.add(bezierCurve)
  }
}

watch(
  () => bezierCurveProps.visible,
  visible => {
    if (visible) {
      bezierCurve.show()
    } else {
      bezierCurve.hide()
    }
  },
)

watch(
  () => bezierCurveProps.props.path,
  path => {
    path && bezierCurve.setPath(path)
  },
)

watch(
  () => bezierCurveProps.props,
  options => {
    options && bezierCurve.setOptions(options)
  },
  { deep: true },
)
</script>
