<template>
  <div class="flex flex-col items-center">
    <template v-for="item of list" :key="item.key">
      <ATooltip :title="item.name" placement="right">
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
            item.key === active && 'bg-blue text-white',
          ]"
          @click="onClick(item)"
        >
          <i :class="item.icon" />
        </div>
      </ATooltip>
    </template>
  </div>
</template>

<script setup lang="ts">
import type { ToolKeys, ToolItem } from './data'

const emits = defineEmits<(e: 'change', key?: ToolKeys) => void>()

const list: ToolItem[] = [
  { icon: 'i-material-symbols:location-on', name: '标记点', key: 'marker' },
  { icon: 'i-material-symbols:polyline-outline', name: '线', key: 'polyline' },
  { icon: 'i-ph:polygon', name: '多边形', key: 'polygon' },
  { icon: 'i-mdi:vector-rectangle', name: '矩形', key: 'rectangle' },
  { icon: 'i-mdi:circle-outline', name: '圆', key: 'circle' },
  { icon: 'i-ph:ruler', name: '距离测量', key: 'rule' },
  { icon: 'i-radix-icons:ruler-square', name: '面积测量', key: 'measureArea' },
]

const active = ref<ToolKeys>()

function onClick(item: ToolItem) {
  if (active.value === item.key) {
    emits('change')
    active.value = undefined
  } else {
    emits('change', item.key)
    active.value = item.key
  }
}
</script>
