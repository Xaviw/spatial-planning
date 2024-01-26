<template>
  <SiderBar
    :modelValue="materials"
    :group="{ name: 'sider', pull: 'clone', put: false }"
    :sort="false"
    :clone="customClone"
    :disabled="disabled"
  >
    <template #title>
      <i class="i-uiw:component" />
      <span class="mx-2">物料栏</span>
    </template>
  </SiderBar>
</template>

<script setup lang="ts">
import { SiderBar, materials } from '@sp/shared/helpers/material'
import { v4 as uuid } from 'uuid'
import type { SiderItem } from '#/business'

defineProps<{
  disabled?: boolean
}>()

function customClone(item: SiderItem): SiderItem {
  // 新增数据时需要添加id，并默认启用
  const id = `add_${uuid()}`
  return {
    ...item,
    id,
    status: true,
  }
}
</script>
