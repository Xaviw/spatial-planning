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
            labelInValue
            :options="typeList"
            placeholder="请选择图例类型！"
            v-model:value="editableData[record.id][column.dataIndex].id"
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
import { useRequest } from 'alova'
import type { LegendItem, LegendTypeItem } from '#/request'
import type { ColumnType } from 'ant-design-vue/es/table'

const typeList = inject<LegendTypeItem[]>('typeList', () => [], true)

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

function add() {
  tableEl.value?.add()
}

function addFunc(data: LegendItem) {
  const { label: name, value: id } = data.type.id as unknown as {
    label: string
    value: string
  }
  return addLegend({ ...data, type: id })
    .send()
    .then((newId: string) => ({ ...data, id: newId, type: { name, id } }))
}

function replaceFunc(data: LegendItem) {
  const { label: name, value: id } = data.type.id as unknown as {
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
