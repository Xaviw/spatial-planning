<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import { useMapStore } from '../mapStore'
import type { OverlayProps } from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const textProps = defineProps<OverlayProps<'Text'>>()

const mapStore = useMapStore()

let text: AMap.Text

createText()

mapStore.map?.setFitView()

onUnmounted(() => {
  mapStore.map?.remove(text)
})

function createText() {
  text = new window.AMap.Text({
    ...textProps.props,
  })

  text.setExtData(textProps.id)

  mapStore.bindMenu(text)

  if (mapStore.map) {
    mapStore.map.add(text)
  }
}

watch(
  () => textProps.visible,
  visible => {
    if (visible) {
      text.show()
    } else {
      text.hide()
    }
  },
)

watch(
  () => textProps.props.text,
  txt => {
    txt && text.setText(txt)
  },
)

watch(
  () => textProps.props.title,
  title => {
    title && text.setTitle(title)
  },
)

watch(
  () => textProps.props.position,
  position => {
    position && text.setPosition(position)
  },
)

watch(
  () => textProps.props.anchor,
  anchor => {
    anchor && text.setAnchor(anchor)
  },
)

watch(
  () => textProps.props.angle,
  angle => {
    typeof angle === 'number' && text.setAngle(angle)
  },
)

watch(
  () => textProps.props.offset,
  offset => {
    offset && text.setOffset(offset)
  },
)

watch(
  () => textProps.props.zIndex,
  zIndex => {
    typeof zIndex === 'number' && text.setzIndex(zIndex)
  },
)

watch(
  () => textProps.props.zooms,
  zooms => {
    if (zooms) {
      mapStore.map?.remove(text)
      createText()
    }
  },
)
</script>
