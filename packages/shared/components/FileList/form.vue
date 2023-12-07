<template>
  <AForm>
    <AFormItem label="列数" help="默认“4”列" v-bind="validateInfos.columns">
      <AInputNumber v-model:value="formModel.columns" :min="1" :precision="0" />
    </AFormItem>
    <AFormItem label="间隔" help="默认“8px”" v-bind="validateInfos.gap">
      <CssSizeInput v-model="formModel.gap" />
    </AFormItem>
    <AFormItem label="文件列表" v-bind="validateInfos.data">
      <Editor v-model="formModel.data" ref="editorRef" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Form } from 'ant-design-vue'
import { ref } from 'vue'
import CssSizeInput from '../CssSizeInput/index.vue'
import Editor from './editor.vue'
import type { FileListProps } from '#/components'
import type { Rule } from 'ant-design-vue/es/form'

const formModel = ref<Partial<FileListProps>>({
  // columns: 4,
  // gap: '8px',
  // data: [],
})
const editorRef = ref<InstanceType<typeof Editor> | null>(null)

const rules = ref<Record<string, Rule[]>>({
  data: [
    {
      required: true,
      message: '请上传文件！',
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
