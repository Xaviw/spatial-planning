<template>
  <div class="relative h-full overflow-auto" ref="siderRef">
    <Loading absolute :loading="loading" />

    <component
      v-for="item of data"
      :key="item.id"
      :is="components[item.type]"
      v-bind="item.props"
      class="mb-2"
    />
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@sp/shared/components'
import { components } from '@sp/shared/materials'
import type { SiderItem } from '#/business'

const props = defineProps<{
  data: SiderItem[]
  loading: boolean
}>()

const siderRef = ref<HTMLDivElement | null>(null)

watch(
  () => props.data,
  () => {
    siderRef.value?.scrollTo({ top: 0, behavior: 'smooth' })
  },
)
</script>

<style>
.ant-spin-container {
  height: 100%;
}

.ant-spin {
  max-height: none !important;
}
</style>
