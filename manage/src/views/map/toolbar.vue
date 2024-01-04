<template>
  <div class="flex flex-col items-center">
    <template v-for="item of list" :key="item.key">
      <ATooltip :title="item.name" placement="right">
        <div
          :class="[
            'h-10',
            'w-10',
            'flex',
            'items-center',
            'justify-center',
            'text-xl',
            'hover:bg-blue',
            'hover:text-white',
            item.key === activeTool && 'bg-blue text-white',
          ]"
          :style="item.style"
          @click="mapStore.toolManage(item)"
        >
          <i :class="item.icon" />
        </div>
      </ATooltip>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useMapStore } from '@sp/shared/map'
import { message } from 'ant-design-vue'
import type {
  CircleProps,
  MapEvent,
  MarkerProps,
  OverlayItem,
  OverlayType,
  PolylineProps,
  RectangleProps,
  ToolItem,
} from '#/business'
import type { AMap } from '@amap/amap-jsapi-types'

const mapStore = useMapStore()

const { activeTool, mousetool, map, activeLayer, mapData } =
  storeToRefs(mapStore)

const list: ToolItem[] = [
  {
    icon: 'i-material-symbols:location-on',
    name: '点',
    key: 'marker',
    handler: () => {
      mousetool.value?.marker({})
    },
  },
  {
    icon: 'i-material-symbols:polyline-outline',
    name: '直线',
    key: 'polyline',
    handler: () => {
      mousetool.value?.polyline({})
    },
  },
  {
    icon: 'i-bi:bezier2',
    name: '区线',
    key: 'bezierCurve',
    handler: () => {
      const centerLnglat = map.value!.getCenter()
      const centerPixel = map.value!.lngLatToContainer(centerLnglat)

      const leftPixel = [centerPixel.x - 100, centerPixel.y]
      const controlPixel1 = [centerPixel.x - 50, centerPixel.y - 50]
      const controlPixel2 = [centerPixel.x + 50, centerPixel.y + 50]
      const rightPixel = [centerPixel.x + 100, centerPixel.y]

      const leftLnglat = map.value!.containerToLngLat(leftPixel)
      const controlLnglat1 = map.value!.containerToLngLat(controlPixel1)
      const controlLnglat2 = map.value!.containerToLngLat(controlPixel2)
      const rightLnglat = map.value!.containerToLngLat(rightPixel)

      const layerIndex = mapData.value.findIndex(
        item => item.id === activeLayer.value,
      )
      mapData.value[layerIndex].overlays.push({
        createTime: new Date().toLocaleString(),
        details: [],
        id: `add_${Date.now()}`,
        layerId: activeLayer.value!,
        name: '',
        props: {
          path: [
            [leftLnglat.lng, leftLnglat.lat],
            [
              controlLnglat1.lng,
              controlLnglat1.lat,
              controlLnglat2.lng,
              controlLnglat2.lat,
              rightLnglat.lng,
              rightLnglat.lat,
            ],
          ],
        },
        status: true,
        type: 'BezierCurve',
      })
      message.info('请右击地图中心新增的曲线进行编辑！')
      mapStore.toolManage()
    },
  },
  {
    icon: 'i-ph:polygon',
    name: '多边形',
    key: 'polygon',
    handler: () => {
      mousetool.value?.polygon({})
    },
  },
  {
    icon: 'i-mdi:vector-rectangle',
    name: '矩形',
    key: 'rectangle',
    handler: () => {
      mousetool.value?.rectangle({})
    },
  },
  {
    icon: 'i-mdi:circle-outline',
    name: '圆',
    key: 'circle',
    handler: () => {
      mousetool.value?.circle({})
    },
  },
  {
    icon: 'i-mdi:ellipse-outline',
    name: '椭圆',
    key: 'ellipse',
    handler: () => {
      const centerLnglat = map.value!.getCenter()
      const centerPixel = map.value!.lngLatToContainer(centerLnglat)

      const leftPixel = [centerPixel.x - 100, centerPixel.y]
      const topPixel = [centerPixel.x, centerPixel.y - 50]

      const leftLnglat = map.value!.containerToLngLat(leftPixel)
      const topLnglat = map.value!.containerToLngLat(topPixel)

      const xDistance = centerLnglat.distance(leftLnglat)
      const yDistance = centerLnglat.distance(topLnglat)

      const layerIndex = mapData.value.findIndex(
        item => item.id === activeLayer.value,
      )
      mapData.value[layerIndex].overlays.push({
        createTime: new Date().toLocaleString(),
        details: [],
        id: `add_${Date.now()}`,
        layerId: activeLayer.value!,
        name: '',
        props: {
          center: [centerLnglat.lng, centerLnglat.lat],
          radius: [xDistance, yDistance],
        },
        status: true,
        type: 'Ellipse',
      })
      message.info('请右击地图中心新增的椭圆进行编辑！')
      mapStore.toolManage()
    },
  },
  {
    icon: 'i-ph:text-t',
    name: '文字',
    key: 'text',
    handler: () => {
      const centerLnglat = map.value!.getCenter()

      const layerIndex = mapData.value.findIndex(
        item => item.id === activeLayer.value,
      )
      mapData.value[layerIndex].overlays.push({
        createTime: new Date().toLocaleString(),
        details: [],
        id: `add_${Date.now()}`,
        layerId: activeLayer.value!,
        name: '',
        props: {
          position: [centerLnglat.lng, centerLnglat.lat],
          text: '新增文本',
        },
        status: true,
        type: 'Text',
      })
      message.info('请右击地图中心新增的文本进行编辑！')
      mapStore.toolManage()
    },
  },
  {
    icon: 'i-material-symbols:image-outline',
    name: '贴图',
    key: 'image',
    style: 'border-bottom: 3px solid #666',
    handler: () => {},
  },
  { icon: 'i-ph:ruler', name: '距离测量', key: 'rule', handler: () => {} },
  {
    icon: 'i-radix-icons:ruler-square',
    name: '面积测量',
    key: 'measureArea',
    handler: () => {},
  },
]

