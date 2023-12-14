<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between">
      <h1 class="font-bold">图例</h1>

      <AButton type="primary" @click="add" :disabled="loading">新增</AButton>
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
      :customEqual="customEqual"
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
            labelInValue
            placeholder="请选择图例类型！"
            v-model:value="editableData[record.id][column.dataIndex]"
            style="margin: -5px 0; width: 100%"
          />
          <template v-else>
            {{ text?.label }}
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
import { isEqual } from 'lodash-es'
import type { LegendEditItem, LegendTypeItem } from '#/request'
import type { ColumnType } from 'ant-design-vue/es/table'

const typeList = inject<Ref<LegendTypeItem[]>>('typeList', () => ref([]), true)

const tableEl = ref<ComponentExposed<
  typeof EditableTable<LegendEditItem>
> | null>(null)

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

const {
  data: list,
  loading,
  send,
  onSuccess,
} = useRequest(getLegend, { initialData: [] })

onSuccess(() => {
  tableEl.value?.clear()
})

function add() {
  tableEl.value?.add()
}

function validate(data: LegendEditItem) {
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

async function addFunc(data: LegendEditItem) {
  await validate(data)
  return addLegend({ ...data, type: data.type.value })
    .send()
    .then((newId: string) => ({ ...data, id: newId }))
}

async function replaceFunc(data: LegendEditItem) {
  await validate(data)
  return setLegend({ ...data, type: data.type.value })
    .send()
    .then(() => data)
}

function removeFunc(data: LegendEditItem) {
  return removeLegend(data.id).send()
}

function moveFunc(oldIndex: number, newIndex: number) {
  return moveLegend({ oldIndex, newIndex }).send()
}

function customEqual(data: LegendEditItem, newData: LegendEditItem) {
  const {
    name,
    img,
    type: { value },
  } = data
  const {
    name: newName,
    img: newImg,
    type: { value: newValue },
  } = newData
  return isEqual([name, img, value], [newName, newImg, newValue])
}

defineExpose({
  reload: () => {
    send()
    tableEl.value?.clear()
  },
})
</script>
