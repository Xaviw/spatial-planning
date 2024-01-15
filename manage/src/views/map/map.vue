<template>
  <div ref="container" class="relative select-none">
    <div class="absolute right-0 top-0 z-1 bg-white px-4 py-2">
      <input
        id="search"
        placeholder="搜索地址"
        class="border-1 border-gray-3 rounded border-solid outline-0"
      />
      当前缩放等级：{{ zoom }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { getConfig } from '@sp/shared/apis'
import { useMap } from '@sp/shared/hooks'
import {
  useMapStore,
  arrayToPosition,
  mapKey,
  labelsLayerKey,
} from '@sp/shared/map'
import { debounce } from 'lodash-es'

const injectMap = inject(mapKey)!
const injectLabelsLayer = inject(labelsLayerKey)!

const {
  mousetool,
  polylineEditor,
  loading,
  polygonEditor,
  bezierCurveEditor,
  rectangleEditor,
  circleEditor,
  ellipseEditor,
  map,
  labelsLayer,
} = storeToRefs(useMapStore())

const container = ref<HTMLDivElement | null>(null)
const zoom = ref<number>()

loading.value = true

const config = await getConfig().send()

const plugins = [
  'AMap.AutoComplete',
  'AMap.MouseTool',
  'AMap.PolylineEditor',
  'AMap.BezierCurveEditor',
  'AMap.PolygonEditor',
  'AMap.RectangleEditor',
  'AMap.CircleEditor',
  'AMap.EllipseEditor',
  'AMap.ElasticMarker',
]
if (config.mapType && config.mapTypePosition) {
  plugins.push('AMap.MapType')
}
if (config.scalebar && config.scalebarPosition) {
  plugins.push('AMap.Scale')
}
if (config.toolbar && config.toolbarPosition) {
  plugins.push('AMap.ToolBar')
}
if (config.controlbar && config.controlbarPosition) {
  plugins.push('AMap.ControlBar')
}

useMap(
  container,
  {
    mapOptions: { ...config, mapStyle: `amap://styles/${config.mapStyle}` },
    loaderOptions: {
      plugins,
    },
  },
  (_map, _loca) => {
    loading.value = false
    map.value = _map
    injectMap.value = _map
    labelsLayer.value = new window.AMap.LabelsLayer({
      allowCollision: true,
      collision: true,
      zIndex: 999,
    })
    injectLabelsLayer.value = labelsLayer.value
    _map.add(labelsLayer.value)
    mousetool.value = new window.AMap.MouseTool(_map)
    polylineEditor.value = new window.AMap.PolygonEditor(_map)
    bezierCurveEditor.value = new window.AMap.BezierCurveEditor(_map)
    polygonEditor.value = new window.AMap.PolygonEditor(_map)
    rectangleEditor.value = new window.AMap.RectangleEditor(_map)
    circleEditor.value = new window.AMap.CircleEditor(_map)
    ellipseEditor.value = new window.AMap.EllipseEditor(_map)
    if (config.mapType && config.mapTypePosition) {
      _map.addControl(
        new (window.AMap as any).MapType({
          defaultType: config.defaultMapType,
          showTraffic: config.showTraffic,
          showRoad: config.showRoad,
          position: arrayToPosition(config.mapTypePosition),
        }),
      )
    }
    if (config.scalebar && config.scalebarPosition) {
      _map.addControl(
        new (window.AMap as any).Scale({
          position: arrayToPosition(config.scalebarPosition),
        }),
      )
    }
    if (config.scalebar && config.toolbarPosition) {
      _map.addControl(
        new (window.AMap as any).ToolBar({
          position: arrayToPosition(config.toolbarPosition),
        }),
      )
    }
    if (config.scalebar && config.controlbarPosition) {
      _map.addControl(
        new (window.AMap as any).ControlBar({
          position: arrayToPosition(config.controlbarPosition),
        }),
      )
    }
    watchZoom()
    POISearch()
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

function POISearch() {
  const autoComplete = new (window.AMap as any).AutoComplete({
    input: 'search',
    datatype: 'poi',
  })
  autoComplete.on('select', e => {
    map.value?.setZoomAndCenter(18, e.poi.location)
  })
}
</script>