watchEffect(() => {
  if (mousetool.value) {
    ;(mousetool.value as any).on(
      'draw',
      ({ obj }: { obj: MapEvent['target'] }) => {
        const layerIndex = mapData.value.findIndex(
          item => item.id === activeLayer.value,
        )
        const baseData: OverlayItem<OverlayType> = {
          createTime: new Date().toLocaleString(),
          details: [],
          id: `add_${Date.now()}`,
          layerId: activeLayer.value!,
          name: '',
          props: {},
          status: true,
          type: 'Marker',
        }

        if (obj instanceof window.AMap.Marker) {
          const pos = obj.getPosition()!
          ;(baseData.props as MarkerProps).position = [pos.lng, pos.lat]
          mapData.value[layerIndex].overlays.push(baseData)
        } else if (
          obj instanceof window.AMap.Polyline ||
          obj instanceof window.AMap.Polygon
        ) {
          const path = obj.getPath() as AMap.LngLat[]
          ;(baseData.props as PolylineProps).path = path.map(item => [
            item.lng,
            item.lat,
          ])
          if (obj instanceof window.AMap.Polyline) {
            baseData.type = 'Polyline'
          } else if (obj instanceof window.AMap.Polygon) {
            baseData.type = 'Polygon'
          }
          mapData.value[layerIndex].overlays.push(baseData)
        } else if (obj instanceof window.AMap.Rectangle) {
          const bounds = obj.getBounds()!
          const sw = bounds.getSouthWest()
          const ne = bounds.getNorthEast()
          ;(baseData.props as RectangleProps).bounds = [
            [sw.lng, sw.lat],
            [ne.lng, ne.lat],
          ]
          baseData.type = 'Rectangle'
          mapData.value[layerIndex].overlays.push(baseData)
        } else if (obj instanceof window.AMap.Circle) {
          const center = obj.getCenter()
          const radius = obj.getRadius()
          ;(baseData.props as CircleProps).center = [center.lng, center.lat]
          ;(baseData.props as CircleProps).radius = radius
          baseData.type = 'Circle'
          mapData.value[layerIndex].overlays.push(baseData)
        }

        map.value?.remove(obj)
      },
    )
  }
})
</script>
