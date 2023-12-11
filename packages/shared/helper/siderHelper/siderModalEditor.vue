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
            @mutative="onMutative"
            :selectedId="selectedItem?.id"
          />
        </div>
      </div>

      <MaterialBar :inModal="true" />

      <FormBar
        inModal
        :patches="patches"
        :inversePatches="inversePatches"
        :patchFlag="patchFlag"
        :selectedItem="selectedItem"
        @cancel="onCancel"
        @confirm="onConfirm"
        @submit="onSubmit"
        @redo="onRevokeOrRedo(redo)"
        @revoke="onRevokeOrRedo(revoke)"
        ref="formBarEl"
      />
    </div>
  </ContentWrapper>
</template>

<script setup lang="ts">
import { isEqual, cloneDeep } from 'lodash-es'
import { ref, watchEffect } from 'vue'
import { ContentWrapper } from '../../components'
import { FormBar } from '../../helper/siderHelper'
import { useMutative } from '../../hooks'
import { modal } from '../../utils'
import DraggableList from './draggableList.vue'
import MaterialBar from './materialBar.vue'
import type { DetailItem, SiderChangeParams } from '#/request'

const props = withDefaults(
  defineProps<{
    modalTitle: string
    modalWidth?: string
    modalData: DetailItem[]
  }>(),
  {
    modalWidth: '25rem',
    modalData: () => [],
  },
)

const emits = defineEmits<{
  (e: 'close'): void
  (e: 'confirm', list: DetailItem[]): void
}>()

const formBarEl = ref<InstanceType<typeof FormBar> | null>(null)

const { redo, revoke, reset, patchFlag, inversePatches, update, patches } =
  useMutative([] as DetailItem[])

const list = ref<DetailItem[]>([])

watchEffect(() => {
  if (props.modalData?.length) {
    reset(cloneDeep(props.modalData))
    list.value = cloneDeep(props.modalData)
  }
})

const selectedItem = ref<DetailItem>()

async function onEdit(item: DetailItem) {
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

async function onRemove(_position: string, index: number) {
  await modal('confirm', {
    title: '提示！',
    content: '是否确定删除？',
  })
  list.value.splice(index, 1)
  update(draft => {
    draft.splice(index, 1)
  })
}

function onConfirm(data: DetailItem, equal: boolean) {
  if (!equal) {
    const index = list.value.findIndex(
      item => item.id === selectedItem.value?.id,
    )
    if (index >= 0) {
      list.value[index] = data
      update(draft => {
        draft[index] = data
      })
    }
  }

  selectedItem.value = undefined
}

function onCancel() {
  selectedItem.value = undefined
}

function onMutative(e: SiderChangeParams) {
  if (e.name === 'add') {
    update(draft => {
      draft.splice(e.newIndex!, 0, e.data)
    })
  } else if (e.name === 'move') {
    update(draft => {
      draft.splice(e.oldIndex!, 1)
      draft.splice(e.newIndex!, 0, e.data)
    })
  }
}

function onSubmit() {
  if (patches.value.length - patchFlag.value) {
    emits('confirm', list.value)
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
  if (patches.value.length - patchFlag.value) {
    await modal('confirm', {
      title: '提示！',
      content: '您当前的修改还未提交，关闭弹窗后修改不会保存，是否确定关闭？',
    })
  }
  emits('close')
}

function onRevokeOrRedo(func: typeof revoke | typeof redo) {
  const state = func()
  list.value = [...state]
}
</script>
