<template>
  <div class="relative relative h-full min-w-400 flex">
    <Toolbar
      class="absolute left-2 top-2 z-1 rounded bg-white"
      @change="onToolChange"
    />

    <div ref="container" class="mr-2 flex-1 bg-white"></div>

    <div class="w-100 bg-white p-4"></div>
  </div>
</template>

<script setup lang="ts">
// import {} from '@sp/shared/helper/mapHelper'
import { useMap } from '@sp/shared/hooks'
import Toolbar from './toolbar.vue'

const container = ref<HTMLDivElement | null>(null)
const properties = reactive<any>({})

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
  (map, _loca) => {
    const mousetool = new AMap.MouseTool(map)
    properties.mousetool = mousetool
  },
)

function onToolChange(key?: string) {
  if (key) {
    properties.mousetool?.[key]?.()
  } else {
    properties.mousetool?.close?.()
  }
}
</script>
