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
          @click="mapStore.toolManage(item)"
        >
          <i :class="item.icon" />
        </div>

        <template #title>
          <div class="mb-1 flex items-center justify-between">
            <span class="text-sm">{{ item.name }}</span>
            <span v-if="item.description" class="text-xs">
              ({{ item.description }})
            </span>
          </div>

          <div
            v-for="(help, index) of item.drawHelp"
            :key="index"
            class="text-xs"
          >
            - {{ help }}
          </div>

          <div class="my-1 text-sm" v-if="item.editHelp.length">编辑帮助</div>
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
import { message } from 'ant-design-vue'
import type { MapEvent, ToolType, OverlayModule } from '#/business'

const mapStore = useMapStore()

const { activeTool, mousetool, map } = storeToRefs(mapStore)

const { copy } = useClipboard({ legacy: true })

function copyLocation(e: MapEvent) {
  copy(`${e.lnglat.lng},${e.lnglat.lat}`).then(() => {
    message.success('经纬度已复制！')
  })
}

const list: (Pick<
  OverlayModule,
  | 'icon'
  | 'name'
  | 'description'
  | 'drawHelp'
  | 'editHelp'
  | 'beforeDraw'
  | 'afterDraw'
  | 'closeDraw'
> & {
  style?: string
  type: ToolType
})[] = [
  ...Object.values(overlays).sort((a, b) => a.sort - b.sort),
  {
    icon: 'i-material-symbols:my-location-outline',
    name: '经纬度拾取',
    type: 'Location',
    drawHelp: [
      '启用后点击地图目标位置会自动复制经纬度',
      '复制后可以直接粘贴到经纬度输入框中',
    ],
    editHelp: [],
    style: 'border-top: 3px solid #666',
    beforeDraw: () => {
      map.value?.on('click', copyLocation)
    },
    closeDraw: () => {
      map.value?.off('click', copyLocation)
    },
  },
  {
    icon: 'i-ph:ruler',
    name: '距离测量',
    type: 'Rule',
    drawHelp: [],
    editHelp: [],
    beforeDraw: () => {},
  },
  {
    icon: 'i-radix-icons:ruler-square',
    name: '面积测量',
    drawHelp: [],
    editHelp: [],
    type: 'MeasureArea',
    beforeDraw: () => {},
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
