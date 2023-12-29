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
          v-model="list.left"
          group="sider"
          id="left"
          enableContextMenu
          :disabled="!selectedMenu"
          @edit="onEdit"
          @remove="onRemove"
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
          v-model="list.right"
          group="sider"
          enableContextMenu
          :disabled="!selectedMenu"
          @edit="onEdit"
          @remove="onRemove"
          :selectedId="selectedItem?.id"
          :filterMenu="selectedMenu"
        />
      </div>
    </div>

    <MaterialBar :inModal="false" :selectedMenu="selectedMenu" />

    <FormBar
      :canUndo="canUndo"
      :canRedo="canRedo"
      v-model:selected-menu="selectedMenu"
      :selectedItem="selectedItem"
      @cancel="onCancel"
      @confirm="onConfirm"
      @submit="onSubmit"
      @undo="undo"
      @redo="redo"
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
import { getOperationsFromDiff, modal } from '@sp/shared/utils'
import { useRequest } from 'alova'
import { message } from 'ant-design-vue'
import { isEqual } from 'lodash-es'
import type { SiderItem, SiderPosition, MaterialItem } from '#/business'

const formBarEl = ref<ComponentExposed<typeof FormBar<SiderItem>> | null>(null)

const list = ref<{ left: SiderItem[]; right: SiderItem[] }>({
  left: [],
  right: [],
})

const { loading: leftLoading, send: sendLeft } = useRequest(
  (menuId: string) => getSider({ menuId, position: 'left', filter: false }),
  { immediate: false },
)

const { loading: rightLoading, send: sendRight } = useRequest(
  (menuId: string) => getSider({ menuId, position: 'right', filter: false }),
  { immediate: false },
)

const { canRedo, canUndo, clear, redo, undo, history } = useRefHistory(list, {
  deep: true,
})

const loading = computed(
  () => leftLoading.value || rightLoading.value || submitLoading.value,
)

const selectedItem = ref<SiderItem>()

const selectedMenu = ref<string>()

async function onMenuChange(id: string, oldId: string | undefined) {
  if (canUndo.value) {
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
    list.value.left = leftData
    list.value.right = rightData
    nextTick(clear)
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
  list.value[position].splice(index, 1)
}

function onConfirm(data: SiderItem | MaterialItem, equal: boolean) {
  if (!equal) {
    let index = list.value.left.findIndex(
      item => item.id === selectedItem.value?.id,
    )
    if (index >= 0) {
      list.value.left[index] = data as SiderItem
    } else {
      index = list.value.right.findIndex(
        item => item.id === selectedItem.value?.id,
      )
      if (index >= 0) {
        list.value.right[index] = data as SiderItem
      }
    }
  }
  selectedItem.value = undefined
}

const submitLoading = ref(false)

function onSubmit() {
  submitLoading.value = true
  const origin = history.value[history.value.length - 1].snapshot
  const operations = getOperationsFromDiff(
    [...list.value.left, ...list.value.right],
    [...origin.left, ...origin.right],
  )
  setSider(operations)
    .send()
    .then(() => {
      message.success('提交成功！')
      clear()
    })
    .finally(() => {
      submitLoading.value = false
    })
}

function onCancel() {
  selectedItem.value = undefined
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
