<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import {
  hasRightMenuKey,
  mapKey,
  bindClickEvent,
  bindRightClickEvent,
} from '@sp/shared/helpers/map'
import { isObject } from 'lodash-es'
import type { OverlayProps } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const markerProps = defineProps<OverlayProps<'Marker'>>()

const map = inject(mapKey)
const hasRightMenu = inject(hasRightMenuKey)

let marker: AMap.Marker

createMarker()

map?.value?.setFitView()

onUnmounted(() => {
  map?.value?.remove(marker)
})

function createMarker() {
  marker = new window.AMap.Marker({
    ...markerProps.props,
    icon:
      markerProps.props.icon && typeof markerProps.props.icon === 'object'
        ? new window.AMap.Icon(markerProps.props.icon)
        : markerProps.props.icon,
  })

  marker.setExtData(markerProps.id)

  bindClickEvent(marker, toRef(markerProps))

  hasRightMenu && bindRightClickEvent(marker)

  if (map?.value) {
    map?.value?.add(marker)
  }
}

watch(
  () => markerProps.visible,
  visible => {
    if (visible) {
      marker.show()
    } else {
      marker.hide()
    }
  },
)

watch(
  () => markerProps.props.title,
  title => {
    marker.setTitle(title!)
  },
)

watch(
  () => markerProps.props.icon,
  icon => {
    if (icon) {
      if (isObject(icon)) {
        marker.setIcon(new window.AMap.Icon(icon))
      } else {
        marker.setIcon(icon)
      }
    }
  },
  { deep: true },
)

watch(
  () => markerProps.props.label,
  label => {
    marker.setLabel(label!)
  },
  { deep: true },
)

watch(
  () => markerProps.props.position,
  position => {
    position && marker.setPosition(position)
  },
)

watch(
  () => markerProps.props.anchor,
  anchor => {
    marker.setAnchor(anchor!)
  },
)

watch(
  () => markerProps.props.offset,
  offset => {
    marker.setOffset(offset!)
  },
)

watch(
  () => markerProps.props.content,
  content => {
    marker.setContent(content)
  },
)

watch(
  () => markerProps.props.angle,
  angle => {
    marker.setAngle(angle!)
  },
)

watch(
  () => markerProps.props.zIndex,
  zIndex => {
    marker.setzIndex(zIndex!)
  },
)

watch(
  () => markerProps.props.zooms,
  () => {
    map?.value?.remove(marker)
    createMarker()
  },
)
</script>
