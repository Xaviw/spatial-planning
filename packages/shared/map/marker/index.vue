<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import { isObject } from 'lodash-es'
import { mapKey } from '../helper'
import type { MarkerProps } from '#/request'

const props = withDefaults(defineProps<MarkerProps>(), {})

const map = inject(mapKey)!

const marker = new window.AMap.Marker({
  ...props,
  icon: isObject(props.icon) ? new window.AMap.Icon(props.icon) : props.icon,
})
map.value.add(marker)

watch(
  () => props.title,
  title => {
    title && marker.setTitle(title)
  },
  { immediate: true },
)

watch(
  () => props.icon,
  icon => {
    if (icon) {
      if (typeof icon === 'string') {
        marker.setIcon(icon)
      } else if (isObject(icon)) {
        marker.setIcon(new window.AMap.Icon(icon as any))
      }
    }
  },
  { immediate: true },
)

watch(
  () => props.label,
  label => {
    label && marker.setLabel(label as any)
  },
  { immediate: true },
)

watch(
  () => props.extData,
  extData => {
    marker.setExtData(extData)
  },
  { immediate: true },
)

watch(
  () => props.position,
  position => {
    position && marker.setPosition(position)
  },
  { immediate: true },
)

watch(
  () => props.anchor,
  anchor => {
    anchor && marker.setAnchor(anchor)
  },
  { immediate: true },
)

watch(
  () => props.offset,
  offset => {
    offset && marker.setOffset(offset)
  },
  { immediate: true },
)

watch(
  () => props.size,
  size => {
    size && marker.setSize(size)
  },
  { immediate: true },
)

watch(
  () => props.content,
  content => {
    content && marker.setContent(content)
  },
  { immediate: true },
)
</script>
