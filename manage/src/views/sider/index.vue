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
          :filterMenu="selectedMenu"
          v-model="leftList"
          group="sider"
          @immer="onImmer"
          @edit="(...e) => onEdit('left', ...e)"
          enableContextMenu
          :selectedId="selectedSiderItem?.id"
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
          :filterMenu="selectedMenu"
          v-model="rightList"
          group="sider"
          @immer="onImmer"
          @edit="(...e) => onEdit('right', ...e)"
          enableContextMenu
          :selectedId="selectedSiderItem?.id"
        />
      </div>
    </div>

    <div class="sidebar">
      <div class="header">
        <i class="i-uiw:component" />
        <span class="mx-2">物料栏</span>
      </div>

      <div class="flex-1 overflow-auto">
        <DraggableList
          id="material"
          v-model="materials"
          :group="{ name: 'sider', pull: materialsPull, put: false }"
          :sort="false"
          :clone="onClone"
          @immer="onImmer"
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
        <DraggableList
          id="temp"
          v-model="temp"
          group="sider"
          @immer="onImmer"
          class="h-full"
        />
      </div>
    </div>

    <div class="flex flex-1 flex-col bg-white p-2">
      <AAlert showIcon>
        <template #message>
          <div>拖拽“左栏”、“右栏”中的组件移动位置；</div>
          <div>右击“左栏”、“右栏”中的组件进行编辑；</div>
          <div>拖拽“物料栏”中的组件到“左栏”、“右栏”中进行新增；</div>
          <div>
            拖拽“左栏”、“右栏”中的组件到“删除/暂存栏”中进行删除或暂存（暂存便于大范围移动组件）；
          </div>
        </template>
      </AAlert>

      <div
        class="flex items-center border-0 border-b-1px border-gray-3 border-solid py-4"
      >
        <span>菜单筛选：</span>
        <ATreeSelect
          :fieldNames="{ label: 'name', value: 'id' }"
          :filterTreeNode="onMenuFilter"
          placeholder="选择或搜索菜单进行筛选"
          v-model:searchValue="menuSearchValue"
          v-model:value="selectedMenu"
          treedefaultexpandall
          showsearch
          allowclear
          :treeData="menuData"
          @dropdownVisibleChange="onMenuDropdown"
          class="flex-1"
        />
      </div>

      <div class="flex-1 overflow-auto py-4">
        <EditFormBase
          v-if="selectedSiderItem"
          :element="componentEditForms[selectedSiderItem.type]"
          :rules="componentEditFormRules[selectedSiderItem.type]"
          @register="register"
        />

        <AEmpty
          v-if="!selectedSiderItem"
          description="请右击“左栏”、“右栏”中的组件选择“编辑”"
          class="h-full flex flex-col justify-center"
        />
      </div>

      <AButton @click="onSubmit" type="primary">确定</AButton>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getMenu, getSider } from '@sp/shared/apis'
import {
  Loading,
  componentEditForms,
  EditFormBase,
  componentEditFormRules,
  useEditFormBase,
} from '@sp/shared/components'
import { useMutative } from '@sp/shared/hooks'
import { modal } from '@sp/shared/utils'
import { useRequest } from 'alova'
import { cloneDeep } from 'lodash-es'
import { apply, create, rawReturn } from 'mutative'
import DraggableList, { type SiderChangeParams } from './draggableList.vue'
import materials from './materials'
import type { SiderItem, MenuItem } from '#/client'

// ----------------------------- draggable list -----------------------------
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

async function clearTemp() {
  await modal('warning', {
    title: '警告！',
    content: '清空后不可恢复，是否确认清空？',
  })
  temp.value = []
}

function onClone(item: SiderItem): SiderItem {
  const id = `add_${Date.now()}`
  return {
    ...item,
    id,
    menuIds: selectedMenu.value ? [selectedMenu.value] : [],
  }
}

// ----------------------------- 菜单 -----------------------------
const menuSearchValue = ref<string>()
const selectedMenu = ref<string>()

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

// ----------------------------- 编辑表单 -----------------------------
const selectedSiderItem = ref<SiderItem>()
const [register, { getFieldsValue, resetFields, validate }] = useEditFormBase()

async function onEdit(name: 'left' | 'right', item: SiderItem, index: number) {
  console.log('onEdit', name, item, index)
  selectedSiderItem.value = item
  await resetFields(item)
}

// ----------------------------- immer -----------------------------
let originalList: SiderItem[]

const { update, patches, state } = useMutative([] as SiderItem[])

const unwatch = watchEffect(() => {
  if (leftList.value.length && rightList.value.length && !state.value.length) {
    originalList = [...cloneDeep(leftList.value), ...cloneDeep(rightList.value)]
    update(() =>
      rawReturn([...cloneDeep(leftList.value), ...cloneDeep(rightList.value)]),
    )
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

async function onSubmit() {
  await validate()
  const params = await getFieldsValue()
  console.log('params:', params)

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
  @apply border-0 border-b-1 border-white border-solid px-4 py-2 text-lg font-600 text-white flex items-center;
}
</style>
