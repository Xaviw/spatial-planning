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
            @mutative="onMutative"
            :selectedId="selectedItem?.id"
          />
        </div>
      </div>

      <MaterialBar :inModal="true" @mutative="onMutative" />

      <div class="min-w-100 flex flex-1 flex-col bg-white p-4">
        <div class="mb-2 flex justify-between">
          <AButton
            danger
            :disabled="inversePatches.length - patchFlag <= 0"
            @click="onRevokeOrRedo(revoke)"
          >
            撤销
          </AButton>
          <AButton
            type="primary"
            class="mx-2"
            ghost
            :disabled="patchFlag <= 0"
            @click="onRevokeOrRedo(redo)"
          >
            重做
          </AButton>
        </div>
        <template v-if="selectedItem">
          <div class="flex-1 overflow-auto">
            <BaseForm ref="baseFormEl" inModal />

            <component
              :is="componentForms[selectedItem.type]"
              :key="selectedItem.id"
              ref="componentFormEl"
              v-bind="selectedItem.props"
              inModal
            />
          </div>

          <div class="flex">
            <AButton class="flex-1" type="primary" @click="onConfirm">
              确定
            </AButton>
            <AButton class="mx-4 flex-1" @click="onReset">重置</AButton>
            <AButton class="flex-1" danger @click="onCancel">取消</AButton>
          </div>
        </template>

        <AEmpty
          v-else
          description="请右击组件，选择“编辑”"
          class="h-full flex flex-col items-center justify-center"
        />
      </div>
    </div>

    <div class="bg-[#1a4f84] px-4 py-2 text-right">
      <AButton @click="onSubmit" type="primary">完成编辑</AButton>
    </div>
  </ContentWrapper>
</template>

<script setup lang="ts">
import { isEqual } from 'lodash-es'
import { nextTick, ref, watchEffect } from 'vue'
import { ContentWrapper, componentForms } from '../../components'
import { BaseForm } from '../../helper/siderHelper'
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

const baseFormEl = ref<InstanceType<typeof BaseForm> | null>(null)
const componentFormEl = ref<InstanceType<typeof BaseForm> | null>(null)

const { redo, revoke, reset, patchFlag, inversePatches, update, patches } =
  useMutative([] as DetailItem[])
const list = ref<DetailItem[]>([])

watchEffect(() => {
  if (props.modalData?.length) {
    reset(props.modalData)
    list.value = props.modalData
  }
})

const selectedItem = ref<DetailItem>()

async function onEdit(item: DetailItem) {
  if (selectedItem.value) {
    if (item.id === selectedItem.value.id) return
    const check = checkDataChanged()
    if (check) {
      await modal('confirm', {
        title: '提示！',
        content: '您有正在编辑的组件还未保存，是否直接切换？',
        okText: '切换',
      })
    }
  }
  selectedItem.value = item
  nextTick(() => {
    if (!baseFormEl.value || !componentFormEl.value) {
      throw new Error('表单渲染失败！')
    }

    const { initialModel: baseInitModel } = baseFormEl.value
    const { initialModel: componentInitModel } = componentFormEl.value

    // 合并默认值，确保非必填属性也有值
    baseFormEl.value!.formModel = { ...baseInitModel, ...item }
    componentFormEl.value!.formModel = {
      ...componentInitModel,
      ...item.props,
    }
  })
}

function checkDataChanged() {
  const data = {
    ...baseFormEl.value!.formModel,
    props: componentFormEl.value!.formModel,
  } as DetailItem

  let index = list.value.findIndex(item => item.id === selectedItem.value!.id)
  if (index < 0) {
    return false
  }
  if (isEqual(data, list.value[index])) {
    return false
  } else {
    return { data, index }
  }
}

async function onConfirm() {
  await baseFormEl.value?.validate()
  await componentFormEl.value?.validate()

  const check = checkDataChanged()
  if (check) {
    list.value[check.index] = check.data
    update(draft => {
      draft[check.index] = check.data
    })
  }

  selectedItem.value = undefined
}

function onReset() {
  baseFormEl.value?.resetFields()
  componentFormEl.value?.resetFields()
}

async function onCancel() {
  const check = checkDataChanged()
  if (check) {
    await modal('confirm', {
      title: '提示！',
      content: '您当前编辑还未保存，是否确定取消？',
    })
  }
  selectedItem.value = undefined
}

function onMutative(e: SiderChangeParams) {
  if (e.name === 'add') {
    update(draft => {
      draft.splice(e.newIndex!, 0, e.data)
    })
  } else if (e.name === 'remove') {
    update(draft => {
      draft.splice(e.oldIndex!, 1)
    })
  } else if (e.name === 'move') {
    update(draft => {
      draft.splice(e.oldIndex!, 1)
      draft.splice(e.newIndex!, 0, e.data)
    })
  }
}

async function onSubmit() {
  const check = selectedItem.value ? checkDataChanged() : false
  if (check) {
    await modal('warning', {
      title: '警告！',
      content: '当前存在未确定的编辑，是否直接提交？',
    })
  }
  if (patches.value.length - patchFlag.value) {
    emits('confirm', list.value)
  }
  emits('close')
}

async function onClose() {
  const check = selectedItem.value ? checkDataChanged() : false
  if (check || patches.value.length - patchFlag.value) {
    await modal('confirm', {
      title: '提示！',
      content: '您当前的修改还未提交，关闭弹窗后修改不会保存，是否确定关闭？',
    })
  }
  emits('close')
}

function onRevokeOrRedo(func: typeof revoke | typeof redo) {
  const state = func()
  console.log('state: ', state)
  list.value = state
}
</script>
