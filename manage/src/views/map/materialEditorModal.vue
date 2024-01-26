<template>
  <ContentWrapper :title="modalTitle" @close="onClose">
    <div class="h-80vh flex overflow-auto">
      <SiderBar
        v-model="list"
        @edit="onEdit"
        @remove="onRemove"
        enableContextMenu
      >
        <template #title>
          <i class="i-ic:outline-menu mr-2" />
          详情栏
        </template>
      </SiderBar>

      <MaterialBar />

      <FormBar
        class="w-100"
        inModal
        :canRedo="canRedo"
        :canUndo="canUndo"
        :selectedItem="selectedItem"
        @redo="redo"
        @undo="undo"
        @confirm="onConfirm"
        @cancel="onCancel"
        @submit="onSubmit"
        ref="formBarEl"
      />
    </div>
  </ContentWrapper>
</template>

<script setup lang="ts">
import { ContentWrapper } from '@sp/shared/components'
import { MaterialBar, SiderBar, FormBar } from '@sp/shared/helpers/material'
import { cloneDeep, isEqual, modal } from '@sp/shared/utils'
import type { MaterialItem } from '#/materials'

const props = withDefaults(
  defineProps<{
    id: string
    modalTitle: string
    modalWidth?: string
    materials: MaterialItem[]
  }>(),
  {
    modalWidth: '25rem',
    materials: () => [],
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

// 打开时初始化数据
watch(
  () => props.id,
  id => {
    if (id) {
      list.value = cloneDeep(props.materials)
      nextTick(clear)
    }
  },
  { immediate: true },
)

const selectedItem = ref<MaterialItem>()

async function onEdit(item: MaterialItem) {
  if (selectedItem.value && formBarEl.value) {
    // 正在编辑，忽略操作
    if (item.id === selectedItem.value.id) return
    const data = formBarEl.value.formModel()
    // 有编辑操作，警告
    if (
      data.status !== selectedItem.value.status ||
      !isEqual(data.props, selectedItem.value.props)
    ) {
      await modal('confirm', {
        title: '提示！',
        content: '您有正在编辑的组件还未保存，是否直接切换？',
        okText: '切换',
      })
    }
  }
  selectedItem.value = item
}

function onRemove(index: number) {
  // 删除正在编辑的组件先取消编辑
  if (selectedItem.value?.id === list.value[index].id) {
    selectedItem.value = undefined
  }
  list.value.splice(index, 1)
}

function onConfirm(e: MaterialItem) {
  if (!selectedItem.value) return
  // 对象判断是否更改再赋值，未变更时可以不生成操作记录
  if (!isEqual(selectedItem.value.props, e.props)) {
    selectedItem.value.props = e.props
  }
  // 简单值如果相同直接赋值不会触发变更
  selectedItem.value.status = e.status
  selectedItem.value = undefined
}

async function onCancel(e: MaterialItem) {
  if (!selectedItem.value) return
  if (
    selectedItem.value.status !== e.status ||
    !isEqual(selectedItem.value.props, e.props)
  ) {
    await modal('confirm', {
      title: '警告',
      content: '取消后您的编辑不会保存，是否确定取消？',
    })
  }
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
    const data = formBarEl.value?.formModel
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
