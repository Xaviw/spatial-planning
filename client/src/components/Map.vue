<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import '@amap/amap-jsapi-types'

const container = ref<HTMLDivElement | null>(null)

window._AMapSecurityConfig = {
  securityJsCode: import.meta.env.VITE_AMAP_SECURITY_KEY,
}

AMapLoader.load({
  key: import.meta.env.VITE_AMAP_KEY,
  version: '2.0',
  plugins: [],
  Loca: {
    version: '2.0.0',
  },
})
  .then((AMap: typeof window.AMap) => {
    const Loca = window.Loca
    const map = new AMap.Map(container.value as HTMLDivElement, {
      viewMode: '3D',
    })

    const loca = new Loca.Container({ map })

    // 创建圆点图层
    var pointLayer = new Loca.PointLayer({
      zIndex: 10,
      opacity: 1,
      visible: true,
      blend: 'lighter',
    })

    // 创建数据源
    var dataSource = new Loca.GeoJSONSource({
      // url: 'xxx.geojson', 或者使用 data 字段
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [116.40014, 39.909736],
            },
          },
        ],
      },
    })

    // 图层添加数据
    pointLayer.setSource(dataSource)

    // 设置样式
    pointLayer.setStyle({
      radius: 30,
      color: 'red',
      borderWidth: 10,
      borderColor: '#fff',
      unit: 'px',
    })

    // 添加到地图上
    loca.add(pointLayer)
    const dat = new Loca.Dat()
    dat.addLayer(pointLayer, '示例的点图层')
  })
  .catch(e => {
    console.log(e)
  })
</script>

<style>
.amap-logo,
.amap-copyright {
  display: none !important;
}
</style>
