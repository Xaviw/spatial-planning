<template>
  <VChart :option="option" :style="{ height: props.height }" />
</template>

<script setup lang="ts">
import { color } from '@sp/shared/utils'
import { LineChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import type { LineChartProps } from '#/materials'
import type { LineSeriesOption } from 'echarts/charts'
import type {
  GridComponentOption,
  TooltipComponentOption,
  LegendComponentOption,
} from 'echarts/components'
import type { ComposeOption } from 'echarts/core'

type EChartsOption = ComposeOption<
  | LegendComponentOption
  | TooltipComponentOption
  | GridComponentOption
  | LineSeriesOption
>

const props = withDefaults(defineProps<LineChartProps>(), {
  height: '240px',
  xAxis: () => [],
  series: () => [],
})

use([
  LegendComponent,
  GridComponent,
  TooltipComponent,
  LineChart,
  CanvasRenderer,
])

const option = computed<EChartsOption>(() => ({
  color,
  grid: {
    left: 10,
    top: 10,
    right: 10,
    bottom: 30,
    containLabel: true,
  },
  tooltip: {
    trigger: 'item',
  },
  legend: {
    top: 'bottom',
    left: 'center',
    textStyle: {
      color: '#ffffff',
      fontSize: 12,
    },
    icon: 'circle',
  },
  xAxis: {
    type: 'category',
    data: props.xAxis,
    axisLine: {
      lineStyle: {
        color: '#1E2C58',
      },
    },
    axisLabel: {
      color: '#ffffffaa',
    },
    boundaryGap: false,
  },
  yAxis: {
    type: 'value',
    axisLabel: {
      fontSize: 10,
      color: '#ffffffaa',
    },
    splitLine: {
      lineStyle: {
        color: '#1E2C58',
      },
    },
  },
  series: props.series.map(item => {
    return {
      name: item.name,
      data: item.data,
      smooth: item.smooth,
      stack: item.stack ? 'Total' : undefined,
      areaStyle: item.stack ? {} : undefined,
      emphasis: {
        focus: 'series',
      },
      type: 'line',
    }
  }),
}))
</script>
