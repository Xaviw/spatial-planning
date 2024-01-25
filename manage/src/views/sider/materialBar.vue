<template>
  <div class="sidebar">
    <div class="materials-modal-header">
      <i class="i-uiw:component" />
      <span class="mx-2">物料栏</span>
    </div>

    <div class="flex-1 overflow-auto">
      <DraggableList
        id="material"
        :modelValue="materials"
        :group="{ name: 'sider', pull: 'clone', put: false }"
        :sort="false"
        :clone="customClone"
        :disabled="disabled"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { materials, DraggableList } from '@sp/shared/helpers/sider'
import { uuid } from '@sp/shared/utils'
import type { SiderItem } from '#/business'

defineProps<{
  disabled?: boolean
}>()

function customClone(item: SiderItem): SiderItem {
  const id = `add_${uuid()}`
  const id2 = `add_${uuid()}`
  return {
    ...item,
    material: {
      ...item.material,
      id: id2,
    },
    id,
  }
}
</script>
