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
            <div class="flex flex-1 items-center justify-center text-black">
              地图参数获取失败，请尝试刷新页面！
            </div>
          </template>
        </Suspense>

        <!-- 图例 -->
        <Layer
          :open="layoutState.bottom"
          @trigger="layoutState.bottom = !layoutState.bottom"
          class="max-h-40 overflow-auto"
        />
      </div>

      <!-- 右侧 -->
      <Sider position="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@sp/shared/components'
import Layer from '../components/Layer.vue'
import Sider from '../components/Sider.vue'
import { useMainStore } from '../store/main'

const { menuLoading, mapLoading } = storeToRefs(useMainStore())

const layoutState = reactive({
  left: true,
  right: true,
  bottom: true,
})
</script>

<style scoped>
.arrow {
  @apply py-2 absolute top-[50%] translate-y-[50%] flex items-center justify-center;
}
</style>
