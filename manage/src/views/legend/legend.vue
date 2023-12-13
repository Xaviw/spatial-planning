<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between">
      <h1 class="font-bold">图例</h1>

      <AButton type="primary" @click="add">新增</AButton>
    </div>

    <AAlert message="拖拽表格行调整顺序" showIcon class="my-2" />

    <EditableTable
      ref="tableEl"
      :columns="columns"
      v-model="list"
      :loading="loading"
      :addFunc="addFunc"
      :replaceFunc="replaceFunc"
      :removeFunc="removeFunc"
      :moveFunc="moveFunc"
      class="flex-1"
    >
      <template #bodyCell="{ column, record, text, editableData }">
        <template v-if="column.dataIndex === 'name'">
          <AInput
            v-if="editableData[record.id]"
            v-model:value="editableData[record.id][column.dataIndex]"
            style="margin: -5px 0; width: auto"
          />
          <template v-else>
            {{ text }}
          </template>
        </template>

        <template v-else-if="column.dataIndex === 'img'">
          <AInput
            v-if="editableData[record.id]"
            v-model:value="editableData[record.id][column.dataIndex]"
            style="margin: -5px 0; width: auto"
          />
          <AImage v-else :src="text" :height="30" :fallback="ImageFailed" />
        </template>

        <template v-else-if="column.dataIndex === 'type'">
          <ASelect
            v-if="editableData[record.id]"
            :fieldNames="{ label: 'name', value: 'id' }"
            :options="typeList"
            placeholder="请选择图例类型！"
            v-model:value="
              (editableData[record.id] as Recordable)[column.dataIndex]
            "
            style="margin: -5px 0; width: 100%"
          />
          <template v-else>
            {{ text.name }}
          </template>
        </template>
      </template>
    </EditableTable>
  </div>
</template>

<script setup lang="ts">
import {
  getLegend,
  addLegend,
  setLegend,
  removeLegend,
  moveLegend,
} from '@sp/shared/apis'
import ImageFailed from '@sp/shared/assets/images/image-failed-filled.png'
import { EditableTable } from '@sp/shared/components'
import { modal } from '@sp/shared/utils'
import { useRequest } from 'alova'
import type { LegendItem, LegendTypeItem } from '#/request'
import type { ColumnType } from 'ant-design-vue/es/table'

const typeList = inject<Ref<LegendTypeItem[]>>('typeList', () => ref([]), true)

const tableEl = ref<ComponentExposed<typeof EditableTable<LegendItem>> | null>(
  null,
)

const columns: ColumnType[] = [
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '图片',
    dataIndex: 'img',
    width: 200,
    align: 'center',
  },
  {
    title: '分类',
    dataIndex: 'type',
    width: 215,
  },
]

const { data: list, loading, send } = useRequest(getLegend, { initialData: [] })

function scrollToBottom(element: HTMLElement, duration: number) {
  const start = element.scrollTop
  const end = element.scrollHeight - element.clientHeight
  const change = end - start
  let currentTime = 0
  const increment = 20

  function animateScroll() {
    currentTime += increment
    const val = easeInOutQuad(currentTime, start, change, duration)
    element.scrollTop = val
    if (currentTime < duration) {
      requestAnimationFrame(animateScroll)
    }
  }

  animateScroll()
}

function easeInOutQuad(t: number, b: number, c: number, d: number): number {
  t /= d / 2
  if (t < 1) return (c / 2) * t * t + b
  t--
  return (-c / 2) * (t * (t - 2) - 1) + b
}

function add() {
  tableEl.value?.add()
  nextTick(() => {
    const tbody = ((tableEl.value as any).$el as HTMLDivElement).querySelector(
      '.ant-table-tbody',
    ) as HTMLDivElement
    console.log('tbody: ', tbody)
    scrollToBottom(tbody!, 1000)
  })
}

function validate(data: LegendItem) {
  const errMsg = !data.name
    ? '请填写名称！'
    : !data.img
    ? '请上传图片！'
    : !data.type
    ? '请选择分类！'
    : ''
  if (errMsg) {
    modal('warning', {
      title: '提示！',
      content: errMsg,
    })
    return Promise.reject()
  }
}

async function addFunc(data: LegendItem) {
  await validate(data)
  const { label: name, value: id } = data.type as unknown as {
    label: string
    value: string
  }
  return addLegend({ ...data, type: id })
    .send()
    .then((newId: string) => ({ ...data, id: newId, type: { name, id } }))
}

async function replaceFunc(data: LegendItem) {
  await validate(data)
  const { label: name, value: id } = data.type as unknown as {
    label: string
    value: string
  }
  return setLegend({ ...data, type: id })
    .send()
    .then(() => ({ ...data, type: { name, id } }))
}

function removeFunc(data: LegendItem) {
  return removeLegend(data.id).send()
}

function moveFunc(oldIndex: number, newIndex: number) {
  return moveLegend({ oldIndex, newIndex }).send()
}

defineExpose({
  reload: () => {
    send()
    tableEl.value?.clear()
  },
})
</script>
