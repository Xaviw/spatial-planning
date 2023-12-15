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
      :addFn="addFn"
      :replaceFn="replaceFn"
      :removeFn="removeFn"
      :moveFn="moveFn"
      :customEqual="customEqual"
      :rowClassName="filterFn"
      @change="onTableChange"
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

const filteredRows = ref<string[]>([])

// 使用display:hidden模拟筛选，避免拖拽时错误
function filterFn(record: LegendEditItem) {
  return filteredRows.value.includes(record.id) ? 'hidden' : ''
}

// 切换筛选时清空筛选列表
function onTableChange() {
  filteredRows.value = []
}

const columns = computed(() => {
  return [
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
      filters: [
        ...typeList.value.map(item => ({
          text: item.name,
          value: item.id,
        })),
        { text: '其他', value: '-1' },
      ],
      filterMultiple: false,
      onFilter(value, record: LegendEditItem) {
        // 加nextTick使晚于table change事件触发，可以在change事件中清空筛选列
        nextTick(() => {
          if (value === '-1') {
            if (
              typeList.value.map(item => item.id).includes(record.type.value)
            ) {
              filteredRows.value.push(record.id)
            }
          } else if (record.type.value !== value) {
            filteredRows.value.push(record.id)
          }
        })
        return true
      },
    },
  ] as ColumnType[]
})

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

async function addFn(data: LegendEditItem) {
  await validate(data)
  return addLegend({ ...data, type: data.type.value })
    .send()
    .then((newId: string) => ({ ...data, id: newId }))
}

async function replaceFn(data: LegendEditItem) {
  await validate(data)
  return setLegend({ ...data, type: data.type.value })
    .send()
    .then(() => data)
}

function removeFn(data: LegendEditItem) {
  return removeLegend(data.id).send()
}

function moveFn(oldIndex: number, newIndex: number) {
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
