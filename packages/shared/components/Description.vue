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
import { ExtractPropTypes } from 'vue'

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
  /**
   * 是否显示冒号
   * @default '：'
   */
  colon?: boolean
}

const props = withDefaults(
  defineProps<
    Partial<ExtractPropTypes<ReturnType<typeof descriptionsProps>>> & {
      data: DescriptionItem[]
    }
  >(),
  { data: () => [], colon: true },
)
</script>

<style scoped>
:deep(.ant-descriptions-view) {
  border-radius: 0 !important;
}

:deep(.ant-descriptions-item-label) {
  color: #fff;
}

:deep(.ant-descriptions-item-content) {
  color: #fff;
}
</style>
