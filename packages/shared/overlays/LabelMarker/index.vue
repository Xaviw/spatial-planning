<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import {
  hasRightMenuKey,
  mapKey,
  bindClickEvent,
  bindRightClickEvent,
  labelsLayerKey,
} from '@sp/shared/helpers/map'
import { failed_img, loading_img } from '@sp/shared/utils'
import { message } from 'ant-design-vue'
import type { OverlayProps } from '#/overlays'
import type { AMap } from '@amap/amap-jsapi-types'

const labelMarkerProps = defineProps<OverlayProps<'LabelMarker'>>()

const map = inject(mapKey)
const hasRightMenu = inject(hasRightMenuKey)
const labelsLayer = inject(labelsLayerKey)

let labelMarker: AMap.LabelMarker
const image = new Image()
image.onload = () => {
  setIcon(image.src)
}
image.onerror = () => {
  message.error('图片加载失败，请检查链接是否正确！')
  setIcon(failed_img)
}

watch(
  () => map?.value,
  _map => {
    if (_map) {
      createLabelMarker()
    }
  },
  {
    immediate: true,
  },
)

onUnmounted(() => {
  ;(labelsLayer?.value as any)?.remove(labelMarker)
})

function createLabelMarker() {
  labelMarker = new window.AMap.LabelMarker({
    ...labelMarkerProps.props,
    icon: undefined,
  })

  setIcon()

  labelMarker.setExtData(labelMarkerProps.id)

  bindClickEvent(labelMarker, toRef(labelMarkerProps))

  hasRightMenu && bindRightClickEvent(labelMarker)

  if (map?.value) {
    ;(labelsLayer?.value as any)?.add(labelMarker)
  }
}

function setIcon(url?: string) {
  const icon = labelMarkerProps.props.icon
  const img = icon?.image
  if (img) {
    labelMarker.setIcon({
      ...icon,
      image: url || loading_img,
    })
    if (!url) image.src = img
  } else {
    labelMarker.setIcon(icon!)
  }
}

watch(
  () => labelMarkerProps.visible,
  visible => {
    if (visible) {
      labelMarker.show()
    } else {
      labelMarker.hide()
    }
  },
)

watch(
  () => labelMarkerProps.props.name,
  name => {
    labelMarker.setName(name!)
  },
)

watch(
  () => labelMarkerProps.props.position,
  position => {
    position && labelMarker.setPosition(position)
  },
)

watch(
  () => labelMarkerProps.props.zooms,
  zooms => {
    labelMarker.setZooms(zooms)
  },
)

watch(
  () => labelMarkerProps.props.opacity,
  opacity => {
    labelMarker.setOpacity(opacity!)
  },
)

watch(
  () => labelMarkerProps.props.rank,
  rank => {
    labelMarker.setRank(rank!)
  },
)

watch(
  () => labelMarkerProps.props.zIndex,
  zIndex => {
    labelMarker.setzIndex(zIndex!)
  },
)

watch(
  () => labelMarkerProps.props.icon,
  () => {
    setIcon()
  },
  { deep: true },
)

watch(
  () => labelMarkerProps.props.text,
  text => {
    labelMarker.setText(text!)
  },
  { deep: true },
)
</script>
