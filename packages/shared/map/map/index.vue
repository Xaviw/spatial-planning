<template>
  <div ref="container">
    <slot v-if="rendered" />
  </div>
</template>

<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import { mapKey } from '../helper'
import type { AMap } from '@amap/amap-jsapi-types'

const props = withDefaults(
  defineProps<{
    options?: AMap.MapOptions
  }>(),
  {
    options: () => ({}),
  },
)

const container = ref<HTMLDivElement | null>(null)
const map = ref<AMap.Map>()
const rendered = ref(false)

provide(mapKey, map as Ref<AMap.Map>)

onMounted(() => {
  if (!window._AMapSecurityConfig) {
    window._AMapSecurityConfig = {
      securityJsCode: import.meta.env.VITE_AMAP_SECURITY_KEY,
    }
  }

  AMapLoader.load({
    key: import.meta.env.VITE_AMAP_KEY,
    version: '2.0',
    ...props.options,
  }).then(() => {
    map.value = new window.AMap.Map(container.value as HTMLDivElement)
    rendered.value = true
  })
})
</script>
