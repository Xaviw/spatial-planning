<template>
  <div class="h-full min-w-400 flex">
    <div class="sidebar">
      <Loading absolute :loading="leftLoading" />

      <div class="header">
        <i class="i-ant-design:pic-left-outlined mr-2" />
        左栏
      </div>

      <div class="flex-1 overflow-auto">
        <DraggableList
          id="left"
          v-model="leftList"
          group="sider"
          @immer="onImmer"
        />
      </div>
    </div>

    <div class="sidebar">
      <Loading absolute :loading="rightLoading" />

      <div class="header">
        <i class="i-ant-design:pic-right-outlined mr-2" />
        右栏
      </div>

      <div class="flex-1 overflow-auto">
        <DraggableList
          id="right"
          v-model="rightList"
          group="sider"
          @immer="onImmer"
        />
      </div>
    </div>

    <div class="sidebar">
      <div class="header">
        <i class="i-uiw:component" />
        <span class="mx-2">物料栏</span>
        <ATag color="processing">拖拽物料到左/右栏中以添加组件</ATag>
      </div>

      <div class="flex-1 overflow-auto">
        <DraggableList
          id="material"
          v-model="materials"
          :group="{ name: 'sider', pull: materialsPull, put: false }"
          :sort="false"
          @immer="onImmer"
        />
      </div>

      <div class="header border-t-1!">
        <i class="i-ant-design:delete-outlined" />
        <span class="mx-2">删除/暂存栏</span>
        <ATag color="processing">拖动组件到暂存栏便于大范围移动元素</ATag>
      </div>

      <div class="flex-1 overflow-auto">
        <DraggableList
          id="temp"
          v-model="temp"
          group="sider"
          @immer="onImmer"
        />
      </div>
    </div>

    <div class="flex flex-1 flex-col bg-white p-2">
      <AAlert showIcon>
        <template #message>
          <div>拖到“左栏”、“右栏”组件移动位置</div>
          <div>单击“左栏”、“右栏”组件进行编辑</div>
        </template>
      </AAlert>

      <ATreeSelect
        :fieldNames="{ label: 'name', value: 'id' }"
        :filterTreeNode="onMenuFilter"
        placeholder="选择或搜索菜单进行筛选"
        v-model:searchValue="menuSearchValue"
        allowclear
        treedefaultexpandall
        showSearch
        :treeData="menuData"
        @dropdownVisibleChange="onMenuDropdown"
      />

      <AButton @click="onSubmit">确定</AButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getMenu, getSider } from '@sp/shared/apis'
import { Loading } from '@sp/shared/components'
import { useMutative } from '@sp/shared/hooks'
import { useRequest } from 'alova'
import { cloneDeep } from 'lodash-es'
import { apply, create } from 'mutative'
import DraggableList, { type SiderChangeParams } from './draggableList.vue'
import materials from './materials'
import type { SiderItem, MenuItem } from '#/client'

// ---------------------------------- draggable list ----------------------------------
const { data: leftList, loading: leftLoading } = useRequest(
  menuId => getSider({ position: 'left', filter: false, menuId }),
  { initialData: [] },
)

const { data: rightList, loading: rightLoading } = useRequest(
  menuId => getSider({ position: 'right', filter: false, menuId }),
  { initialData: [] },
)

const temp = ref<SiderItem[]>([])

function materialsPull(to: any) {
  if (['left', 'right'].includes((to.el as HTMLDivElement).id)) return 'clone'
  return false
}

// ---------------------------------- 菜单 ----------------------------------
const menuSearchValue = ref<string>()

const { data: menuData, send: sendMenu } = useRequest(
  () => getMenu(true, 'message'),
  {
    initialData: [],
  },
)

function onMenuDropdown(open: boolean) {
  if (!open) return
  if (!menuData.value.length) {
    sendMenu()
  }
}

function onMenuFilter(val: string, node: MenuItem) {
  return node.name.includes(val)
}

// ---------------------------------- immer ----------------------------------
let originalList: SiderItem[]

const { update, patches, state } = useMutative([] as SiderItem[])

const unwatch = watchEffect(() => {
  if (leftList.value.length && rightList.value.length && !state.value.length) {
    originalList = [...cloneDeep(leftList.value), ...cloneDeep(rightList.value)]
    update(() => [...cloneDeep(leftList.value), ...cloneDeep(rightList.value)])
    unwatch()
  }
})

function onImmer(e: SiderChangeParams) {
  const leftLength = leftList.value.length
  if (e.name === 'add') {
    update(state => {
      const index = e.to === 'left' ? e.newIndex! : leftLength + e.newIndex!
      state.splice(index, 0, e.data)
    })
  } else if (e.name === 'remove') {
    update(state => {
      state.splice(e.oldIndex!, 1)
    })
  } else {
    const oldIndex = e.from === 'right' ? e.oldIndex! + leftLength : e.oldIndex!
    const newIndex = e.to === 'right' ? e.newIndex! + leftLength : e.newIndex!
    update(state => {
      state.splice(oldIndex, 1)
      state.splice(newIndex, 0, e.data)
    })
  }
}

function onSubmit() {
  const [_state, simplePatches] = create(
    originalList,
    state => {
      apply(state, patches.value.slice(1))
    },
    { enablePatches: true },
  )
  console.log('simplePatches: ', simplePatches)
}
</script>

<style scoped>
.sidebar {
  @apply mr-2 w-100 flex flex-col bg-[#001231] text-white relative;
}
.header {
  @apply border-0 border-b-1 border-white border-solid pl-4 py-2 text-lg font-600 text-white flex items-center;
}
</style>
