<template>
  <ASpace :direction="layout" wrap class="w-full px-4 py-2">
    <div
      v-for="(item, index) of transformData"
      :key="index"
      :class="[
        'flex',
        'items-center',
        showInfo ? 'flex-col-reverse' : 'flex-col',
      ]"
    >
      <div
        :class="[
          'w-full',
          'flex',
          'items-center',
          showInfo ? 'justify-center' : 'justify-between',
          showInfo && 'mt-2',
        ]"
      >
        <span>{{ item.name }}</span>
        <span v-if="!showInfo">{{ formatter(item) }}</span>
      </div>

      <AProgress
        v-bind="props"
        :format="() => formatter(item)"
        :percent="item.value"
        :showInfo="showInfo"
      ></AProgress>
    </div>
  </ASpace>
</template>

<script setup lang="ts">
import type { ProgressProps, ProgressItem } from '#/components'

const props = withDefaults(defineProps<ProgressProps>(), {
  data: () => [],
  format: '</>%',
  layout: 'vertical',
  mode: 'percent',
  strokeColor: '#1677ff',
  trailColor: '#ffffff22',
  type: 'line',
})

const showInfo = computed(() => props.type !== 'line')

function formatter(item: ProgressItem) {
  return props.format.replace('</>', item.value + '')
}

const transformData = computed(() => {
  if (props.mode === 'percent') return props.data
  const max = props.data.reduce((p, c) => {
    return Math.max(p, c.value)
  }, 0)
  return props.data.map(item => ({
    ...item,
    value: +((item.value / max) * 100).toFixed(2),
  }))
})
</script>

<style scoped>
:deep(.ant-progress-text) {
  color: #fff !important;
}
</style>
