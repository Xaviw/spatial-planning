<template>
  <AForm>
    <AFormItem
      label="数据"
      extra="点击左上角进入全屏编辑"
      v-bind="validateInfos.data"
    >
      <div class="overflow-auto" style="max-width: calc(25rem - 60px)">
        <Editor v-model="formModel.data" />
      </div>
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Form } from 'ant-design-vue'
import Editor from './editor.vue'
import type { TableProps } from '#/components'
import type { Rule } from 'ant-design-vue/es/form'

const formModel = ref<Partial<TableProps>>({
  // data: []
})

const rules = ref<Record<string, Rule[]>>({
  data: [
    {
      required: true,
      message: '请填写数据！',
      validator(_rule, value) {
        if (
          !value.length ||
          !value[0].length ||
          !value[0].every((item: string) => !!item)
        )
          return Promise.reject()
        return Promise.resolve()
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
  validate,
  initialModel,
})
</script>
