<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import {
  hasRightMenuKey,
  mapKey,
  bindClickEvent,
  bindRightClickEvent,
} from '@sp/shared/helpers/map'
import { failed_img, loading_img } from '@sp/shared/utils'
import { message } from 'ant-design-vue'
import type {
  ElasticMarker,
  OverlayProps,
  ElasticMarkerProps,
} from '#/overlays'

const elasticMarkerProps = defineProps<OverlayProps<'ElasticMarker'>>()

const map = inject(mapKey)
const hasRightMenu = inject(hasRightMenuKey)

let elasticMarker: ElasticMarker

const image = new Image()
image.onload = () => {
  setStyle(image.src)
}
image.onerror = () => {
  message.error('图片加载失败，请检查链接是否正确！')
  setStyle(failed_img)
}

watch(
  () => map?.value,
  _map => {
    if (_map) {
      createElasticMarker()
    }
  },
  {
    immediate: true,
  },
)

onUnmounted(() => {
  map?.value?.remove(elasticMarker as any)
})

function createElasticMarker() {
  elasticMarker = new (window.AMap as any).ElasticMarker({
    ...elasticMarkerProps.props,
    zoomStyleMapping: {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
      13: 0,
      14: 0,
      15: 0,
      16: 0,
      17: 0,
      18: 0,
      19: 0,
      20: 0,
      21: 0,
      22: 0,
      23: 0,
      24: 0,
      25: 0,
      26: 0,
    },
    styles: undefined,
  } as ElasticMarkerProps)

  setStyle()

  elasticMarker.setExtData(elasticMarkerProps.id)

  bindClickEvent(elasticMarker, toRef(elasticMarkerProps))

  hasRightMenu && bindRightClickEvent(elasticMarker)

  if (map?.value) {
    map?.value?.add(elasticMarker as any)
  }
}

function setStyle(url?: string) {
  const styles = elasticMarkerProps.props.styles?.[0]
  const icon = styles?.icon
  const img = icon?.img
  if (img) {
    elasticMarker.setStyle([
      {
        ...styles,
        icon: {
          ...icon,
          img: url || loading_img,
        },
      },
    ])
    if (!url) image.src = img
  } else {
    elasticMarker.setStyle(elasticMarkerProps.props.styles!)
  }
}

watch(
  () => elasticMarkerProps.visible,
  visible => {
    if (visible) {
      elasticMarker.show()
    } else {
      elasticMarker.hide()
    }
  },
)

watch(
  () => elasticMarkerProps.props.position,
  position => {
    position && elasticMarker.setPosition(position)
  },
)

watch(
  () => elasticMarkerProps.props.zIndex,
  zIndex => {
    elasticMarker.setzIndex(zIndex!)
  },
)

watch(
  () => elasticMarkerProps.props.offset,
  offset => {
    elasticMarker.setOffset(offset!)
  },
)

watch(
  () => elasticMarkerProps.props.styles,
  () => {
    setStyle()
  },
  { deep: true },
)

watch(
  () => elasticMarkerProps.props.anchor,
  anchor => {
    elasticMarker.setAnchor(anchor!)
  },
)
</script>
