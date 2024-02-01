<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import {
  hasRightMenuKey,
  mapKey,
  bindClickEvent,
  bindRightClickEvent,
} from '@sp/shared/helpers/map'
import { failed_img, loading_img, default_marker_img } from '@sp/shared/utils'
import { message } from 'ant-design-vue'
import { isEmpty } from 'ramda'
import type { OverlayProps } from '#/overlays'
import type { AMap } from '@amap/amap-jsapi-types'

const markerProps = defineProps<OverlayProps<'Marker'>>()

const map = inject(mapKey)
const hasRightMenu = inject(hasRightMenuKey)
const image = new Image()
image.onload = () => {
  setIcon(image.src)
}
image.onerror = () => {
  message.error('图片加载失败，请检查链接是否正确！')
  setIcon(failed_img)
}

let marker: AMap.Marker

watch(
  () => map?.value,
  _map => {
    if (_map) {
      createMarker()
    }
  },
  {
    immediate: true,
  },
)

onUnmounted(() => {
  map?.value?.remove(marker)
})

function createMarker() {
  marker = new window.AMap.Marker({
    ...markerProps.props,
    icon: undefined,
  })

  setIcon()

  marker.setExtData(markerProps.id)

  bindClickEvent(marker, toRef(markerProps))

  hasRightMenu && bindRightClickEvent(marker)

  if (map?.value) {
    map?.value?.add(marker)
  }
}

function setIcon(url?: string) {
  // 设置图片再清除时不会显示默认图标，所以采用模拟默认图片并在每次修改重新设置的方案
  const iconProps = markerProps.props.icon
  const img = iconProps?.image || default_marker_img
  const size = iconProps?.size && !isEmpty(iconProps.size) && iconProps.size
  const imageSize =
    iconProps?.imageSize && !isEmpty(iconProps.imageSize) && iconProps.imageSize

  const options: AMap.IconOpts = {
    ...iconProps,
    image: url || loading_img,
    size: size || imageSize || [19, 32],
    imageSize: imageSize || size || [19, 32],
  }
  const icon = new window.AMap.Icon(options)

  marker.setIcon(icon)
  if (!url) image.src = img
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
  () => {
    setIcon()
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
