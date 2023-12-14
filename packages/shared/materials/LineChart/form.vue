<template>
  <AForm>
    <Form.Item
      label="容器高度"
      help="默认“240px”"
      v-bind="validateInfos.height"
    >
      <CssSizeInput v-model="formModel.height" :min="0" />
    </Form.Item>
    <Form.Item label="数据项" v-bind="validateInfos.xAxis">
      <DataEditor
        type="string"
        v-model="formModel.xAxis"
        @remove="onRemove"
        @add="onAdd"
      />
    </Form.Item>
    <Form.Item label="数据" v-bind="validateInfos.series">
      <Editor
        v-model="formModel.series"
        :xAxis="formModel.xAxis"
        ref="editorRef"
      />
    </Form.Item>
  </AForm>
</template>

<script setup lang="ts">
import { CssSizeInput } from '@sp/shared/components'
import { Form } from 'ant-design-vue'
import DataEditor from './dataEditor.vue'
import Editor from './editor.vue'
import type { BarChartItem, LineChartProps } from '#/components'
import type { Rule } from 'ant-design-vue/es/form'

const formModel = ref<Partial<LineChartProps>>({
  // height: '240px',
  // series: [],
  // xAxis: [],
})
const editorRef = ref<InstanceType<typeof Editor> | null>(null)

const rules = ref<Record<string, Rule[]>>({
  xAxis: [
    {
      required: true,
      message: '请将数据项补充完整！',
      validator(_rule, value) {
        if (value?.some((item: string) => !item)) return Promise.reject()
        return Promise.resolve()
      },
    },
  ],
  series: [
    {
      required: true,
      message: '请填写数据！',
    },
  ],
})

const { validateInfos, resetFields, clearValidate, validate, initialModel } =
  Form.useForm(formModel, rules)

function onRemove(index: number) {
  formModel.value.series!.forEach((item: BarChartItem) =>
    item.data.splice(index, 1),
  )
}

function onAdd() {
  formModel.value.series!.forEach((item: BarChartItem) => item.data.push(0))
}

defineExpose({
  formModel,
  resetFields,
  clearValidate,
  validate: async () => {
    if (!editorRef.value) throw new Error('没有获取到editor')
    return Promise.all([editorRef.value!.validate(), validate()])
  },
  initialModel,
})
</script>
