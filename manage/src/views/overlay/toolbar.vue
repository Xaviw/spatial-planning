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
            item.key === active && 'bg-[#4096ff] text-white',
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
const emits = defineEmits<(e: 'change', key?: string) => void>()

const list = [
  { icon: 'i-material-symbols:location-on', name: '标记点', key: 'marker' },
  { icon: 'i-material-symbols:polyline-outline', name: '线', key: 'polyline' },
  { icon: 'i-ph:polygon', name: '多边形', key: 'polygon' },
  { icon: 'i-mdi:vector-rectangle', name: '矩形', key: 'rectangle' },
  { icon: 'i-mdi:circle-outline', name: '圆', key: 'circle' },
  { icon: 'i-ph:ruler', name: '距离测量', key: 'measureDistance' },
  { icon: 'i-radix-icons:ruler-square', name: '面积测量', key: 'measureArea' },
]

const active = ref<string>()

function onClick(item: (typeof list)[0]) {
  if (active.value === item.key) {
    emits('change')
    active.value = undefined
  } else {
    emits('change', item.key)
    active.value = item.key
  }
}
</script>
