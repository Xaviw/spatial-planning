<template>
  <ADescriptions v-bind="props" class="px-4">
    <ADescriptionsItem v-for="(item, index) of data" :key="index" v-bind="item">
      {{ item.value }}
    </ADescriptionsItem>
  </ADescriptions>
</template>

<script setup lang="ts">
import type { DescriptionProps } from '#/materials'

const props = withDefaults(defineProps<DescriptionProps>(), {
  data: () => [],
  colon: true,
  column: 3,
  layout: 'horizontal',
})
</script>

<style scoped>
:deep(.ant-descriptions-view) {
  border-radius: 0 !important;
}

:deep(.ant-descriptions-title),
:deep(.ant-descriptions-item-label),
:deep(.ant-descriptions-item-content) {
  color: #fff;
}
</style>
