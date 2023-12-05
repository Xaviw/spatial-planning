<template>
  <AForm>
    <AFormItem label="自动切换" help="默认开启" v-bind="validateInfos.autoplay">
      <ASwitch v-model:checked="formModel.autoplay" />
    </AFormItem>
    <AFormItem label="显示指示点" help="默认显示" v-bind="validateInfos.dots">
      <ASwitch v-model:checked="formModel.dots" />
    </AFormItem>
    <AFormItem
      label="指示点位置"
      help="默认“底部”"
      v-bind="validateInfos.dotPosition"
    >
      <ARadioGroup v-model:value="formModel.dotPosition">
        <ARadio value="top">顶部</ARadio>
        <ARadio value="bottom">底部</ARadio>
        <ARadio value="left">左侧</ARadio>
        <ARadio value="right">右侧</ARadio>
      </ARadioGroup>
    </AFormItem>
    <AFormItem
      label="组件高度"
      help="各图片高度差距过大时定义，可以避免切换到短图时底部留白"
      v-bind="validateInfos.height"
    >
      <CssSizeInput v-model="formModel.height" />
    </AFormItem>
    <AFormItem label="图片" v-bind="validateInfos.data">
      <AUpload />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Form } from 'ant-design-vue'
import { ref } from 'vue'
import CssSizeInput from '../CssSizeInput/index.vue'
import type { CarouselProps } from '#/components'
import type { Rule } from 'ant-design-vue/es/form'

const formModel = ref<Partial<CarouselProps>>({
  autoplay: true,
  dots: true,
  dotPosition: 'bottom',
  data: [],
  height: undefined,
})

const rules = ref<Record<string, Rule[]>>({
  data: [
    {
      required: true,
      message: '请上传图片！',
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
