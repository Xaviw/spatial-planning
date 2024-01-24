<!-- eslint-disable vue/valid-template-root -->
<template></template>

<script setup lang="ts">
import {
  hasRightMenuKey,
  mapKey,
  bindClickEvent,
  bindRightClickEvent,
} from '@sp/shared/helpers/map'
import { message } from 'ant-design-vue'
import { omit } from 'lodash-es'
import { getStaticFile } from '../../utils'
import type { OverlayProps } from '#/business'
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
  imageLayer.setImageUrl(getStaticFile('/failed.png'))
}

createImage()

map?.value?.setFitView()

onUnmounted(() => {
  map?.value?.removeLayer(imageLayer)
  map?.value?.remove(rectangle)
})

function createImage() {
  image.src = imageLayerProps.props.url
  imageLayer = new window.AMap.ImageLayer({
    ...imageLayerProps.props,
    url: getStaticFile('/loading.png'),
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
    imageLayer.setImageUrl(getStaticFile('/loading.png'))
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
    options && rectangle.setOptions(omit(options, 'bounds', 'url', 'opacity'))
  },
  { deep: true },
)
</script>
