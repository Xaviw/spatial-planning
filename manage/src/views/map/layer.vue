<template>
  <div>
    <div class="flex items-center justify-between px-4 py-2">
      <h1>图层</h1>
      <AButton type="primary" size="middle">新增</AButton>
    </div>
    <EditableTable
      :modelValue="modelValue"
      @update:modelValue="
        $emit('update:modelValue', $event as Omit<LayerItem, 'overlays'>[])
      "
      :columns="columns"
      :indexColumn="false"
      size="small"
    >
      <template #bodyCell="{ column, record, text, editableData }">
        <template v-if="column.dataIndex === 'visible'">
          <ATooltip title="显示/隐藏">
            <i
              class="i-ant-design:eye-outlined cursor-pointer"
              v-if="!visibleIds.includes(record.id)"
              @click="onVisibleChange('show', record.id)"
            />
            <i
              class="i-ant-design:eye-invisible-outlined cursor-pointer"
              v-else
              @click="onVisibleChange('hide', record.id)"
            />
          </ATooltip>
        </template>

        <template v-if="column.dataIndex === 'name'">
          <AInput
            v-if="editableData[record.id]"
            v-model:value="editableData[record.id][column.dataIndex]"
            style="margin: -5px 0; width: '100%;"
          />
          <template v-else>
            {{ text }}
          </template>
        </template>

        <template v-if="column.dataIndex === 'asLegend'">
          <ASwitch
            v-if="editableData[record.id]"
            v-model:checked="editableData[record.id][column.dataIndex]"
            checkedChildren="是"
            unCheckedChildren="否"
          />
          <ASwitch
            v-else
            :checked="text"
            disabled
            checkedChildren="是"
            unCheckedChildren="否"
          />
        </template>

        <template v-if="column.dataIndex === 'legendImg'">
          <AImage :src="text" :fallback="ImageFailed" class="h-12 w-12" />
        </template>

        <template v-if="column.dataIndex === 'status'">
          <ASwitch
            v-if="editableData[record.id]"
            v-model:checked="editableData[record.id][column.dataIndex]"
            checkedChildren="启用"
            unCheckedChildren="禁用"
          />
          <ASwitch
            v-else
            :checked="text"
            disabled
            checkedChildren="启用"
            unCheckedChildren="禁用"
          />
        </template>
      </template>
    </EditableTable>
  </div>
</template>

<script setup lang="ts">
import ImageFailed from '@sp/shared/assets/images/image-failed-filled.png'
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
    fixed: 'left',
    width: 40,
    align: 'center',
  },
  {
    title: '名称',
    dataIndex: 'name',
    fixed: 'left',
    width: 100,
  },
  {
    title: '作为图例',
    dataIndex: 'asLegend',
    width: 80,
    align: 'center',
  },
  {
    title: '图例图片',
    dataIndex: 'legendImg',
    width: 80,
    align: 'center',
  },
  {
    title: '状态',
    dataIndex: 'status',
    width: 80,
    align: 'center',
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    width: 90,
    align: 'center',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    width: 90,
    align: 'center',
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
