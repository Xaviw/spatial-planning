<template>
  <Table
    bordered
    size="small"
    :pagination="false"
    :columns="columns"
    :dataSource="data"
    ref="tableEl"
  >
    <template #headerCell="{ column }">
      <template v-if="column.dataIndex === 'index'">
        <Tooltip v-if="isFullscreen" title="点击退出全屏" placement="bottom">
          <i
            class="i-ant-design:fullscreen-exit-outlined cursor-pointer text-sm"
            @click="exit"
          />
        </Tooltip>
        <Tooltip v-else title="点击进入全屏">
          <i
            class="i-ant-design:fullscreen-outlined cursor-pointer text-sm"
            @click="enter"
          />
        </Tooltip>
      </template>
      <template v-else-if="column.dataIndex === 'action'">
        <Button size="small" @click="addColumn">
          <i class="i-ant-design:plus-outlined" />
        </Button>
      </template>
      <template v-else>
        <Input
          v-model:value="(column as any).name"
          size="small"
          class="min-w-20"
        >
          <template #addonAfter v-if="columns.length > 3">
            <i
              class="i-ant-design:close-outlined cursor-pointer text-sm text-red"
              @click="removeColumn(column.dataIndex as string)"
            />
          </template>
        </Input>
      </template>
    </template>

    <template #bodyCell="{ column, index, record }">
      <template v-if="column.dataIndex === 'index'">
        <span class="text-gray">{{ index + 1 }}</span>
      </template>
      <template v-else-if="column.dataIndex === 'action'">
        <Button v-if="data.length - 1 === index" @click="addRow">
          <template #icon>
            <i class="i-ant-design:plus-outlined" />
          </template>
        </Button>
        <Button v-else @click="removeRow(index)">
          <template #icon>
            <i class="i-ant-design:close-outlined text-red" />
          </template>
        </Button>
      </template>
      <template v-else>
        <Input v-model:value="record[column.dataIndex as string]" />
      </template>
    </template>
  </Table>
</template>

<script setup lang="ts">
import { useFullscreen } from '@vueuse/core'
import { Button, Input, Table, Tooltip } from 'ant-design-vue'
import { ref } from 'vue'
import type { ColumnType } from 'ant-design-vue/es/table'

type HeaderColumn = ColumnType & { name?: string }

const props = withDefaults(defineProps<{ modelValue?: string[][] }>(), {
  modelValue: () => [],
})

defineEmits<{ (e: 'update:modelValue', newData: string[][]): void }>()

const columns = ref<HeaderColumn[]>([
  { dataIndex: 'index' },
  ...(props.modelValue[0] || []).map((item: string, index: number) => ({
    dataIndex: index + 1,
    name: item,
  })),
  { dataIndex: 'action' },
])

const data = ref<Recordable[]>(
  props.modelValue.slice(1).map((item: string[]) => {
    return item.reduce((p, c, i) => {
      p[i + 1] = c
      return p
    }, {} as Recordable)
  }),
)

const flagKey = ref<number>(columns.value.length)

const tableEl = ref<HTMLElement | null>(null)

const { isFullscreen, enter, exit } = useFullscreen(tableEl)

function addColumn() {
  flagKey.value++
  const index = columns.value.length - 1
  columns.value.splice(index, 0, {
    dataIndex: flagKey.value,
    name: `列${index}`,
  })
}

function removeColumn(dataIndex: string) {
  const index = columns.value.findIndex(item => item.dataIndex === dataIndex)
  columns.value.splice(index, 1)
}

function addRow() {
  data.value.push({})
}

function removeRow(index: number) {
  data.value.splice(index, 1)
}
</script>
