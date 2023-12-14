<template>
  <div class="relative h-full min-w-400 flex">
    <div ref="container" class="mr-2 flex-1 bg-white"></div>

    <div class="w-100 bg-white p-4"></div>
  </div>
</template>

<script setup lang="ts">
import { useMap } from '@sp/shared/hooks'

const container = ref<HTMLDivElement | null>(null)

useMap({
  container,
  mapOptions: {
    viewMode: '3D',
    mapStyle: 'amap://styles/blue',
    zooms: [5, 24],
    zoom: 18,
  },
  loaderOptions: {
    plugins: ['AMap.MoveAnimation'],
  },
  enableLoca: true,
  onComplete(_map, loca) {
    new window.Loca.Legend({
      loca,
      title: {
        label: '图例测试',
        fontSize: '18px',
        fontColor: 'red',
      },
      style: {
        left: '10px',
        bottom: '10px',
      },
      dataMap: [
        { label: 'a', color: '#fff' },
        { label: 'b', color: '#000' },
        { label: 'c', color: '#999' },
      ],
    })
  },
})
</script>
