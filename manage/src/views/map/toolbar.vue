<template>
  <div class="flex flex-col items-center">
    <template v-for="item of list" :key="item.key">
      <ATooltip placement="right">
        <div
          :class="[
            'h-10',
            'w-10',
            'flex',
            'items-center',
            'justify-center',
            'text-xl',
            'hover:bg-blue',
            'hover:text-white',
            item.type === activeTool && 'bg-blue text-white',
          ]"
          :style="item.style"
          @click="mapStore.toolManage(item.type)"
        >
          <i :class="item.icon" />
        </div>

        <template #title>
          <div class="mb-1 flex items-center justify-between">
            <span class="text-sm">{{ item.name }}：</span>
            <span v-if="item.description" class="text-xs">
              {{ item.description }}
            </span>
          </div>

          <div
            v-for="(help, index) of item.drawHelp"
            :key="index"
            class="text-xs"
          >
            - {{ help }}
          </div>

          <div class="my-1 text-sm">编辑帮助：</div>
          <div
            class="text-xs"
            v-for="(help, index) of item.editHelp"
            :key="index"
          >
            - {{ help }}
          </div>
        </template>
      </ATooltip>
    </template>
  </div>
</template>

<script setup lang="ts">
import { useMapStore, overlays } from '@sp/shared/map'
import type { MapEvent, OverlayType, OverlayModule } from '#/business'

const mapStore = useMapStore()

const { activeTool, mousetool, map } = storeToRefs(mapStore)

const list: (Pick<
  OverlayModule,
  'icon' | 'name' | 'description' | 'drawHelp' | 'editHelp'
> & {
  style?: string
  type: OverlayType | 'Rule' | 'MeasureArea'
})[] = [
  ...Object.values(overlays),
  // {
  //   icon: 'i-material-symbols:image-outline',
  //   name: '贴图',
  //   key: 'image',
  //   style: 'border-bottom: 3px solid #666',
  //   handler: () => {},
  // },
  {
    icon: 'i-ph:ruler',
    name: '距离测量',
    type: 'Rule',
    drawHelp: [],
    editHelp: [],
    style: 'border-top: 3px solid #666',
  },
  {
    icon: 'i-radix-icons:ruler-square',
    name: '面积测量',
    drawHelp: [],
    editHelp: [],
    type: 'MeasureArea',
  },
]

watchEffect(() => {
  if (mousetool.value) {
    ;(mousetool.value as any).on(
      'draw',
      ({ obj }: { obj: MapEvent['target'] }) => {
        overlays[activeTool.value!]?.afterDraw?.(obj)
        map.value?.remove(obj)
      },
    )
  }
})
</script>

<style>
.ant-tooltip {
  max-width: none;
}
</style>
