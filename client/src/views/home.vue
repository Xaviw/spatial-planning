<template>
  <div
    class="h-screen w-screen flex flex-col overflow-hidden bg-[#001231] text-white"
  >
    <!-- 顶部 -->
    <Header class="z-201" />

    <div class="min-h-0 flex flex-1">
      <!-- 左侧 -->
      <Sider position="left" />

      <div class="relative flex flex-1 flex-col">
        <Loading absolute :loading="menuLoading || mapLoading" />

        <!-- 菜单 -->
        <Menu class="absolute left-6 top-4 z-200" />

        <!-- 地图 -->
        <Suspense>
          <Map class="flex-1" />
          <template #fallback>
            <div class="flex-1"></div>
          </template>
        </Suspense>

        <!-- 图例 -->
        <Layer
          :open="layerOpen"
          @trigger="layerOpen = !layerOpen"
          class="max-h-40"
        />
      </div>

      <!-- 右侧 -->
      <Sider position="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@sp/shared/components'
import { hasRightMenuKey, labelsLayerKey, mapKey } from '@sp/shared/map'
import { useMainStore } from '../store/main'
import type { AMap } from '@amap/amap-jsapi-types'

const { menuLoading, mapLoading } = storeToRefs(useMainStore())

const layerOpen = ref(true)

provide(mapKey, ref<AMap.Map>())
provide(labelsLayerKey, ref<AMap.LabelsLayer>())
provide(hasRightMenuKey, false)
</script>
