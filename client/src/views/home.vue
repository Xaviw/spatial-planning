<template>
  <div
    class="h-screen w-screen flex flex-col overflow-hidden bg-[#001231] text-white"
  >
    <!-- 顶部 -->
    <Header class="z-201" />

    <div class="min-h-0 flex flex-1">
      <!-- 左侧 -->
      <div
        :class="[
          'relative',
          'w-100',
          'transition-all',
          'z-1',
          !layoutState.left && 'ml--100',
        ]"
      >
        <Sider :data="leftData" :loading="menuLoading || leftLoading" />

        <div
          class="trigger arrow right-0 translate-x-[100%] rounded-r"
          @click="layoutState.left = !layoutState.left"
        >
          <i
            :class="[
              'i-material-symbols:arrow-forward-ios',
              'transition-all',
              layoutState.left && 'rotate-180',
            ]"
          />
        </div>
      </div>

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
          :open="layoutState.bottom"
          @trigger="layoutState.bottom = !layoutState.bottom"
          class="max-h-40 overflow-auto"
        />
      </div>

      <!-- 右侧 -->
      <div
        :class="[
          'relative',
          'w-100',
          'transition-all',
          !layoutState.right && 'mr--100',
        ]"
      >
        <Sider :data="rightData" :loading="menuLoading || rightLoading" />

        <div
          class="trigger arrow left-0 translate-x-[-100%] rounded-l"
          @click="layoutState.right = !layoutState.right"
        >
          <i
            :class="[
              'i-material-symbols:arrow-forward-ios',
              'transition-all',
              !layoutState.right && 'rotate-180',
            ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@sp/shared/components'
import { useMapStore } from '@sp/shared/map'
import Layer from '../components/Layer.vue'
import { useMainStore } from '../store/main'

const { leftData, rightData, leftLoading, rightLoading, menuLoading } =
  storeToRefs(useMainStore())

const { loading: mapLoading } = storeToRefs(useMapStore())

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
