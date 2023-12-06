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

    <div class="header border-t-1!">
      <i class="i-ant-design:delete-outlined" />
      <span class="mx-2">删除/暂存栏</span>
      <div class="flex-1 text-right">
        <AButton size="small" danger ghost @click="clearTemp">清空</AButton>
      </div>
    </div>

    <div class="flex-1 overflow-auto">
      <DraggableList id="temp" v-model="tempList" group="sider" />
    </div>
  </div>
</template>

<script setup lang="ts" generic="T extends SiderItem | DetailItem">
import { ref } from 'vue'
import { modal } from '../../utils'
import { materials } from './data'
import DraggableList from './draggableList.vue'
import type { SiderItem, DetailItem } from '#/request'

const props = defineProps<{
  selectedMenu?: string
  inModal: boolean
}>()

const tempList = ref<T[]>([])

function materialsPull(to: any) {
  if ((to.el as HTMLDivElement).id === 'temp') return false
  return 'clone'
}

async function clearTemp() {
  await modal('warning', {
    title: '警告！',
    content: '清空后不可恢复，是否确认清空？',
  })
  tempList.value = []
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
