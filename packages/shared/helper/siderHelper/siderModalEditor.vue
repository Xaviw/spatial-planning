<template>
  <ContentWrapper :title="modalTitle" @close="$emit('close')">
    <div class="h-80vh flex">
      <div class="sidebar" :style="{ width: modalWidth }">
        <div class="header">
          <i class="i-ic:outline-menu mr-2" />
          详情栏
        </div>
        <div class="flex-1 overflow-auto">
          <DraggableList
            id="right"
            v-model="list"
            group="sider"
            enableContextMenu
            @edit="onEdit"
            :selectedId="selectedItem?.id"
          />
        </div>
      </div>

      <MaterialBar :inModal="true" />

      <div class="min-w-100 flex flex-1 flex-col bg-white p-4">
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
              确认
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
import { nextTick, ref, watchEffect } from 'vue'
import { ContentWrapper, componentForms } from '../../components'
import { BaseForm } from '../../helper/siderHelper'
import { modal } from '../../utils'
import DraggableList from './draggableList.vue'
import MaterialBar from './materialBar.vue'
import type { DetailItem } from '#/request'

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

const list = ref<DetailItem[]>([])

watchEffect(() => {
  if (props.modalData?.length) {
    list.value = props.modalData
  }
})

const selectedItem = ref<DetailItem>()

function onEdit(item: DetailItem) {
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

async function onConfirm() {
  await baseFormEl.value?.validate()
  await componentFormEl.value?.validate()

  const data = {
    ...baseFormEl.value!.formModel,
    props: componentFormEl.value!.formModel,
  } as DetailItem

  let index = list.value.findIndex(item => item.id === selectedItem.value!.id)
  if (index < 0) {
    throw new Error('编辑的组件不存在！')
  }
  list.value[index] = data

  onCancel()
}

function onReset() {
  baseFormEl.value?.resetFields()
  componentFormEl.value?.resetFields()
}

function onCancel() {
  selectedItem.value = undefined
}

async function onSubmit() {
  if (selectedItem.value) {
    await modal('warning', {
      title: '警告！',
      content: '当前存在未确定的编辑，是否直接提交？',
    })
  }
  emits('confirm', list.value)
  emits('close')
}
</script>
