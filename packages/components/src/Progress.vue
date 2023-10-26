<template>
  <ASpace
    :direction="direction"
    :align="align"
    :size="gap"
    wrap
    class="w-full flex items-stretch px-4 py-2"
  >
    <div
      v-for="(item, index) of data"
      :key="index"
      :class="[
        'flex',
        direction === 'vertical' && (!type || type === 'line')
          ? 'flex-col'
          : 'flex-col-reverse',
        ,
      ]"
      :style="{
        width:
          (!type || type === 'line') &&
          !steps &&
          (typeof size === 'number' || typeof size?.[0] === 'number')
            ? `${Array.isArray(size) ? size[0] : size}px`
            : 'auto',
      }"
    >
      <div
        :class="[
          'flex',
          'items-center',
          showInfo ? 'justify-center' : 'justify-between',
          type === 'circle' && 'mt-2',
        ]"
      >
        <span class="text-[#587396]">{{ item.name }}</span>
        <span v-if="!showInfo">{{ formatter(item) }}</span>
      </div>

      <AProgress
        v-bind="props"
        :format="() => formatter(item)"
        :percent="item.value"
        :showInfo="showInfo"
        trailColor="#ffffff22"
      ></AProgress>
    </div>
  </ASpace>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { ProgressProps } from 'ant-design-vue/es/progress/index'

interface ProgressItem {
  name: string
  value: number
  /**
   * 内容展示格式，用标签表示数据"</>"
   * @default "</>%"
   */
  format?: string
}

interface Progress extends ProgressProps {
  /**
   * 排列方式，vertical | horizontal
   * @default 'vertical'
   */
  direction?: 'vertical' | 'horizontal'
  /**
   * 对齐方式，start | end |center |baseline
   * @default 'start'
   */
  align?: 'start' | 'end' | 'center' | 'baseline'
  /**
   * 间距大小，small | middle | large | number
   * @default small
   */
  gap?: 'small' | 'middle' | 'large' | number
  /**
   * 数值显示在进度条内还是进度条外
   * 默认circle为inner，其他为outer
   */
  valuePosition?: 'inner' | 'outer'
  /** 数据 */
  data: ProgressItem[]
}

const props = withDefaults(defineProps<Progress>(), {
  direction: 'vertical',
  align: 'start',
  gap: 'small',
  data: () => [],
})

const showInfo = computed(
  () =>
    props.valuePosition === 'inner' || (!!props.type && props.type !== 'line'),
)

function formatter(item: ProgressItem) {
  return (item.format || '</>%').replace('</>', item.value + '')
}
</script>
