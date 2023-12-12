<template>
  <div>
    <div class="flex items-center justify-between">
      <h1 class="font-bold">图例分类</h1>

      <AButton type="primary" @click="add">新增</AButton>
    </div>

    <AAlert message="拖拽表格行调整顺序" showIcon class="my-2" />

    <AAlert
      message="仅有一项分类时，是否显示分类切换面板"
      showIcon
      v-if="list.length === 1"
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

    <VueDraggable v-model="list" target=".ant-table-tbody">
      <ATable
        :columns="columns"
        :dataSource="list"
        :loading="listLoading"
        :pagination="false"
      >
        <template #bodyCell="{ column, text, record, index }">
          <span v-if="column.dataIndex === 'index'" class="text-gray">
            {{ index + 1 }}
          </span>

          <template v-else-if="column.dataIndex === 'name'">
            <AInput
              v-if="editableData[record.id]"
              v-model:value="editableData[record.id][column.dataIndex]"
              style="margin: -5px 0; width: auto"
            />
            <template v-else>
              {{ text }}
            </template>
          </template>

          <template v-else>
            <template v-if="editableData[record.id]">
              <AButton type="link" @click="save(record.id)">保存</AButton>
              <APopconfirm
                title="是否取消编辑？"
                @confirm="cancel(record.id)"
                v-if="list.length > 1"
              >
                <AButton type="link" danger>取消</AButton>
              </APopconfirm>
            </template>

            <template v-else>
              <AButton type="link" @click="edit(record.id)">编辑</AButton>
              <APopconfirm
                title="是否确定删除？"
                @confirm="remove(record.id)"
                v-if="list.length > 1"
              >
                <AButton type="link" danger>删除</AButton>
              </APopconfirm>
            </template>
          </template>
        </template>
      </ATable>
    </VueDraggable>
  </div>
</template>

<script setup lang="ts">
import {
  getShowSingleType,
  setShowSingleType,
  getLegendType,
  addLegendType,
  setLegendType,
  removeLegendType,
  // moveLegendType,
} from '@sp/shared/apis'
import { useRequest } from 'alova'
import { message } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { VueDraggable } from 'vue-draggable-plus'
import type { LegendTypeItem } from '#/request'
import type { ColumnType } from 'ant-design-vue/es/table'

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

const { data: list, loading: listLoading } = useRequest(getLegendType, {
  initialData: [],
})

const columns: ColumnType[] = [
  {
    title: '序号',
    dataIndex: 'index',
    width: 60,
    align: 'center',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 160,
    align: 'center',
  },
]

const editableData = reactive<Record<string, LegendTypeItem>>({})

function edit(id: string) {
  editableData[id] = cloneDeep(list.value.find(item => id === item.id)!)
}

function save(id: string) {
  listLoading.value = true
  const index = list.value.findIndex(item => item.id === id)
  if (id.startsWith('add')) {
    addLegendType(list.value[index])
      .send()
      .then((newId: string) => {
        message.success('新增成功！')
        list.value[index] = { id: newId, name: editableData[id].name }
      })
      .finally(() => {
        listLoading.value = false
      })
  } else {
    setLegendType({ id, name: editableData[id].name })
      .send()
      .then(() => {
        message.success('保存成功！')
        list.value[index].name = editableData[id].name
        delete editableData[id]
      })
      .finally(() => {
        listLoading.value = false
      })
  }
}

function cancel(id: string) {
  if (id.startsWith('add')) {
    const index = list.value.findIndex(item => item.id === id)
    list.value.splice(index, 1)
  }
  delete editableData[id]
}

function remove(id: string) {
  listLoading.value = true
  removeLegendType(id)
    .send()
    .then(() => {
      message.success('删除成功！')
      const index = list.value.findIndex(item => item.id === id)
      list.value.splice(index, 1)
      cancel(id)
    })
    .finally(() => {
      listLoading.value = false
    })
}

function add() {
  const id = `add_${Date.now()}`
  list.value.unshift({ id, name: '' })
  editableData[id] = { id, name: '' }
}
</script>
