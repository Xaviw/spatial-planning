<template>
  <ADescriptions v-bind="props">
    <ADescriptionsItem
      v-for="(item, index) of data"
      :key="index"
      :span="item.span"
    >
      {{ item.value }}
    </ADescriptionsItem>
  </ADescriptions>
</template>

<script setup lang="ts">
import { DescriptionsProps } from 'ant-design-vue/es/descriptions/index'

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
    DescriptionsProps & {
      data: DescriptionItem[]
    }
  >(),
  { data: () => [] },
)
</script>
