<template>
  <AForm>
    <AFormItem label="类型" help="默认“进度条”" v-bind="validateInfos.type">
      <ARadioGroup v-model:value="formModel.type" @change="onTypeChange">
        <ARadio value="line">进度条</ARadio>
        <ARadio value="circle">进度环</ARadio>
        <ARadio value="dashboard">仪表盘</ARadio>
      </ARadioGroup>
    </AFormItem>
    <AFormItem
      label="排列方式"
      help="默认“纵向”排列"
      v-bind="validateInfos.layout"
    >
      <ARadioGroup v-model:value="formModel.layout">
        <ARadio value="vertical">纵向</ARadio>
        <ARadio value="horizontal">横向</ARadio>
      </ARadioGroup>
    </AFormItem>
    <AFormItem
      label="数据模板"
      help="默认“数据%”"
      v-bind="validateInfos.format"
    >
      <Format v-model="formModel.format" />
    </AFormItem>
    <template v-if="formModel.type === 'line'">
      <AFormItem
        label="进度条分段数"
        help="默认不分段"
        v-bind="validateInfos.steps"
      >
        <AInputNumber v-model:value="formModel.steps" :precision="0" />
      </AFormItem>
    </template>
    <template v-if="formModel.type && formModel.type !== 'line'">
      <AFormItem
        label="进度条宽度"
        help="单位为相对于整体尺寸所占百分比，默认“6%”"
        v-bind="validateInfos.strokeWidth"
      >
        <AInputNumber
          v-model:value="formModel.strokeWidth"
          :precision="0"
          :min="1"
          :max="99"
          addonAfter="%"
        />
      </AFormItem>
    </template>
    <template v-if="formModel.type === 'dashboard'">
      <AFormItem
        label="缺口角度"
        help="仪表盘缺口角度，默认“75”度"
        v-bind="validateInfos.gapDegree"
      >
        <AInputNumber
          v-model:value="formModel.gapDegree"
          :precision="0"
          :min="0"
          :max="295"
          addonAfter="度"
        />
      </AFormItem>
      <AFormItem
        label="缺口位置"
        help="仪表盘缺口位置，默认“底部”"
        v-bind="validateInfos.gapPosition"
      >
        <ARadioGroup v-model:value="formModel.gapPosition">
          <ARadio value="top">顶部</ARadio>
          <ARadio value="bottom">底部</ARadio>
          <ARadio value="left">左侧</ARadio>
          <ARadio value="right">右侧</ARadio>
        </ARadioGroup>
      </AFormItem>
    </template>
    <AFormItem
      label="进度条颜色"
      help="默认“蓝色”（#1677ff）"
      v-bind="validateInfos.strokeColor"
    >
      <ColorPicker v-model:pureColor="formModel.strokeColor" />
    </AFormItem>
    <AFormItem
      label="进度条底色"
      help="默认“半透明白色”（#ffffff22）"
      v-bind="validateInfos.trailColor"
    >
      <ColorPicker v-model:pureColor="formModel.trailColor" />
    </AFormItem>
    <AFormItem
      label="尺寸"
      help="类型为进度条时，尺寸是进度条高度，否则尺寸是整体大小"
      v-bind="validateInfos.size"
    >
      <AInputNumber v-model="formModel.size" :min="1" addonAfter="像素" />
    </AFormItem>
    <AFormItem label="数据" v-bind="validateInfos.data">
      <Editor v-model="formModel.data" ref="editorRef" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Form, type RadioChangeEvent } from 'ant-design-vue'
import { ref } from 'vue'
import Editor from './editor.vue'
import type { ProgressProps } from '#/components'
import type { Rule } from 'ant-design-vue/es/form'

const formModel = ref<Partial<ProgressProps>>({
  data: [],
  format: '</>%',
  gapDegree: undefined,
  gapPosition: undefined,
  layout: 'vertical',
  mode: 'percent',
  size: undefined,
  steps: undefined,
  strokeColor: '#1677ff',
  strokeWidth: 6,
  trailColor: '#ffffff22',
  type: 'line',
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

function onTypeChange({ target: { value } }: RadioChangeEvent) {
  if (value === 'line') {
    formModel.value.strokeWidth = undefined
    formModel.value.gapDegree = undefined
    formModel.value.gapPosition = undefined
  } else if (value === 'circle') {
    formModel.value.steps = undefined
    formModel.value.gapDegree = undefined
    formModel.value.gapPosition = undefined
  } else if (value === 'dashboard') {
    formModel.value.steps = undefined
  }
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
