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
          v-model="leftList"
          group="sider"
          id="left"
          enableContextMenu
          :filterMenu="selectedMenu"
          @edit="onEdit"
          @mutative="onMutative"
          :selectedId="selectedItem?.id"
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
          enableContextMenu
          :filterMenu="selectedMenu"
          @edit="onEdit"
          @mutative="onMutative"
          :selectedId="selectedItem?.id"
        />
      </div>
    </div>

    <MaterialBar :inModal="false" :selectedMenu="selectedMenu" />

    <SiderFormBar
      :inModal="false"
      v-model:selectedMenu="selectedMenu"
      :selectedItem="selectedItem"
      @confirm="onConfirm"
      @cancel="onCancel"
    >
      <template #header>
        <div class="mb-2 flex">
          <AButton type="primary" @click="onSubmit">提交</AButton>
        </div>
        <AAlert showIcon class="mb-4">
          <template #message>
            <div>拖拽“左栏”、“右栏”中的组件移动位置；</div>
            <div>右击“左栏”、“右栏”中的组件进行编辑；</div>
            <div>拖拽“物料栏”中的组件到“左栏”、“右栏”中进行新增；</div>
            <div>
              拖拽“左栏”、“右栏”中的组件到“删除/暂存栏”中进行删除或暂存（暂存便于大范围移动组件）；
            </div>
          </template>
        </AAlert>
      </template>
    </SiderFormBar>
  </div>
</template>

<script setup lang="ts">
import { getSider } from '@sp/shared/apis'
import {
  MaterialBar,
  SiderFormBar,
  DraggableList,
  Loading,
} from '@sp/shared/components'
import { useMutative } from '@sp/shared/hooks'
import { modal } from '@sp/shared/utils'
import { useRequest } from 'alova'
import { cloneDeep } from 'lodash-es'
import { apply, create, rawReturn } from 'mutative'
import type { SiderItem, SiderChangeParams } from '#/request'

onMounted(async () => {
  if (!localStorage.getItem('siderTips')) {
    await modal('warning', {
      title: '注意',
      content: '请在全部编辑操作完成后点击右上方提交按钮，否则修改无效！',
    })
    localStorage.setItem('siderTips', '1')
  }
})

const { data: leftList, loading: leftLoading } = useRequest(
  menuId => getSider({ position: 'left', filter: false, menuId }),
  { initialData: [] },
)

const { data: rightList, loading: rightLoading } = useRequest(
  menuId => getSider({ position: 'right', filter: false, menuId }),
  { initialData: [] },
)

const selectedMenu = ref<string>()

const selectedItem = ref<SiderItem>()

function onEdit(item: SiderItem) {
  selectedItem.value = item
}

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

function onMutative(e: SiderChangeParams) {
  const leftLength = leftList.value.length
  if (e.name === 'add') {
    update(state => {
      const index = e.to === 'left' ? e.newIndex! : leftLength + e.newIndex!
      state.splice(index, 0, e.data as SiderItem)
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
      state.splice(newIndex, 0, e.data as SiderItem)
    })
  }
}

function onConfirm(params: SiderItem) {
  let index = leftList.value.findIndex(item => item.id === params.id)
  if (index >= 0) {
    leftList.value[index] = params
    update(state => {
      state[index] = params
    })
  } else {
    index = rightList.value.findIndex(item => item.id === params.id)
    if (index < 0) {
      throw new Error('编辑的组件不存在！')
    }
    rightList.value[index] = params
    update(state => {
      state[index + leftList.value.length] = params
    })
  }

  selectedItem.value = undefined
}

function onCancel() {
  selectedItem.value = undefined
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

<style>
.sidebar {
  @apply mr-2 w-100 flex flex-col bg-[#001231] text-white relative;
}
.header {
  @apply border-0 border-b-1 border-white border-solid px-4 py-2 text-lg font-600 text-white flex items-center;
}
</style>
