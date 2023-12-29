<template>
  <AForm>
    <AFormItem label="列数量" help="默认“3”列" v-bind="validateInfos.column">
      <AInputNumber v-model:value="formModel.column" :min="1" :precision="0" />
    </AFormItem>

    <AFormItem
      label="标题"
      help="显示在列表顶部的标题"
      v-bind="validateInfos.title"
    >
      <AInput v-model:value="formModel.title" />
    </AFormItem>

    <AFormItem
      label="布局方式"
      help="名称与内容同行或换行显示，默认“同行”"
      v-bind="validateInfos.layout"
    >
      <ARadioGroup v-model:value="formModel.layout">
        <ARadio value="horizontal">同行</ARadio>
        <ARadio value="vertical">换行</ARadio>
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
import type { DescriptionProps } from '#/materials'
import type { Rule } from 'ant-design-vue/es/form'

const formModel = ref<Partial<DescriptionProps>>({
  // colon: true,
  // column: 3,
  // contentStyle: undefined,
  // data: [],
  // labelStyle: undefined,
  // layout: 'horizontal',
  // title: undefined,
})
const editorRef = ref<InstanceType<typeof Editor> | null>(null)

const rules = ref<Record<string, Rule[]>>({
  data: [
    {
      required: true,
      message: '请填写数据！',
      validator(_rule, value) {
        if (value.length) return Promise.resolve()
        return Promise.reject()
      },
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
