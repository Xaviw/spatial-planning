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
import type { OverlayProps } from '#/overlays'
import type { AMap } from '@amap/amap-jsapi-types'

const imageLayerProps = defineProps<OverlayProps<'ImageLayer'>>()

const map = inject(mapKey)
const hasRightMenu = inject(hasRightMenuKey)

let imageLayer: AMap.ImageLayer
let rectangle: AMap.Rectangle
const image = new Image()
image.onload = () => {
  imageLayer.setImageUrl(image.src)
}
image.onerror = () => {
  message.error('图片加载失败，请检查链接是否正确！')
  imageLayer.setImageUrl(failed_img)
}

watch(
  () => map?.value,
  _map => {
    if (_map) {
      createImage()
    }
  },
  {
    immediate: true,
  },
)

onUnmounted(() => {
  // HACK: 测试时removeLayer调用后图层仍然显示，用hide模拟销毁
  imageLayer.hide()
  map?.value?.removeLayer(imageLayer)
  map?.value?.remove(rectangle)
})

function createImage() {
  image.src = imageLayerProps.props.url
  imageLayer = new window.AMap.ImageLayer({
    ...imageLayerProps.props,
    url: loading_img,
  })

  const [minLng, minLat, maxLng, maxLat] = imageLayerProps.props.bounds
  rectangle = new window.AMap.Rectangle({
    bounds: new window.AMap.Bounds([minLng, minLat], [maxLng, maxLat]),
    zIndex: 7,
    cursor: 'pointer',
    strokeOpacity: 0,
    fillOpacity: 0,
  })
  rectangle.setExtData(imageLayerProps.id)

  bindClickEvent(rectangle, toRef(imageLayerProps))

  hasRightMenu && bindRightClickEvent(rectangle)

  if (map?.value) {
    map?.value?.addLayer(imageLayer)
    map?.value?.add(rectangle)
  }
}

watch(
  () => imageLayerProps.visible,
  visible => {
    if (visible) {
      imageLayer.show()
      rectangle.show()
    } else {
      imageLayer.hide()
      rectangle.hide()
    }
  },
)

watch(
  () => imageLayerProps.props.bounds,
  bounds => {
    if (!bounds) return
    const [minLng, minLat, maxLng, maxLat] = bounds
    imageLayer.setBounds(
      new window.AMap.Bounds([minLng, minLat], [maxLng, maxLat]),
    )
    rectangle.setBounds(
      new window.AMap.Bounds([minLng, minLat], [maxLng, maxLat]),
    )
  },
)

watch(
  () => imageLayerProps.props.url,
  url => {
    image.src = url
    imageLayer.setImageUrl(loading_img)
  },
)

watch(
  () => imageLayerProps.props.zIndex,
  zIndex => {
    imageLayer.setzIndex(zIndex!)
  },
)

watch(
  () => imageLayerProps.props.opacity,
  opacity => {
    imageLayer.setOpacity(opacity!)
  },
)

watch(
  () => imageLayerProps.props.zooms,
  zooms => {
    imageLayer.setZooms(zooms!)
  },
)

watch(
  () => imageLayerProps.props,
  options => {
    const { bounds, url, opacity, ...option } = options
    options && rectangle.setOptions(option)
  },
  { deep: true },
)
</script>
