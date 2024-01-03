<template>
  <div ref="container" class="relative">
    <div class="absolute right-0 top-0 z-1 bg-white px-4 py-2">
      当前缩放等级：{{ zoom }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMap } from '@sp/shared/hooks'
import { useMapStore } from '@sp/shared/map'
import { debounce } from 'lodash-es'

const { map, loca, mousetool } = storeToRefs(useMapStore())

const container = ref<HTMLDivElement | null>(null)
const zoom = ref<number>()

useMap(
  container,
  {
    mapOptions: {
      viewMode: '3D',
      mapStyle: 'amap://styles/blue',
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
  (_map, _loca) => {
    map.value = _map
    loca.value = _loca
    mousetool.value = new window.AMap.MouseTool(_map)
    watchZoom()
  },
)
function watchZoom() {
  zoom.value = map.value?.getZoom()
  map.value?.on(
    'zoomchange',
    debounce(() => {
      zoom.value = map.value?.getZoom()
    }, 500),
  )
}
</script>
