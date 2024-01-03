<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import { isObject } from 'lodash-es'
import { useMapStore } from '../mapStore'
import type { OverlayProps } from '#/business'

const markerProps = defineProps<OverlayProps<'Marker'>>()

const mapStore = useMapStore()

const marker = new window.AMap.Marker({
  ...markerProps.props,
  icon:
    markerProps.props.icon && typeof markerProps.props.icon === 'object'
      ? new window.AMap.Icon(markerProps.props.icon)
      : markerProps.props.icon,
  map: mapStore.map,
})

marker.setExtData(markerProps.id)

mapStore.bindMenu(marker)

mapStore.map?.setFitView()

onUnmounted(() => {
  marker.destroy()
})

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
    title && marker.setTitle(title)
  },
)

watch(
  () => markerProps.props.icon,
  icon => {
    if (icon) {
      if (typeof icon === 'string') {
        marker.setIcon(icon)
      } else if (isObject(icon)) {
        marker.setIcon(new window.AMap.Icon(icon as any))
      }
    }
  },
)

watch(
  () => markerProps.props.label,
  label => {
    label && marker.setLabel(label as any)
  },
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
    anchor && marker.setAnchor(anchor)
  },
)

watch(
  () => markerProps.props.offset,
  offset => {
    offset && marker.setOffset(offset)
  },
)

watch(
  () => markerProps.props.size,
  size => {
    size && marker.setSize(size)
  },
)

watch(
  () => markerProps.props.content,
  content => {
    content && marker.setContent(content)
  },
)
</script>
