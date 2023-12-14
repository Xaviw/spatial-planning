<template>
  <ATable
    size="small"
    :pagination="false"
    :showHeader="false"
    :columns="columns"
    :dataSource="dataSource"
    :rowClassName="rowClassName"
  />
</template>

<script setup lang="ts">
import type { TableProps } from '#/components'
import type { ColumnsType } from 'ant-design-vue/es/table'

const props = withDefaults(defineProps<TableProps>(), {
  data: () => [],
})

const columns = computed<ColumnsType>(() => {
  return props.data[0]?.map((item, index) => ({
    title: item,
    dataIndex: `column${index}`,
    align: 'center',
  }))
})

const dataSource = computed(() => {
  return props.data.map(row => {
    const rowData: Recordable = {}
    row.forEach((item, index) => {
      rowData[`column${index}`] = item
    })
    return rowData
  })
})

const rowClassName = (_: Recordable, index: number) =>
  index === 0 ? 'table-head' : index % 2 === 1 ? 'table-odd' : 'table-even'
</script>

<style scoped>
:deep(.ant-table) {
  background: transparent !important;
  color: #fff !important;
}

:deep(.ant-table-row > td) {
  border: none !important;
}

:deep(.ant-table-cell-row-hover) {
  background-color: rgb(3, 135, 206) !important;
}

:global(.table-head) {
  background-color: rgba(3, 135, 206, 0.5);
  font-weight: bold;
}

:global(.table-odd) {
  background-color: rgba(3, 149, 206, 0.2);
}

:global(.table-even) {
  background-color: rgba(3, 157, 206, 0.1);
}
</style>
