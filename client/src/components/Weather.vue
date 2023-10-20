<template>
  <div id="he-plugin-simple" class="z-1"></div>
</template>

<script setup lang="ts">
import { useScript } from '@sp/shared'

onMounted(() => {
  window.WIDGET = {
    CONFIG: {
      modules: '0234',
      background: '5',
      tmpColor: 'FFFFFF',
      tmpSize: '30',
      cityColor: 'FFFFFF',
      citySize: '30',
      aqiColor: 'FFFFFF',
      aqiSize: '30',
      weatherIconSize: '30',
      alertIconSize: '18',
      padding: '10px 10px 10px 10px',
      shadow: '0',
      language: 'zh',
      fixed: 'false',
      vertical: 'center',
      horizontal: 'center',
      city: 'CN101270101',
      key: '261241a34ca44f0d960d7be025cbae7f',
    },
  }
})

useScript({
  src: 'https://widget.qweather.net/simple/static/js/he-simple-common.js?v=2.0',
})
</script>
