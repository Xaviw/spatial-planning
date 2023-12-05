<template>
  <Form
    v-for="(item, index) of modelValue"
    :model="item"
    :key="index"
    class="mb-2"
    :ref="el => refs.push(el)"
  >
    <div class="editor-block">
      <div class="mr-4 flex-1">
        <Form.Item
          label="名称"
          name="name"
          :rules="{ required: true, message: '请填写名称！' }"
        >
          <Input v-model:value="item.name" />
        </Form.Item>
        <Form.Item label="平滑折线" help="默认不启用" name="smooth">
          <Switch v-model:checked="item.smooth" />
        </Form.Item>
        <Form.Item label="堆叠面积" help="默认不启用" name="stack">
          <Switch v-model:checked="item.stack" />
        </Form.Item>
        <Form.Item
          label="数据"
          name="data"
          :rules="{
            required: true,
            message: '请将数据补充完整！',
            validator: dataValidator,
          }"
        >
          <DataEditor type="number" v-model="item.data" :xAxis="xAxis" />
        </Form.Item>
      </div>
      <Form.Item>
        <div
          class="editor-btn"
          v-if="index === modelValue.length - 1"
          @click="onAdd"
        >
          <i class="i-ant-design:plus-outlined" />
        </div>
        <div @click="onRemove(index)" v-else class="editor-btn">
          <i class="i-ant-design:close-outlined text-red" />
        </div>
      </Form.Item>
    </div>
  </Form>
</template>

<script setup lang="ts">
import { Form, Input, Switch } from 'ant-design-vue'
import { ref } from 'vue'
import DataEditor from './dataEditor.vue'
import type { LineChartItem } from '#/components'

const props = withDefaults(
  defineProps<{
    modelValue?: LineChartItem[]
    xAxis?: string[]
  }>(),
  { modelValue: () => [], xAxis: () => [] },
)

const emits = defineEmits<{
  (e: 'update:modelValue', data: LineChartItem[]): void
}>()

const refs = ref<any[]>([])

const dataValidator = (_rule: any, value: number[]) => {
  if (value?.some((item: number) => !item && item !== 0))
    return Promise.reject()
  return Promise.resolve()
}

function onAdd() {
  emits('update:modelValue', [...props.modelValue, {} as LineChartItem])
}

function onRemove(index: number) {
  const clone = [...props.modelValue]
  clone.splice(index, 1)
  emits('update:modelValue', clone)
}

defineExpose({
  validate() {
    const events: Promise<any>[] = []
    for (const instance of refs.value) {
      if (typeof instance.validate === 'function') {
        events.push(instance.validate())
      }
    }
    return Promise.all(events)
  },
})
</script>
