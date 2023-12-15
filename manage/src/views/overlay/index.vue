<template>
  <div class="relative h-full min-w-400 flex">
    <div ref="container" class="mr-2 flex-1 bg-white"></div>

    <div class="w-100 bg-white p-4">
      <AInput v-model:value="type" />
      <AInput v-model:value="key" />
      <AInput v-model:value="value" />
      <AButton @click="setting">OK</AButton>
      <AButton @click="add">add</AButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { createLegendProxy } from '@sp/shared/helper/mapHelper'
import { useMap } from '@sp/shared/hooks'

const container = ref<HTMLDivElement | null>(null)

const type = ref()
const key = ref()
const value = ref()
const proxy = ref<any>()

function setting() {
  proxy.value[type.value][key.value] = value.value
}

function add() {
  proxy.value.dataMap.push({ label: 'ggg', color: '#f00' })
}

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
    proxy.value = createLegendProxy(
      {
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
          { label: 'a', color: '#f00' },
          { label: 'b', color: '#0f0' },
          { label: 'c', color: '#00f' },
        ],
      },
      loca,
    )
  },
})
</script>
