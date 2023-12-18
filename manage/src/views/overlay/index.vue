<template>
  <div class="relative relative h-full min-w-400 flex">
    <Toolbar
      class="absolute left-2 top-2 z-1 rounded bg-white"
      @change="onToolChange"
    />

    <div ref="container" class="relative mr-2 flex-1 bg-white">
      <div class="absolute right-0 top-0 z-1 bg-white px-4 py-2">
        当前缩放等级：{{ zoom }}
      </div>
    </div>

    <div class="w-100 bg-white p-4"></div>
  </div>
</template>

<script setup lang="ts">
// import {} from '@sp/shared/helper/mapHelper'
import { useMap } from '@sp/shared/hooks'
import { debounce } from 'lodash-es'
import Toolbar from './toolbar.vue'
import type { ToolKeys } from './data'

const container = ref<HTMLDivElement | null>(null)
const properties = reactive<{
  map: AMap.Map
  loca: Loca.Container
  mousetool: AMap.MouseTool
}>({} as any)
const zoom = ref<number>()

useMap(
  container,
  {
    mapOptions: {
      viewMode: '3D',
      mapStyle: 'amap://styles/blue',
      zooms: [5, 24],
      zoom: 18,
    },
    loaderOptions: {
      plugins: [
        'AMap.MouseTool',
        'AMap.MoveAnimation',
        'AMap.PolylineEditor',
        'AMap.PolygonEditor',
        'AMap.RectangleEditor',
        'AMap.CircleEditor',
        'AMap.EllipseEditor',
        'AMap.BezierCurveEditor',
      ],
    },
    enableLoca: true,
  },
  (map, loca) => {
    properties.map = map
    properties.loca = loca
    const mousetool = new AMap.MouseTool(map)
    properties.mousetool = mousetool
    zoom.value = map.getZoom()
    map.on('zoomchange', debounce(onZoomChange, 300))
  },
)

function onToolChange(key?: ToolKeys) {
  if (key) {
    properties.mousetool?.[key]?.({})
  } else {
    properties.mousetool?.close?.(false)
  }
}

function onZoomChange() {
  zoom.value = properties.map.getZoom()
}
</script>
