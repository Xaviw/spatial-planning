<template>
  <VChart :option="option" :style="{ height: props.height + 'px' }" />
</template>

<script setup lang="ts">
import { color } from '@sp/shared/utils'
import { LineChart } from 'echarts/charts'
import { GridComponent } from 'echarts/components'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ref } from 'vue'
import VChart from 'vue-echarts'
import type { LineSeriesOption } from 'echarts/charts'
import type { GridComponentOption } from 'echarts/components'
import type { ComposeOption } from 'echarts/core'

type EChartsOption = ComposeOption<GridComponentOption | LineSeriesOption>

const props = withDefaults(
  defineProps<{
    /**
     * 容器高度，单位px
     * @default 240
     */
    height?: number
    /** X轴数据项，数量应该与data.value一致 */
    xAxis: string[]
    /** 多条折线数据 */
    series: {
      /** 提供name时会显示图例 */
      name?: string
      /** 数量应与columns一致 */
      data: number[]
      /**
       * 平滑折线图
       * @default false
       */
      smooth?: boolean
      /**
       * 堆叠面积图
       * @default false
       */
      stack?: boolean
    }[]
  }>(),
  {
    height: 240,
    xAxis: () => [],
    series: () => [],
  },
)

use([GridComponent, LineChart, CanvasRenderer])

const option = ref<EChartsOption>({
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
})
</script>
