<template>
  <VChart :option="option" :style="{ height: props.height + 'px' }" />
</template>

<script setup lang="ts">
import { color } from '@sp/shared/utils'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ref } from 'vue'
import VChart from 'vue-echarts'
import type { PieSeriesOption } from 'echarts/charts'
import type {
  TooltipComponentOption,
  LegendComponentOption,
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'

type EChartsOption = ComposeOption<
  TooltipComponentOption | LegendComponentOption | PieSeriesOption
>

const props = withDefaults(
  defineProps<{
    /**
     * 容器高度，单位px
     * @default 240
     */
    height?: number
    /**
     * 半径，单位百分比；一个值为饼图，两个值为环形图
     * @default '100%'
     */
    radius?: string | [string, string]
    /**
     * 中心点位置，单位百分比
     * @default ['45%', '50%']
     */
    center?: [string, string]
    /**
     * 南丁格尔玫瑰图，默认不使用
     */
    roseType?: 'radius' | 'area'
    data: PieSeriesOption['data']
  }>(),
  {
    height: 240,
    radius: () => '100%',
    center: () => ['45%', '50%'],
    data: () => [],
  },
)

use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer])

const option = ref<EChartsOption>({
  color,
  tooltip: {
    trigger: 'item',
  },
  legend: {
    height: '100%',
    top: 'center',
    left: 'right',
    orient: 'vertical',
    itemGap: 6,
    textStyle: {
      color: '#ffffff',
      fontSize: 12,
    },
    icon: 'circle',
  },
  series: [
    {
      type: 'pie',
      radius: props.radius,
      center: props.center,
      avoidLabelOverlap: false,
      emphasis: {
        label: {
          show: true,
          fontSize: 16,
          fontWeight: 'bold',
        },
      },
      labelLine: {
        show: false,
      },
      roseType: props.roseType,
      data: props.data,
      label: {
        show: true,
        position: 'inside',
        color: '#fff',
        fontSize: 14,
        formatter: '{c}',
      },
    },
  ],
})
</script>
