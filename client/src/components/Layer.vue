<template>
  <div
    class="relative transition-all"
    :style="{ marginBottom: open ? 0 : `-${height}px` }"
    ref="layerWrap"
  >
    <!-- 功能按钮 -->
    <div
      class="absolute left-0 top-0 z-10001 flex translate-y-[-100%] text-10px"
    >
      <div class="client-trigger-btn px-2 py-1" @click="$emit('trigger')">
        {{ `${open ? '折叠' : '展开'}图例` }}
      </div>

      <div class="w-1px bg-[#ffe14d] py-1 opacity-50" />
      <div class="client-trigger-btn px-2 py-1" @click="toggleAll(false)">
        全部隐藏
      </div>

      <div class="w-1px bg-[#ffe14d] py-1 opacity-50" />
      <div class="client-trigger-btn px-2 py-1" @click="toggleAll(true)">
        全部显示
      </div>
    </div>

    <!-- 图层 -->
    <div class="max-h-32 min-h-16 flex flex-wrap items-center overflow-auto">
      <div
        v-for="layer of mapData"
        :key="layer.id"
        v-show="layer.asLegend"
        :class="[
          'm-2',
          'flex',
          'flex-col',
          'items-center',
          'cursor-pointer',
          !layerMap[layer.id] && 'filter-grayscale line-through',
        ]"
        @click="layerMap[layer.id] = !layerMap[layer.id]"
      >
        <AImage
          :src="layer.legendImg"
          :fallback="failed_img"
          height="2rem"
          :preview="false"
        />
        <span class="text-xs">&nbsp;{{ layer.name }}&nbsp;</span>
        <component
          v-for="overlay of layer.overlays"
          :is="overlays[overlay.type]?.overlay"
          :key="overlay.id"
          v-bind="overlay"
          :visible="layerMap[layer.id]"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { mapKey } from '@sp/shared/helpers/map'
import { overlays } from '@sp/shared/overlays'
import { failed_img } from '@sp/shared/utils'
import { useMainStore } from '../stores/main'

defineProps<{
  open: boolean
}>()

defineEmits<{ (e: 'trigger'): void }>()

const map = inject(mapKey)

const { mapData } = storeToRefs(useMainStore())

const layerWrap = ref<HTMLDivElement | null>(null)

const { height } = useElementSize(layerWrap)

const layerMap = ref<Recordable>({})

// 切换菜单后后调整缩放
onUpdated(() => {
  map?.value?.setFitView()
})

watchEffect(() => {
  mapData.value.forEach(layer => {
    layerMap.value[layer.id] = true
  })
})

function toggleAll(show: boolean) {
  for (let key in layerMap.value) {
    layerMap.value[key] = show
  }
}
</script>
