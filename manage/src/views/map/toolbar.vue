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
          :style="item?.toolItemStyle"
          @click="toolManage(mapStore, item.type)"
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

          <div class="my-1 text-sm" v-if="item.editHelp?.length">编辑帮助</div>
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
import { useMapStore, toolManage } from '@sp/shared/helpers/map'
import { overlays } from '@sp/shared/overlays'
import type { MapEvent } from '#/business'

const mapStore = useMapStore()

const { activeTool, mousetool } = storeToRefs(mapStore)

const list = Object.values(overlays).sort((a, b) => a.sort - b.sort)

watchEffect(() => {
  if (mousetool.value) {
    ;(mousetool.value as any).on(
      'draw',
      ({ obj }: { obj: MapEvent['target'] }) => {
        overlays[activeTool.value!]?.afterDraw?.(mapStore, obj)
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
