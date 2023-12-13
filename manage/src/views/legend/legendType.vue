<template>
  <div class="flex flex-col">
    <div class="flex items-center justify-between">
      <h1 class="font-bold">图例分类</h1>

      <AButton type="primary" @click="add">新增</AButton>
    </div>

    <AAlert message="拖拽表格行调整顺序" showIcon class="my-2" />

    <AAlert
      message="仅有一项分类时，是否显示分类切换面板"
      showIcon
      v-if="typeList.length === 1"
    >
      <template #action>
        <ASwitch
          class="ml-4"
          checkedChildren="显示"
          unCheckedChildren="隐藏"
          :checked="showSingle"
          :loading="showSingleLoading || setSingleTypeLoading"
          @change="sendSetSingleType"
        />
      </template>
    </AAlert>

    <EditableTable
      ref="tableEl"
      :columns="columns"
      v-model="typeList"
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
      </template>
    </EditableTable>
  </div>
</template>

<script setup lang="ts">
import {
  getShowSingleType,
  setShowSingleType,
  addLegendType,
  setLegendType,
  removeLegendType,
  moveLegendType,
} from '@sp/shared/apis'
import { EditableTable } from '@sp/shared/components'
import { useRequest } from 'alova'
import type { LegendTypeItem } from '#/request'
import type { ColumnType } from 'ant-design-vue/es/table'

defineProps<{ loading: boolean }>()

const emits = defineEmits<{
  (e: 'remove', id: string): void
}>()

const { data: showSingle, loading: showSingleLoading } = useRequest(
  getShowSingleType,
  { initialData: true },
)

const {
  send: sendSetSingleType,
  loading: setSingleTypeLoading,
  onSuccess: onSetSingleTypeSuccess,
} = useRequest((value: boolean) => setShowSingleType(value), {
  immediate: false,
})

onSetSingleTypeSuccess(({ sendArgs }) => {
  showSingle.value = sendArgs[0]
})

const tableEl = ref<ComponentExposed<
  typeof EditableTable<LegendTypeItem>
> | null>(null)

const typeList = inject<LegendTypeItem[]>('typeList', () => [], true)

const columns: ColumnType[] = [
  {
    title: '名称',
    dataIndex: 'name',
    width: 215,
  },
]

function add() {
  tableEl.value?.add()
}

function addFunc(data: LegendTypeItem) {
  return addLegendType(data)
    .send()
    .then((newId: string) => {
      return { ...data, id: newId }
    })
}

function replaceFunc(data: LegendTypeItem) {
  return setLegendType(data)
    .send()
    .then(() => data)
}

function removeFunc(data: LegendTypeItem) {
  return removeLegendType(data.id)
    .send()
    .then(() => {
      emits('remove', data.id)
    })
}

function moveFunc(oldIndex: number, newIndex: number) {
  return moveLegendType({ oldIndex, newIndex }).send()
}
</script>
