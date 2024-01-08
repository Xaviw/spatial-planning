<template>
  <div ref="container" class="relative select-none">
    <div class="absolute right-0 top-0 z-1 bg-white px-4 py-2">
      当前缩放等级：{{ zoom }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { getConfig } from '@sp/shared/apis'
import { useMap } from '@sp/shared/hooks'
import { useMapStore, arrayToPosition } from '@sp/shared/map'
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

const configs = await getConfig().send()

const plugins = [
  'AMap.MouseTool',
  'AMap.PolylineEditor',
  'AMap.BezierCurveEditor',
  'AMap.PolygonEditor',
  'AMap.RectangleEditor',
  'AMap.CircleEditor',
  'AMap.EllipseEditor',
  'AMap.ElasticMarker',
]
if (configs.scalebar && configs.scalebarPosition) {
  plugins.push('AMap.Scale')
}
if (configs.toolbar && configs.toolbarPosition) {
  plugins.push('AMap.ToolBar')
}
if (configs.controlbar && configs.controlbarPosition) {
  plugins.push('AMap.ControlBar')
}

useMap(
  container,
  {
    mapOptions: {
      mapStyle: 'amap://styles/blue',
      ...configs,
    },
    loaderOptions: {
      plugins,
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
    if (configs.scalebar && configs.scalebarPosition) {
      _map.addControl(
        new (window.AMap as any).Scale({
          position: arrayToPosition(configs.scalebarPosition),
        }),
      )
    }
    if (configs.scalebar && configs.toolbarPosition) {
      _map.addControl(
        new (window.AMap as any).ToolBar({
          position: arrayToPosition(configs.toolbarPosition),
        }),
      )
    }
    if (configs.scalebar && configs.controlbarPosition) {
      _map.addControl(
        new (window.AMap as any).ControlBar({
          position: arrayToPosition(configs.controlbarPosition),
        }),
      )
    }
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
