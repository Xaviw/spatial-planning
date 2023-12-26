<template>
  <div>
    <h1>图层</h1>
    <div>
      <EditableTable
        :modelValue="modelValue"
        @update:modelValue="
          $emit('update:modelValue', $event as Omit<LayerItem, 'overlays'>[])
        "
        :columns="columns"
        :indexColumn="false"
      >
        <template #bodyCell="{ column, record, text, editableData }">
          <template v-if="column.dataIndex === 'visible'">
            <ATooltip title="显示/隐藏">
              <i
                class="i-ant-design:eye-outlined"
                v-if="!visibleIds.includes(record.id)"
                @click="onVisibleChange('show', record.id)"
              />
              <i
                class="i-ant-design:eye-invisible-outlined"
                v-else
                @click="onVisibleChange('hide', record.id)"
              />
            </ATooltip>
          </template>

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
  </div>
</template>

<script setup lang="ts">
import { EditableTable } from '@sp/shared/components'
import type { LayerItem } from '#/request'
import type { ColumnType } from 'ant-design-vue/es/table'

const props = withDefaults(
  defineProps<{
    modelValue: Omit<LayerItem, 'overlays'>[]
    visibleIds: string[]
  }>(),
  { visibleIds: () => [] },
)

const emits = defineEmits<{
  (e: 'update:modelValue', value: Omit<LayerItem, 'overlays'>[]): void
  (e: 'update:visibleIds', ids: string[]): void
}>()

const columns: ColumnType[] = [
  {
    title: '',
    dataIndex: 'visible',
  },
  {
    title: '名称',
    dataIndex: 'name',
  },
  {
    title: '作为图例',
    dataIndex: 'asLegend',
  },
  {
    title: '图例图片',
    dataIndex: 'legendImg',
  },
  {
    title: '状态',
    dataIndex: 'status',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
  },
]

function onVisibleChange(type: 'show' | 'hide', id: string) {
  if (type === 'show') {
    emits('update:visibleIds', [...props.visibleIds, id])
  } else {
    const current = [...props.visibleIds]
    const index = current.findIndex(item => item === id)
    if (index > -1) {
      current.splice(index, 1)
      emits('update:visibleIds', current)
    }
  }
}
</script>
