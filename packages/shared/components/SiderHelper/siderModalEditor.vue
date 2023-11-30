<template>
  <ContentWrapper :title="title" @close="$emit('close')">
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

      <SiderFormBar
        :inModal="true"
        :selectedItem="selectedItem"
        class="w-100"
        @submit="onSubmit"
        @cancel="onEdit()"
      />
    </div>
    <div class="bg-[#1a4f84] px-4 py-2 text-right">
      <AButton @click="onConfirm" type="primary">完成编辑</AButton>
    </div>
  </ContentWrapper>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { modal } from '../../utils'
import ContentWrapper from '../ContentWrapper/index.vue'
import DraggableList from './draggableList.vue'
import MaterialBar from './materialBar.vue'
import SiderFormBar from './siderFormBar.vue'
import type { DetailItem } from '#/client'

const props = withDefaults(
  defineProps<{
    title: string
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

const list = ref<DetailItem[]>([])

watchEffect(() => {
  if (props.modalData?.length) {
    list.value = props.modalData.map((item, index) => ({
      ...item,
      id: index + '',
    }))
  }
})

const selectedItem = ref<DetailItem>()

function onEdit(item?: DetailItem) {
  selectedItem.value = item
}

function onSubmit(params: DetailItem) {
  const index = list.value.findIndex(item => item.id === params.id)
  list.value[index] = params
  onEdit()
}

async function onConfirm() {
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
