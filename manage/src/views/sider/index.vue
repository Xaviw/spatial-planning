<template>
  <div class="relative h-full min-w-400 flex">
    <Loading absolute :loading="loading" />

    <div class="sidebar">
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
          :disabled="!selectedMenu"
          @edit="onEdit"
          @remove="onRemove"
          @mutative="onMutative"
          :selectedId="selectedItem?.id"
          :filterMenu="selectedMenu"
        />
      </div>
    </div>

    <div class="sidebar">
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
          :disabled="!selectedMenu"
          @edit="onEdit"
          @remove="onRemove"
          @mutative="onMutative"
          :selectedId="selectedItem?.id"
          :filterMenu="selectedMenu"
        />
      </div>
    </div>

    <MaterialBar :inModal="false" :selectedMenu="selectedMenu" />

    <FormBar
      :patches="patches"
      :inversePatches="inversePatches"
      :patchFlag="patchFlag"
      v-model:selected-menu="selectedMenu"
      :selectedItem="selectedItem"
      @cancel="onCancel"
      @confirm="onConfirm"
      @submit="onSubmit"
      @revoke="onRevokeOrRedo(revoke)"
      @redo="onRevokeOrRedo(redo)"
      @menuChange="onMenuChange"
      ref="formBarEl"
    />
  </div>
</template>

<script lang="ts" setup>
import { getSider, setSider } from '@sp/shared/apis'
import { Loading } from '@sp/shared/components'
import {
  DraggableList,
  MaterialBar,
  FormBar,
} from '@sp/shared/helper/siderHelper'
import { useMutative } from '@sp/shared/hooks'
import { getOperationsFromDiff, modal } from '@sp/shared/utils'
import { useRequest } from 'alova'
import { message } from 'ant-design-vue'
import { isEqual } from 'lodash-es'
import type {
  SiderItem,
  SiderPosition,
  MaterialItem,
  MutativeParams,
} from '#/request'

const formBarEl = ref<ComponentExposed<typeof FormBar<SiderItem>> | null>(null)

const {
  data: leftList,
  loading: leftLoading,
  send: sendLeft,
} = useRequest(
  (menuId: string) => getSider({ menuId, position: 'left', filter: false }),
  {
    initialData: [],
    immediate: false,
  },
)

const {
  data: rightList,
  loading: rightLoading,
  send: sendRight,
} = useRequest(
  (menuId: string) => getSider({ menuId, position: 'right', filter: false }),
  {
    initialData: [],
    immediate: false,
  },
)

const {
  update,
  patches,
  inversePatches,
  revoke,
  redo,
  patchFlag,
  originalState: originalList,
  reset,
  state: currentList,
} = useMutative<SiderItem[]>([])

const loading = computed(
  () => leftLoading.value || rightLoading.value || submitLoading.value,
)

const selectedItem = ref<SiderItem>()

const selectedMenu = ref<string>()

async function onMenuChange(id: string, oldId: string | undefined) {
  if (patches.value.length) {
    await modal('confirm', {
      title: '警告！',
      content:
        '您在当前菜单下的操作还未提交，切换菜单后不会保留您的操作！是否确定切换？',
    }).catch(() => {
      selectedMenu.value = oldId
      return Promise.reject()
    })
  }
  Promise.all([sendLeft(id), sendRight(id)]).then(([leftData, rightData]) => {
    reset([...leftData, ...rightData])
  })
}

async function onEdit(item: SiderItem) {
  if (selectedItem.value) {
    if (item.id === selectedItem.value.id) return
    const data = await formBarEl.value!.getData()
    if (!isEqual(data, selectedItem)) {
      await modal('confirm', {
        title: '提示！',
        content: '您有正在编辑的组件还未保存，是否直接切换？',
        okText: '切换',
      })
    }
  }
  selectedItem.value = item
}

function onRemove(position: SiderPosition, index: number) {
  if (position === 'left') {
    leftList.value.splice(index, 1)
    update(draft => {
      draft.splice(index, 1)
    })
  } else {
    rightList.value.splice(index, 1)
    update(draft => {
      draft.splice(leftList.value.length + index, 1)
    })
  }
}

function onConfirm(data: SiderItem | MaterialItem, equal: boolean) {
  if (!equal) {
    let index = leftList.value.findIndex(
      item => item.id === selectedItem.value?.id,
    )
    if (index >= 0) {
      leftList.value[index] = data as SiderItem
      update(draft => {
        draft[index] = data as SiderItem
      })
    } else {
      index = rightList.value.findIndex(
        item => item.id === selectedItem.value?.id,
      )
      if (index >= 0) {
        rightList.value[index] = data as SiderItem
        update(draft => {
          draft[leftList.value.length + index] = data as SiderItem
        })
      }
    }
  }
  selectedItem.value = undefined
}

const submitLoading = ref(false)

function onSubmit() {
  const operations = getOperationsFromDiff(
    currentList.value,
    originalList.value,
  )
  setSider(operations)
    .send()
    .then(() => {
      message.success('提交成功！')
      reset(currentList.value)
    })
    .finally(() => {
      submitLoading.value = false
    })
}

function onCancel() {
  selectedItem.value = undefined
}
function onMutative(e: MutativeParams<SiderItem>) {
  const leftLength = leftList.value.length
  if (e.name === 'add') {
    update(state => {
      const index = e.to === 'left' ? e.newIndex! : leftLength + e.newIndex!
      state.splice(index, 0, { ...e.data, position: e.to } as SiderItem)
    })
  } else {
    let oldIndex = e.oldIndex!
    let newIndex = e.newIndex!
    if (e.from === 'right' && e.to === 'left') {
      // 事件触发时，左侧列表长度已经是添加了移动的元素
      oldIndex += leftLength - 1
    } else if (e.from === 'left' && e.to === 'right') {
      // 事件触发时，左侧列表长度还未移除移动的元素
      newIndex += leftLength - 1
    } else if (e.from === 'right' && e.to === 'right') {
      oldIndex += leftLength
      newIndex += leftLength
    }
    update(state => {
      state.splice(oldIndex, 1)
      state.splice(newIndex, 0, { ...e.data, position: e.to as SiderPosition })
    })
  }
}

function onRevokeOrRedo(func: typeof revoke | typeof redo) {
  const fullList = func()
  const firstRightIndex = fullList.findIndex(item => item.position === 'right')
  leftList.value = fullList.slice(0, firstRightIndex)
  rightList.value = fullList.slice(firstRightIndex)
}
</script>

<style>
.sidebar {
  @apply mr-2 w-100 flex flex-col bg-[#001231] text-white;
}
.header {
  @apply border-0 border-b-1 border-white border-solid px-4 py-2 text-lg font-600 text-white flex items-center;
}

.editor-block {
  @apply max-w-100 flex items-center border border-[#d9d9d9] border-dashed p-2 pb-0;
}

.editor-btn {
  @apply flex items-center justify-center border border-[#d9d9d9] rounded border-solid p-2 cursor-pointer;
}

:fullscreen {
  background-color: #fff;
}
</style>
