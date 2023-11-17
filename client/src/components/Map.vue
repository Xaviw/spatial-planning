<template>
  <div ref="container"></div>
</template>

<script setup lang="ts">
import { useMap } from '@sp/shared/hooks'

const container = ref<HTMLDivElement | null>(null)

useMap({
  container: container as Ref<HTMLDivElement>,
  mapOptions: {
    viewMode: '3D',
    mapStyle: 'amap://styles/blue',
    zooms: [5, 24],
    zoom: 18,
  },
})
</script>

<style>
.amap-logo,
.amap-copyright {
  display: none !important;
}
</style>
