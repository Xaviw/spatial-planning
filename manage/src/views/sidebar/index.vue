<template>
  <div class="relative h-full flex">
    <div class="sidebar">
      <Loading absolute :loading="leftLoading" />

      <div class="header">
        <i class="i-ant-design:pic-left-outlined mr-2" />
        左栏
      </div>

      <div class="flex-1 overflow-auto">
        <DraggableList :componentList="leftList" />
      </div>
    </div>

    <div class="sidebar">
      <Loading absolute :loading="rightLoading" />

      <div class="header">
        <i class="i-ant-design:pic-right-outlined mr-2" />
        右栏
      </div>

      <div class="flex-1 overflow-auto">
        <DraggableList :componentList="rightList" />
      </div>
    </div>

    <div class="sidebar">
      <div class="header">
        <i class="i-uiw:component" />
        <span class="mx-2">物料栏</span>
        <ATag color="processing">拖拽物料到左/右栏中以添加组件</ATag>
      </div>

      <div class="flex-1 overflow-auto">
        <DraggableList :componentList="materials" />
      </div>

      <div class="header border-t-1!">
        <i class="i-ant-design:delete-outlined" />
        <span class="mx-2">删除/暂存栏</span>
        <ATag color="processing">拖动组件到暂存栏便于大范围移动元素</ATag>
      </div>

      <div class="flex-1 overflow-auto">
        <DraggableList />
      </div>
    </div>

    <div class="flex flex-1 flex-col bg-white p-2">
      <AAlert showIcon>
        <template #message>
          <div>拖到“左栏”、“右栏”组件移动位置</div>
          <div>单击“左栏”、“右栏”组件进行编辑</div>
        </template>
      </AAlert>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getSider } from '@sp/shared/apis'
import { Loading } from '@sp/shared/components'
import { useRequest } from 'alova'
import DraggableList from './draggableList.vue'
import materials from './materials'

const { data: leftList, loading: leftLoading } = useRequest(
  menuId => getSider({ position: 'left', filter: false, menuId }),
  { initialData: [] },
)

const { data: rightList, loading: rightLoading } = useRequest(
  menuId => getSider({ position: 'right', filter: false, menuId }),
  { initialData: [] },
)
</script>

<style scoped>
.sidebar {
  @apply mr-2 w-100 flex flex-col bg-[#001231] text-white relative;
}
.header {
  @apply border-0 border-b-1 border-white border-solid pl-4 py-2 text-lg font-600 text-white flex items-center;
}
</style>
