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
        <Form.Item label="柱条宽度" help="默认自适应宽度" name="barWidth">
          <CssSizeInput v-model:value="item.barWidth" />
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
import { Form, Input } from 'ant-design-vue'
import { ref } from 'vue'
import CssSizeInput from '../CssSizeInput/index.vue'
import DataEditor from './dataEditor.vue'
import type { BarChartItem } from '#/components'

const props = withDefaults(
  defineProps<{
    modelValue?: BarChartItem[]
    xAxis?: string[]
  }>(),
  { modelValue: () => [], xAxis: () => [] },
)

const emits = defineEmits<{
  (e: 'update:modelValue', data: BarChartItem[]): void
}>()

const refs = ref<any[]>([])

const dataValidator = (_rule: any, value: number[]) => {
  if (value?.some((item: number) => !item && item !== 0))
    return Promise.reject()
  return Promise.resolve()
}

function onAdd() {
  emits('update:modelValue', [...props.modelValue, {} as BarChartItem])
}

function onRemove(index: number) {
  const clone = [...props.modelValue]
  clone.splice(index, 1)
  emits('update:modelValue', clone)
}

defineExpose({
  validate() {
    for (const instance of refs.value) {
      instance?.validate()
    }
  },
})
</script>
