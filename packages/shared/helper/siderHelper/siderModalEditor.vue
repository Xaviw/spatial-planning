<template>
  <ContentWrapper :title="modalTitle" @close="onClose">
    <div class="h-80vh flex overflow-auto">
      <div class="sidebar" :style="{ width: modalWidth }">
        <div class="header">
          <i class="i-ic:outline-menu mr-2" />
          详情栏
        </div>
        <div class="flex-1 overflow-auto">
          <DraggableList
            id="titleDetail"
            v-model="list"
            group="sider"
            enableContextMenu
            @edit="onEdit"
            @remove="onRemove"
            :selectedId="selectedItem?.id"
          />
        </div>
      </div>

      <MaterialBar :inModal="true" />

      <FormBar
        inModal
        :canRedo="canRedo"
        :canUndo="canUndo"
        :selectedItem="selectedItem"
        @cancel="onCancel"
        @confirm="onConfirm"
        @submit="onSubmit"
        @redo="redo"
        @undo="undo"
        ref="formBarEl"
      />
    </div>
  </ContentWrapper>
</template>

<script setup lang="ts">
import { ContentWrapper } from '@sp/shared/components'
import { FormBar } from '@sp/shared/helper/siderHelper'
import { modal } from '@sp/shared/utils'
import { isEqual, cloneDeep } from 'lodash-es'
import DraggableList from './draggableList.vue'
import MaterialBar from './materialBar.vue'
import type { MaterialItem } from '#/request'

const props = withDefaults(
  defineProps<{
    id: string
    modalTitle: string
    modalWidth?: string
    modalData: MaterialItem[]
  }>(),
  {
    modalWidth: '25rem',
    modalData: () => [],
  },
)

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', list: MaterialItem[]): void
}>()

const formBarEl = ref<ComponentExposed<typeof FormBar<MaterialItem>> | null>(
  null,
)

const list = ref<MaterialItem[]>([])

const { redo, undo, canRedo, canUndo, clear } = useRefHistory(list, {
  deep: true,
})

watch(
  () => props.id,
  id => {
    if (id) {
      list.value = cloneDeep(props.modalData)
      nextTick(clear)
    }
  },
  { immediate: true },
)

const selectedItem = ref<MaterialItem>()

async function onEdit(item: MaterialItem) {
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

function onRemove(_position: string, index: number) {
  list.value.splice(index, 1)
}

function onConfirm(data: MaterialItem, equal: boolean) {
  if (!equal) {
    const index = list.value.findIndex(
      item => item.id === selectedItem.value?.id,
    )
    if (index >= 0) {
      list.value[index] = data
    }
  }

  selectedItem.value = undefined
}

function onCancel() {
  selectedItem.value = undefined
}

function onSubmit() {
  if (canUndo.value) {
    emits('confirm', list.value)
    clear()
  }
  emits('close')
}

async function onClose() {
  if (selectedItem.value) {
    const data = await formBarEl.value!.getData()
    if (!isEqual(data, selectedItem)) {
      await modal('confirm', {
        title: '提示！',
        content: '您当前的编辑还未确定，关闭弹窗后不会保存，是否确定关闭？',
      })
    }
  }
  if (canUndo.value) {
    await modal('confirm', {
      title: '提示！',
      content: '您当前的修改还未提交，关闭弹窗后修改不会保存，是否确定关闭？',
    })
  }
  emits('close')
}
</script>
