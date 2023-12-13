<template>
  <div class="h-full flex">
    <LegendType class="mr-2 flex-basis-30% bg-white p-4" :loading="loading" />
    <Legend :typeList="[]" class="flex flex-1 bg-white p-4" />
  </div>
</template>

<script setup lang="ts">
import { getLegendType } from '@sp/shared/apis'
import { useRequest } from 'alova'
import Legend from './legend.vue'
import LegendType from './legendType.vue'

const { data: typeList, loading } = useRequest(getLegendType, {
  initialData: [],
})

provide('typeList', typeList)
</script>
