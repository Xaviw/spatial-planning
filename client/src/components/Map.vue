<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import { getConfig } from '@sp/shared/apis'
import { useMap } from '@sp/shared/hooks'
import { arrayToPosition, useMapStore } from '@sp/shared/map'

const config = await getConfig().send()

const container = ref<HTMLDivElement | null>(null)

const { map, labelsLayer } = storeToRefs(useMapStore())

const plugins = ['AMap.ElasticMarker']
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
  _map => {
    map.value = _map

    labelsLayer.value = new window.AMap.LabelsLayer({
      allowCollision: true,
      collision: true,
      zIndex: 999,
    })
    _map.add(labelsLayer.value)

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
  },
)
</script>
