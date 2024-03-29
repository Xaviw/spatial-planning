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

const textProps = defineProps<OverlayProps<'Text'>>()

const map = inject(mapKey)
const hasRightMenu = inject(hasRightMenuKey)

let text: AMap.Text

watch(
  () => map?.value,
  _map => {
    if (_map) {
      createText()
    }
  },
  {
    immediate: true,
  },
)

onUnmounted(() => {
  map?.value?.remove(text)
})

function createText() {
  text = new window.AMap.Text({
    ...textProps.props,
    style: textProps.props?.style && JSON.parse(textProps.props?.style),
  })

  text.setExtData(textProps.id)

  bindClickEvent(text, toRef(textProps))

  hasRightMenu && bindRightClickEvent(text)

  if (map?.value) {
    map?.value?.add(text)
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
      text.setStyle(style)
      // eslint-disable-next-line no-empty
    } catch {}
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
    map?.value?.remove(text)
    createText()
  },
)
</script>
