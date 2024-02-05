<template>
  <div class="relative h-full min-w-400 flex">
    <Loading absolute :loading="loading" />

    <SiderBar
      v-model="list.left"
      :disabled="!selectedMenu"
      enableContextMenu
      :selectedId="selectedItem?.id"
      @edit="onEdit"
      @remove="onRemove('left', $event)"
    >
      <template #title>
        <i class="i-ant-design:pic-left-outlined mr-2" />
        左栏
      </template>
    </SiderBar>

    <SiderBar
      v-model="list.right"
      :disabled="!selectedMenu"
      enableContextMenu
      :selectedId="selectedItem?.id"
      @edit="onEdit"
      @remove="onRemove('right', $event)"
    >
      <template #title>
        <i class="i-ant-design:pic-right-outlined mr-2" />
        右栏
      </template>
    </SiderBar>

    <MaterialBar :disabled="!selectedMenu" />

    <FormBar
      ref="formEl"
      class="flex-1"
      showMenu
      showRefresh
      :canRedo="canRedo"
      :canUndo="canUndo"
      :disabled="!selectedMenu"
      :selectedItem="selectedItem"
      @undo="undo"
      @redo="redo"
      @menuChange="getList"
      @refresh="onRefresh"
      @confirm="onConfirm"
      @cancel="onCancel"
      @submit="onSubmit"
    >
      <template #alert>
        <AAlert showIcon class="mb-2">
          <template #message>
            <div>拖拽“左栏”、“右栏”中的组件移动位置；</div>
            <div>右击“左栏”、“右栏”中的组件进行编辑或删除；</div>
            <div>拖拽“物料栏”中的组件到“左栏”、“右栏”中进行新增；</div>
          </template>
        </AAlert>
      </template>
    </FormBar>
  </div>
</template>

<script setup lang="ts">
import { getSider, setSider } from '@sp/shared/apis'
import { Loading } from '@sp/shared/components'
import { SiderBar, FormBar, MaterialBar } from '@sp/shared/helpers/material'
import { modal, getOperationsFromDiff } from '@sp/shared/utils'
import { message } from 'ant-design-vue'
import { equals } from 'ramda'
import type { SiderPosition, SiderItem } from '#/business'

const list = ref<{ left: SiderItem[]; right: SiderItem[] }>({
  left: [],
  right: [],
})

const loading = ref(false)

const { canRedo, canUndo, clear, redo, undo, history } = useRefHistory(list, {
  deep: true,
})

const selectedItem = ref<SiderItem>()

const selectedMenu = ref<string>()

function getList(menuId?: string) {
  if (!menuId) {
    list.value.left = []
    list.value.right = []
    nextTick(clear)
    return
  }
  selectedMenu.value = menuId
  loading.value = true

  const leftEvent = getSider({
    filter: false,
    menuId,
    position: 'left',
  }).send()

  const rightEvent = getSider({
    filter: false,
    menuId,
    position: 'right',
  }).send()

  Promise.all([leftEvent, rightEvent])
    .then(([left, right]) => {
      list.value.left = left
      list.value.right = right
      nextTick(clear)
    })
    .finally(() => {
      loading.value = false
    })
}

const formEl = ref<ComponentExposed<typeof FormBar<SiderItem>> | null>(null)

async function onRefresh() {
  if (canUndo.value) {
    await modal('confirm', {
      title: '警告',
      content: '刷新后您的操作不会保存，是否确定刷新？',
    })
  }
  getList(selectedMenu.value)
}

async function onEdit(item: SiderItem) {
  if (selectedItem.value && formEl.value) {
    const formModel = formEl.value.formModel()
    // 正在编辑，忽略
    if (item.id === formModel.id) return
    // 存在未保存的编辑，警告
    if (
      selectedItem.value.status !== formModel.status ||
      !equals(selectedItem.value.props, formModel.props)
    ) {
      await modal('confirm', {
        title: '警告',
        content:
          '您当前编辑还未保存，切换后将会丢失已修改的编辑，是否确定切换？',
      })
    }
  }
  // 切换编辑组件
  selectedItem.value = item
}

function onRemove(position: SiderPosition, index: number) {
  // 删除正在编辑的组件先取消编辑
  if (selectedItem.value?.id === list.value[position][index].id) {
    selectedItem.value = undefined
  }
  list.value[position].splice(index, 1)
}

function onConfirm(e: SiderItem) {
  if (!selectedItem.value) return
  // 对象判断是否更改再赋值，未变更时可以不生成操作记录
  if (!equals(selectedItem.value.props, e.props)) {
    selectedItem.value.props = e.props
  }
  // 简单值如果相同直接赋值不会触发变更
  selectedItem.value.status = e.status
  selectedItem.value = undefined
}

async function onCancel(e: SiderItem) {
  if (!selectedItem.value) return
  if (
    selectedItem.value.status !== e.status ||
    !equals(selectedItem.value.props, e.props)
  ) {
    await modal('confirm', {
      title: '警告',
      content: '取消后您的编辑不会保存，是否确定取消？',
    })
  }
  selectedItem.value = undefined
}

function onSubmit() {
  // 获取初始数据
  const sourceData = history.value[history.value.length - 1]?.snapshot

  // 为数据添加必要字段
  function transformer(item, position: SiderPosition) {
    return {
      ...item,
      position,
      menuId: selectedMenu.value,
    }
  }

  // 计算变更
  const diffs = getOperationsFromDiff(
    [
      ...list.value.left.map(item => transformer(item, 'left')),
      ...list.value.right.map(item => transformer(item, 'right')),
    ],
    [
      ...sourceData.left.map(item => transformer(item, 'left')),
      ...sourceData.right.map(item => transformer(item, 'right')),
    ],
    'sort',
  )

  if (!diffs.length) {
    message.success('没有任何修改，正在刷新数据！')
    getList(selectedMenu.value!)
    return
  }

  loading.value = true
  setSider(diffs)
    .send()
    .then(() => {
      message.success('提交成功，正在刷新数据！')
      getList(selectedMenu.value!)
    })
    .catch(() => {
      loading.value = false
    })
}
</script>
