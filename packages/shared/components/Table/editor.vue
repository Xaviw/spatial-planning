<template>
  <ATable
    bordered
    size="small"
    :pagination="false"
    :columns="columns"
    :dataSource="data"
    ref="tableEl"
  >
    <template #headerCell="{ column }">
      <template v-if="column.dataIndex === 'index'">
        <ATooltip v-if="isFullscreen" title="点击退出全屏" placement="bottom">
          <i
            class="i-ant-design:fullscreen-exit-outlined cursor-pointer text-sm"
            @click="exit"
          />
        </ATooltip>
        <ATooltip v-else title="点击进入全屏">
          <i
            class="i-ant-design:fullscreen-outlined cursor-pointer text-sm"
            @click="enter"
          />
        </ATooltip>
      </template>
      <template v-else-if="column.dataIndex === 'action'">
        <AButton size="small" @click="addColumn">
          <i class="i-ant-design:plus-outlined" />
        </AButton>
      </template>
      <template v-else>
        <AInput
          v-model:value="tableData[0][column.dataIndex as number]"
          size="small"
          class="min-w-20"
        >
          <template #addonAfter v-if="columns.length > 3">
            <i
              class="i-ant-design:close-outlined cursor-pointer text-sm text-red"
              @click="removeColumn(column.dataIndex as number)"
            />
          </template>
        </AInput>
      </template>
    </template>

    <template #bodyCell="{ column, index }">
      <template v-if="column.dataIndex === 'index'">
        <span class="text-gray">{{ index + 1 }}</span>
      </template>
      <template v-else-if="column.dataIndex === 'action'">
        <AButton v-if="data.length - 1 === index" @click="addRow">
          <template #icon>
            <i class="i-ant-design:plus-outlined" />
          </template>
        </AButton>
        <AButton v-else @click="removeRow(index + 1)">
          <template #icon>
            <i class="i-ant-design:close-outlined text-red" />
          </template>
        </AButton>
      </template>
      <template v-else>
        <AInput
          size="small"
          v-model:value="tableData[index + 1][column.dataIndex as number]"
        />
      </template>
    </template>
  </ATable>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import { computed, ref, watchEffect } from 'vue'
import type { VueInstance } from '@vueuse/core'
import type { ColumnType } from 'ant-design-vue/es/table'

type HeaderColumn = ColumnType & { name?: string }

const props = withDefaults(defineProps<{ modelValue?: string[][] }>(), {
  modelValue: () => [],
})

defineEmits<{ (e: 'update:modelValue', newData: string[][]): void }>()

const tableData = ref<string[][]>([])

watchEffect(() => {
  if (props.modelValue.length) {
    tableData.value = props.modelValue
  }
})

const columns = computed<HeaderColumn[]>(() => [
  { dataIndex: 'index' },
  ...(props.modelValue[0] || []).map((item: string, index: number) => ({
    dataIndex: index,
    name: item,
  })),
  { dataIndex: 'action' },
])

const data = computed<Recordable[]>(() => tableData.value.slice(1))

const tableEl = ref<VueInstance | null>(null)

const { isFullscreen, enter, exit } = useFullscreen(tableEl)

function addColumn() {
  tableData.value.forEach(item => {
    item.push('')
  })
}

function removeColumn(dataIndex: number) {
  tableData.value.forEach(item => {
    item.splice(dataIndex, 1)
  })
}

function addRow() {
  tableData.value.push([])
}

function removeRow(index: number) {
  tableData.value.splice(index, 1)
}
</script>
