<template>
  <VChart :option="option" :style="{ height: props.height }" />
</template>

<script setup lang="ts">
import { color } from '@sp/shared/utils'
import { PieChart } from 'echarts/charts'
import { TooltipComponent, LegendComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { computed } from 'vue'
import VChart from 'vue-echarts'
import type { PieChartProps } from '#/components'
import type { PieSeriesOption } from 'echarts/charts'
import type {
  TooltipComponentOption,
  LegendComponentOption,
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'

type EChartsOption = ComposeOption<
  TooltipComponentOption | LegendComponentOption | PieSeriesOption
>

const props = withDefaults(defineProps<PieChartProps>(), {
  height: '240px',
  outterRadius: 95,
  centerX: 45,
  centerY: 50,
  enableRose: false,
  data: () => [],
})

use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer])

const option = computed<EChartsOption>(() => ({
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
      radius: props.innerRadius
        ? [props.outterRadius + '%', props.innerRadius + '%']
        : props.outterRadius + '%',
      center: [props.centerX + '%', props.centerY + '%'],
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
      roseType: props.enableRose ? 'area' : undefined,
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
}))
</script>
