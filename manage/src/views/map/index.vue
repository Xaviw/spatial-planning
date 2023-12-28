<template>
  <Map
    class="h-full"
    :options="{
      viewMode: '3D',
      mapStyle: 'amap://styles/blue',
      zooms: [5, 24],
      zoom: 18,
    }"
  >
    <Marker
      v-for="item of data?.[0]?.overlays || []"
      :key="item.id"
      v-bind="item.props"
    />
  </Map>
</template>

<script setup lang="ts">
import { getMap } from '@sp/shared/apis'
import { Map, Marker } from '@sp/shared/map'
import { useRequest } from 'alova'

const { data } = useRequest(() => getMap('11', false), {
  initialData: [],
})
</script>
