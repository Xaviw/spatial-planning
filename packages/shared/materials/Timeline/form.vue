<template>
  <AForm>
    <AFormItem
      label="轴位置"
      help="默认显示在“左侧”"
      v-bind="validateInfos.mode"
    >
      <ARadioGroup v-model:value="formModel.mode">
        <ARadio value="left">左侧</ARadio>
        <ARadio value="alternate">左右交替</ARadio>
        <ARadio value="right">右侧</ARadio>
      </ARadioGroup>
    </AFormItem>
    <AFormItem label="数据" v-bind="validateInfos.data">
      <Editor v-model="formModel.data" ref="editorRef" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Form } from 'ant-design-vue'
import Editor from './editor.vue'
import type { TimelineProps } from '#/components'
import type { Rule } from 'ant-design-vue/es/form'

const formModel = ref<Partial<TimelineProps>>({
  // data: []
})
const editorRef = ref<InstanceType<typeof Editor> | null>(null)

const rules = ref<Record<string, Rule[]>>({
  data: [
    {
      required: true,
      message: '请填写数据！',
    },
  ],
})

const { validateInfos, resetFields, clearValidate, validate, initialModel } =
  Form.useForm(formModel, rules)

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
