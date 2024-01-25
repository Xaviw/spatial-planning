<template>
  <AForm>
    <AFormItem label="标题" v-bind="validateInfos.title">
      <AInput v-model:value="formModel.title" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Form } from 'ant-design-vue'
import type { TitleProps } from '#/materials'
import type { Rule } from 'ant-design-vue/es/form'

defineProps<{
  id: string
}>()

const formModel = ref<Partial<TitleProps>>({
  // title: undefined,
})

const rules = ref<Record<string, Rule[]>>({
  title: [
    {
      required: true,
      message: '请填写标题！',
    },
  ],
})

const { validateInfos, resetFields, clearValidate, validate, initialModel } =
  Form.useForm(formModel, rules)

defineExpose({
  formModel,
  resetFields,
  clearValidate,
  validate,
  initialModel,
})
</script>
