<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import { isObject, omit } from 'lodash-es'
import { bindMenu, mapKey } from '../utils'
import type { OverlayItem } from '#/business'

const componentProps = defineProps<OverlayItem<'Marker'>>()

const map = inject(mapKey)

const marker = new window.AMap.Marker({
  ...componentProps.props,
  icon:
    componentProps.props.icon && typeof componentProps.props.icon === 'object'
      ? new window.AMap.Icon(componentProps.props.icon)
      : componentProps.props.icon,
  map: map?.value,
})

marker.setExtData(omit({ ...componentProps }, 'visible'))

bindMenu(marker)

map?.value?.setFitView()

onUnmounted(() => {
  marker.destroy()
})

watch(
  () => componentProps.visible,
  visible => {
    if (visible) {
      marker.show()
    } else {
      marker.hide()
    }
  },
)

watch(
  () => componentProps.props.title,
  title => {
    title && marker.setTitle(title)
  },
)

watch(
  () => componentProps.props.icon,
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
  () => componentProps.props.label,
  label => {
    label && marker.setLabel(label as any)
  },
)

watch(
  () => componentProps.props.extData,
  extData => {
    marker.setExtData(extData)
  },
)

watch(
  () => componentProps.props.position,
  position => {
    position && marker.setPosition(position)
  },
)

watch(
  () => componentProps.props.anchor,
  anchor => {
    anchor && marker.setAnchor(anchor)
  },
)

watch(
  () => componentProps.props.offset,
  offset => {
    offset && marker.setOffset(offset)
  },
)

watch(
  () => componentProps.props.size,
  size => {
    size && marker.setSize(size)
  },
)

watch(
  () => componentProps.props.content,
  content => {
    content && marker.setContent(content)
  },
)
</script>
