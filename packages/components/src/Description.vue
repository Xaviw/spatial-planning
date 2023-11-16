<template>
  <ADescriptions v-bind="props" class="px-4">
    <ADescriptionsItem
      v-for="(item, index) of data"
      :key="index"
      :label="item.label"
      :span="item.span"
    >
      {{ item.value }}
    </ADescriptionsItem>
  </ADescriptions>
</template>

<script setup lang="ts">
import { descriptionsProps } from 'ant-design-vue/es/descriptions/index'

interface DescriptionItem {
  /** 字段标题 */
  label: string
  /** 字段内容 */
  value: string
  /**
   * 字段占几列
   * @default 1
   */
  span?: number
}

const props = withDefaults(
  defineProps<
    ReturnType<typeof descriptionsProps> & {
      data: DescriptionItem[]
    }
  >(),
  { data: () => [] },
)
</script>

<style>
.ant-descriptions-view {
  border-radius: 0 !important;
}
</style>
