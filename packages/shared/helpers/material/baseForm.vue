<template>
  <AForm>
    <AFormItem :style="{ display: 'none' }">
      <AInput v-model:value="formModel.id" />
    </AFormItem>

    <AFormItem label="创建时间">
      <AInput v-model:value="formModel.createTime" disabled />
    </AFormItem>

    <AFormItem label="更新时间">
      <AInput v-model:value="formModel.updateTime" disabled />
    </AFormItem>

    <AFormItem label="组件类型" v-bind="validateInfos.type">
      <ASelect
        disabled
        :options="materialTypes"
        v-model:value="formModel.type"
      />
    </AFormItem>

    <AFormItem label="组件状态" v-bind="validateInfos.status">
      <ASwitch
        v-model:checked="formModel.status"
        checkedChildren="启用"
        unCheckedChildren="禁用"
      />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { materialTypes } from '@sp/shared/helpers/material'
import { Form } from 'ant-design-vue'
import type { SiderItem } from '#/business'
import type { Rule } from 'ant-design-vue/es/form'

const formModel = ref<SiderItem>({
  // type: undefined,
  // status: true,
} as SiderItem)

const baseRules: Record<string, Rule[]> = {
  type: [
    {
      required: true,
      message: '请选择组件类型！',
    },
  ],
  status: [
    {
      required: true,
      message: '请选择组件状态！',
    },
  ],
}

const { validateInfos, resetFields, validate, clearValidate, initialModel } =
  Form.useForm(formModel, baseRules)

defineExpose({
  formModel,
  resetFields,
  validate,
  clearValidate,
  initialModel,
})
</script>
