<template>
  <div ref="container" class="relative select-none">
    <div class="absolute right-0 top-0 z-1 bg-white px-4 py-2">
      当前缩放等级：{{ zoom }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMap } from '@sp/shared/hooks'
import { useMapStore } from '@sp/shared/map'
import { debounce } from 'lodash-es'

const {
  map,
  loca,
  mousetool,
  polylineEditor,
  loading,
  polygonEditor,
  bezierCurveEditor,
  rectangleEditor,
  circleEditor,
  ellipseEditor,
  labelsLayer,
} = storeToRefs(useMapStore())

const container = ref<HTMLDivElement | null>(null)
const zoom = ref<number>()

loading.value = true

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
        'AMap.PolylineEditor',
        'AMap.BezierCurveEditor',
        'AMap.PolygonEditor',
        'AMap.RectangleEditor',
        'AMap.CircleEditor',
        'AMap.EllipseEditor',
        'AMap.ElasticMarker',
      ],
    },
    enableLoca: true,
  },
  (_map, _loca) => {
    loading.value = false
    map.value = _map
    loca.value = _loca
    labelsLayer.value = new window.AMap.LabelsLayer({
      allowCollision: true,
      collision: true,
      zIndex: 999,
    })
    _map.add(labelsLayer.value)
    mousetool.value = new window.AMap.MouseTool(_map)
    polylineEditor.value = new window.AMap.PolygonEditor(_map)
    bezierCurveEditor.value = new window.AMap.BezierCurveEditor(_map)
    polygonEditor.value = new window.AMap.PolygonEditor(_map)
    rectangleEditor.value = new window.AMap.RectangleEditor(_map)
    circleEditor.value = new window.AMap.CircleEditor(_map)
    ellipseEditor.value = new window.AMap.EllipseEditor(_map)
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
