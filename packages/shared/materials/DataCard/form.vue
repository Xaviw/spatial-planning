<template>
  <AForm>
    <AFormItem label="名称" v-bind="validateInfos.title">
      <AInput v-model:value="formModel.title" />
    </AFormItem>
    <AFormItem label="数据" v-bind="validateInfos.content">
      <AInput v-model:value="formModel.content" />
    </AFormItem>
    <AFormItem label="图片" v-bind="validateInfos.img">
      <AInput v-model:value="formModel.img" />
    </AFormItem>
    <AFormItem
      label="支持预览"
      help="默认支持"
      v-bind="validateInfos.imgPreview"
    >
      <ASwitch
        v-model:checked="formModel.imgPreview"
        checkedChildren="是"
        unCheckedChildren="否"
      />
    </AFormItem>
    <AFormItem
      label="图片宽度"
      help="默认“36px”"
      v-bind="validateInfos.imgWidth"
    >
      <CssSizeInput v-model="formModel.imgWidth" :max="48" :min="20" />
    </AFormItem>
    <AFormItem
      label="图片高度"
      help="默认“36px”"
      v-bind="validateInfos.imgHeight"
    >
      <CssSizeInput v-model="formModel.imgHeight" :max="48" :min="20" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { CssSizeInput } from '@sp/shared/components'
import { Form } from 'ant-design-vue'
import type { DataCardProps } from '#/materials'
import type { Rule } from 'ant-design-vue/es/form'

const formModel = ref<Partial<DataCardProps>>({
  // imgPreview: true,
  // imgWidth: '36px',
  // imgHeight: '36px',
  // content: undefined,
  // img: undefined,
  // title: undefined,
})

const rules = ref<Record<string, Rule[]>>({
  title: [
    {
      required: true,
      message: '请填写名称！',
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
