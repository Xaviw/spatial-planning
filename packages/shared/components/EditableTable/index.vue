<template>
  <!-- 
    ATable设置scroll时，tbody首行会多出一个ant-table-measure-row用于测量宽度
    拖拽元素数量与数据数量不一致，会导致拖拽后排序错乱，所以这里需要增加一个占位数据
   -->
  <VueDraggable
    :modelValue="[{}, ...modelValue]"
    @update:modelValue="$emit('update:modelValue', $event.slice(1))"
    target=".ant-table-tbody"
    @update="move"
    class="overflow-hidden"
  >
    <ATable
      :columns="transformColumns"
      :dataSource="modelValue"
      :loading="loading || listLoading"
      :pagination="false"
      :scroll="scroll"
      ref="tableEl"
    >
      <template #headerCell="options">
        <slot name="headerCell" v-bind="options" :editableData="editableData" />
      </template>

      <template #bodyCell="{ column, text, record, index }">
        <span v-if="column.dataIndex === 'index'" class="text-gray">
          {{ index + 1 }}
        </span>

        <template v-else-if="column.dataIndex === 'operation'">
          <template v-if="editableData[record[rowKey]]">
            <AButton type="link" @click="save(record[rowKey])">保存</AButton>
            <APopconfirm
              title="是否取消编辑？"
              @confirm="cancel(record[rowKey])"
              v-if="modelValue.length > 1"
            >
              <AButton type="link" danger>取消</AButton>
            </APopconfirm>
          </template>

          <template v-else>
            <AButton type="link" @click="edit(record[rowKey])">编辑</AButton>
            <APopconfirm
              title="是否确定删除？"
              @confirm="remove(record[rowKey])"
              v-if="modelValue.length > 1"
            >
              <AButton type="link" danger>删除</AButton>
            </APopconfirm>
          </template>
        </template>

        <slot
          name="bodyCell"
          :index="index"
          :text="text"
          :column="column"
          :record="record"
          :editableData="editableData"
          v-else
        />
      </template>
    </ATable>
  </VueDraggable>
</template>

<script setup lang="ts" generic="T extends Recordable">
import { useTableScroll } from '@sp/shared/hooks'
import { message, Table } from 'ant-design-vue'
import { cloneDeep, isEqual } from 'lodash-es'
import { ref, reactive, computed, nextTick } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import type { SortableEvent } from '@sp/shared/helper/siderHelper/draggableList.vue'
import type { ColumnType } from 'ant-design-vue/es/table'

const props = withDefaults(
  defineProps<{
    columns: ColumnType[]
    modelValue: T[]
    loading?: boolean
    rowKey?: string
    addFunc: (arg: T, index: number) => Promise<T>
    replaceFunc: (arg: T, index: number) => Promise<T>
    removeFunc: (arg: T, index: number) => Promise<any>
    moveFunc: (oldIndex: number, newIndex: number) => Promise<any>
    /**
     * 自定义编辑数据与原数据比较函数，比较相等时无需提交至后端，默认采用lodash-isEqual比较
     * 支持传入接受新旧数据返回布尔值的函数，自定义比较
     * 或传入false，禁用比较
     */
    customEqual?: ((data: T, newData: T) => boolean) | false
  }>(),
  {
    rowKey: 'id',
    customEqual: isEqual,
  },
)

const emits = defineEmits<{
  (e: 'update:modelValue', list: T[]): void
}>()

const tableEl = ref<InstanceType<typeof Table> | null>(null)
const scroll = useTableScroll(tableEl)

const editableData = reactive<Record<string, T>>({})
const listLoading = ref(false)

const transformColumns = computed(() => {
  const baseColumns: ColumnType[] = [
    {
      title: '序号',
      dataIndex: 'index',
      width: 60,
      align: 'center',
    },
    {
      title: '操作',
      dataIndex: 'operation',
      width: 160,
      align: 'center',
    },
  ]
  baseColumns.splice(1, 0, ...props.columns)
  return baseColumns
})

function edit(id: string) {
  editableData[id] = cloneDeep(
    props.modelValue.find(item => id === item[props.rowKey])!,
  )
}

function getIndexAndData(id: string): [number, T] {
  const index = props.modelValue.findIndex(item => item[props.rowKey] === id)
  const data = cloneDeep(editableData[id] || props.modelValue[index])
  return [index, data]
}

function handleList(func: (list: T[]) => T[]) {
  const newList = func(props.modelValue.slice())
  emits('update:modelValue', newList)
}

function compareData(data: T, newData: T) {
  if (typeof props.customEqual === 'function') {
    return props.customEqual(newData, data)
  }
  return false
}

function save(id: string) {
  const [index, newData] = getIndexAndData(id)
  if (compareData(newData, props.modelValue[index])) {
    delete editableData[id]
    return
  }
  listLoading.value = true
  const isAdd = id.startsWith('add')
  const func = isAdd ? props.addFunc : props.replaceFunc
  func(newData, index)
    .then((data: T) => {
      message.success(`${isAdd ? '新增' : '修改'}成功！`)
      handleList(list => {
        list[index] = data
        return list
      })
      delete editableData[id]
    })
    .finally(() => {
      listLoading.value = false
    })
}

function cancel(id: string) {
  if (id.startsWith('add')) {
    const index = props.modelValue.findIndex(item => item[props.rowKey] === id)
    const newList = props.modelValue.slice()
    newList.splice(index, 1)
    emits('update:modelValue', newList)
  }
  delete editableData[id]
}

function remove(id: string) {
  listLoading.value = true
  const [index, newData] = getIndexAndData(id)
  props
    .removeFunc(newData, index)
    .then(() => {
      message.success('删除成功！')
      handleList(list => {
        list.splice(index, 1)
        return list
      })
    })
    .finally(() => {
      listLoading.value = false
    })
}

// 事件中的index包含占位数据，所以需要-1
function move({ oldIndex, newIndex }: SortableEvent) {
  if (typeof oldIndex !== 'number' || typeof newIndex !== 'number') return
  listLoading.value = true
  props
    .moveFunc(oldIndex - 1, newIndex - 1)
    .then(() => {
      message.success('移动成功！')
    })
    .catch(() => {
      message.error('移动失败！')
      handleList(list => {
        list.splice(oldIndex - 1, 0, list.splice(newIndex - 1, 1)[0])
        return list
      })
    })
    .finally(() => {
      listLoading.value = false
    })
}

defineExpose({
  add() {
    const id = `add_${Date.now()}`
    const newItem = { [props.rowKey]: id } as T
    editableData[id] = newItem
    handleList(list => {
      list.push(cloneDeep(newItem))
      return list
    })
    // 滚动到新增行
    nextTick(() => {
      const rows = tableEl.value?.$el.querySelectorAll('.ant-table-row')
      const lastRow: HTMLTableRowElement = rows[rows.length - 1]
      lastRow.scrollIntoView({ behavior: 'smooth', block: 'end' })
    })
  },
  clear() {
    for (let key in editableData) {
      delete editableData[key]
    }
  },
})
</script>

<style scoped>
:deep(.ant-table-measure-row) {
  visibility: collapse;
}
</style>
