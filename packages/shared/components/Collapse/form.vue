<template>
  <AForm>
    <AFormItem label="标题" v-bind="validateInfos.title">
      <AInput v-model:value="formModel.title" />
    </AFormItem>
    <AFormItem label="内容" v-bind="validateInfos.content">
      <Editor v-model="formModel.content" ref="editorRef" />
    </AFormItem>
    <AFormItem
      label="默认展开"
      help="不设置时，初始默认“折叠”"
      v-bind="validateInfos.defaultOpen"
    >
      <ASwitch
        v-model:checked="formModel.defaultOpen"
        checkedChildren="展开"
        unCheckedChildren="折叠"
      />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Form } from 'ant-design-vue'
import { ref } from 'vue'
import Editor from './editor.vue'
import type { CollapseProps } from '#/components'
import type { Rule } from 'ant-design-vue/es/form'

const editorRef = ref<InstanceType<typeof Editor> | null>(null)
const formModel = ref<Partial<CollapseProps>>({
  content: undefined,
  defaultOpen: false,
  title: undefined,
})

const rules = ref<Record<string, Rule[]>>({
  title: [
    {
      required: true,
      message: '请填写标题！',
    },
  ],
  content: [
    {
      required: true,
      message: '请填写内容！',
      validator(_rule, value) {
        if (typeof editorRef.value?.validate === 'function') {
          return editorRef.value.validate()
        }
        return value === '<p><br></p>' ? Promise.reject() : Promise.resolve()
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
