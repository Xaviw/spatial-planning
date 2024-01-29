<template>
  <div ref="container" class="text-black"></div>
</template>

<script setup lang="ts">
import { getConfig } from '@sp/shared/apis'
import { arrayToPosition, labelsLayerKey, mapKey } from '@sp/shared/helpers/map'
import { useMap } from '@sp/shared/hooks'

const config = await getConfig().send()

const map = inject(mapKey)!
const labelsLayer = inject(labelsLayerKey)!

const container = ref<HTMLDivElement | null>(null)

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
    // 初次加载因为地图渲染会有延迟导致layer组件updated时覆盖物可能还未渲染，所以这这里使用nextTick fitView
    // 后续切换菜单在layer updated事件中fitView
    nextTick(() => {
      _map.setFitView()
    })

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
