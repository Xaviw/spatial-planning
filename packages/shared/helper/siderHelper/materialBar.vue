<template>
  <div class="sidebar">
    <div class="header">
      <i class="i-uiw:component" />
      <span class="mx-2">物料栏</span>
    </div>

    <div class="flex-1 overflow-auto">
      <DraggableList
        id="material"
        :modelValue="materials"
        :group="{ name: 'sider', pull: materialsPull, put: false }"
        :sort="false"
        :clone="customClone"
      />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends SiderItem | DetailItem">
import { materials } from './data'
import DraggableList from './draggableList.vue'
import type { SiderItem, DetailItem } from '#/request'

const props = defineProps<{
  selectedMenu?: string
  inModal: boolean
}>()

function materialsPull(to: any) {
  if ((to.el as HTMLDivElement).id === 'temp') return false
  return 'clone'
}

function customClone(item: T): T {
  const id = `add_${Date.now()}`
  return {
    ...item,
    id,
    menuIds: props.inModal
      ? undefined
      : props.selectedMenu
      ? [props.selectedMenu]
      : [],
  }
}
</script>
