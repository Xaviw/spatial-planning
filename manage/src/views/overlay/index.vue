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

    <div class="w-100 bg-white p-4">
      <AInput v-model:value="code" />
      <AButton @click="ok">OK</AButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { create, data } from '@sp/shared/helper/mapHelper/circleMarker'
import { useMap } from '@sp/shared/hooks'
import { debounce } from 'lodash-es'
import Toolbar from './toolbar.vue'
import type { ToolKeys } from './data'

const container = ref<HTMLDivElement | null>(null)
const properties = reactive<{
  map: AMap.Map
  loca: Loca.Container
  mousetool: AMap.MouseTool
  proxy: AMap.MarkerOptions
}>({} as any)
const zoom = ref<number>()
const code = ref<string>()

function ok() {
  if (code.value) {
    let source: any = properties.proxy
    const parts = code.value.split('，')
    let value: any = parts.pop()
    if (value === 'true') value = true
    else if (value === 'false') value = false
    else if (/^\d+\.?\d+$/.test(value)) value = +value
    else if (value.startsWith('[')) {
      const [l, r] = value.slice(1, -1).split(',')
      value = [+l, +r]
    }
    let key: any = parts.pop()
    if (/^\d+$/.test(key)) key = +key
    for (let item of parts) {
      source = source[item]
    }
    console.log(source, value)

    source[key!] = value
  }
}

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

    zoom.value = map.getZoom()
    map.on('zoomchange', debounce(onZoomChange, 300))

    const mousetool = new AMap.MouseTool(map)
    mousetool.on('draw', e => {
      console.log(e)
    })
    properties.mousetool = mousetool

    const { proxy } = create(
      {
        source: data,
        style: {
          unit: 'meter',
          radius: (_index, f) => {
            var n = f.properties['人口']
            return n * 100
          },
          color: (_index, f) => {
            var n = Math.min(7, ~~(f.properties['人均GDP'] / 10000))
            return [
              'rgba(254,255,198,0.95)',
              'rgba(255,238,149,0.95)',
              'rgba(255,217,99,0.95)',
              'rgba(255,175,43,0.95)',
              'rgba(255,135,24,0.95)',
              'rgba(234,10,0,0.95)',
              'rgba(195,0,0,0.95)',
              'rgba(139,0,0,0.95)',
            ][n]
          },
          borderWidth: 0,
        },
      },
      loca,
    )
    properties.proxy = proxy
  },
)

function onToolChange(key?: ToolKeys) {
  if (key) {
    properties.map.setDefaultCursor('crosshair')
    properties.mousetool?.[key]({})
  } else {
    properties.map.setDefaultCursor('inherit')
    properties.mousetool?.close(false)
  }
}

function onZoomChange() {
  zoom.value = properties.map.getZoom()
}
</script>
