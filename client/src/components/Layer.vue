<template>
  <div
    :class="[
      'relative',
      'transition-all',
      !open && 'mb--20',
      'flex',
      'items-center',
      'flex-wrap',
      'z-10002',
    ]"
  >
    <!-- 功能按钮 -->
    <div
      class="absolute left-0 top-0 z-10001 flex translate-y-[-100%] text-10px"
    >
      <div class="trigger px-2 py-1" @click="$emit('trigger')">
        {{ `${open ? '折叠' : '展开'}图例` }}
      </div>

      <div class="w-1px bg-[#ffe14d] py-1 opacity-50" />
      <div class="trigger px-2 py-1">全部隐藏</div>

      <div class="w-1px bg-[#ffe14d] py-1 opacity-50" />
      <div class="trigger px-2 py-1">全部显示</div>
    </div>

    <!-- 图层 -->
    <div
      v-for="layer of mapData"
      :key="layer.id"
      v-show="layer.asLegend"
      class="m-2 flex flex-col items-center"
    >
      <img :src="layer.legendImg" class="h-8" />
      <span class="text-xs">{{ layer.name }}</span>
      <component
        v-for="overlay of layer.overlays"
        :is="overlays[overlay.type]?.overlay"
        :key="overlay.id"
        v-bind="overlay"
        :visible="true"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { overlays, useMapStore } from '@sp/shared/map'

defineProps<{
  open: boolean
}>()

defineEmits<{ (e: 'trigger'): void }>()

const { mapData } = storeToRefs(useMapStore())
</script>

<style scoped>
.trigger {
  @apply cursor-pointer opacity-50 hover:opacity-100 select-none bg-[#007fd9];
}
</style>
