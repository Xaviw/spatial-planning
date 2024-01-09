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

  mapStore.bindMenu(text, textProps.bindMenu)

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
    text.setText(txt!)
  },
)

watch(
  () => textProps.props.title,
  title => {
    text.setTitle(title!)
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
    text.setAnchor(anchor!)
  },
)

watch(
  () => textProps.props.angle,
  angle => {
    text.setAngle(angle!)
  },
)

watch(
  () => textProps.props.offset,
  offset => {
    text.setOffset(offset!)
  },
)

watch(
  () => textProps.props.style,
  style => {
    try {
      style = JSON.parse(style)
    } catch (error) {
      console.log('error: ', error)
    }
    text.setStyle(style || undefined)
  },
)

watch(
  () => textProps.props.zIndex,
  zIndex => {
    text.setzIndex(zIndex!)
  },
)

watch(
  () => textProps.props.zooms,
  () => {
    mapStore.map?.remove(text)
    createText()
  },
)
</script>
