<template>
  <AForm>
    <AFormItem
      label="容器高度"
      help="默认“240px”"
      v-bind="validateInfos.height"
    >
      <CssSizeInput v-model="formModel.height" :min="0" />
    </AFormItem>
    <AFormItem
      label="外环半径"
      help="默认“95%”"
      v-bind="validateInfos.outterRadius"
    >
      <AInputNumber
        v-model:value="formModel.outterRadius"
        :min="1"
        :max="100"
        addonAfter="%"
      />
    </AFormItem>
    <AFormItem
      label="内环半径"
      help="设置后显示为环形图"
      v-bind="validateInfos.innerRadius"
    >
      <AInputNumber
        v-model:value="formModel.innerRadius"
        :min="1"
        :max="100"
        addonAfter="%"
      />
    </AFormItem>
    <AFormItem
      label="中心点位于横轴位置"
      help="默认“45%”"
      v-bind="validateInfos.centerX"
    >
      <AInputNumber
        v-model:value="formModel.centerX"
        :min="1"
        :max="100"
        addonAfter="%"
      />
    </AFormItem>
    <AFormItem
      label="中心点位于纵轴位置"
      help="默认“50%”"
      v-bind="validateInfos.centerY"
    >
      <AInputNumber
        v-model:value="formModel.centerY"
        :min="1"
        :max="100"
        addonAfter="%"
      />
    </AFormItem>
    <AFormItem label="南丁格尔图（玫瑰图）" v-bind="validateInfos.enableRose">
      <ASwitch v-model:checked="formModel.enableRose" />
    </AFormItem>
    <AFormItem label="数据" v-bind="validateInfos.data">
      <Editor v-model="formModel.data" ref="editorRef" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Form } from 'ant-design-vue'
import { ref } from 'vue'
import CssSizeInput from '../CssSizeInput/index.vue'
import Editor from './editor.vue'
import type { PieChartProps } from '#/components'
import type { Rule } from 'ant-design-vue/es/form'

const formModel = ref<Partial<PieChartProps>>({
  // height: '240px',
  // outterRadius: 95,
  // centerX: 45,
  // centerY: 50,
  // data: [],
  // enableRose: undefined,
  // innerRadius: undefined,
})
const editorRef = ref<InstanceType<typeof Editor> | null>(null)

const rules = ref<Record<string, Rule[]>>({
  innerRadius: [
    {
      validator(_rule, value) {
        if (value) {
          const outterRadius = formModel.value.outterRadius
          if (
            (outterRadius && value >= outterRadius) ||
            (!outterRadius && value >= 95)
          ) {
            return Promise.reject('内环半径不能大于外环半径！')
          }
        }
        return Promise.resolve()
      },
    },
  ],
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
