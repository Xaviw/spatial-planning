<template>
  <AForm>
    <AFormItem label="线条颜色">
      <ColorPicker v-model:pureColor="formModel.strokeColor" />
    </AFormItem>

    <AFormItem label="线条透明度">
      <AInputNumber
        v-model:value="formModel.strokeOpacity"
        :min="0"
        :max="1"
        :step="0.1"
      />
    </AFormItem>

    <AFormItem label="线条宽度">
      <AInputNumber
        v-model:value="formModel.strokeWeight"
        :min="1"
        addonAfter="像素"
      />
    </AFormItem>

    <AFormItem label="线条样式">
      <ASelect
        :options="strokeStyleOptions"
        v-model:value="formModel.strokeStyle"
      />
    </AFormItem>

    <AFormItem label="虚线间隙" help="仅在线条样式为虚线时生效">
      <Vector
        v-model="formModel.strokeDasharray"
        :props="[
          { addonAfter: '像素', min: 0 },
          { addonAfter: '像素', min: 0 },
        ]"
      />
    </AFormItem>

    <AFormItem label="是否描边">
      <ASwitch v-model:checked="formModel.isOutline" />
    </AFormItem>

    <AFormItem label="描边宽度">
      <AInputNumber
        v-model:value="formModel.borderWeight"
        :min="1"
        addonAfter="像素"
      />
    </AFormItem>

    <AFormItem label="描边颜色">
      <ColorPicker v-model:pureColor="formModel.outlineColor" />
    </AFormItem>

    <AFormItem label="拐点样式">
      <ASelect :options="lineJoinOptions" v-model:value="formModel.lineJoin" />
    </AFormItem>

    <AFormItem label="两端样式">
      <ASelect :options="lineCapOptions" v-model:value="formModel.lineCap" />
    </AFormItem>

    <AFormItem label="是否绘成大地线">
      <ASwitch v-model:checked="formModel.geodesic" />
    </AFormItem>

    <AFormItem label="是否显示方向箭头" help="建议线条宽度大于6时使用">
      <ASwitch v-model:checked="formModel.showDir" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Vector } from '@sp/shared/components'
import { Form } from 'ant-design-vue'
import { ColorPicker } from 'vue3-colorpicker'
import type { PolylineProps } from '#/business'

const strokeStyleOptions = [
  { label: '实线', value: 'solid' },
  { label: '虚线', value: 'dashed' },
]

const lineJoinOptions = [
  { label: '尖角', value: 'miter' },
  { label: '圆角', value: 'round' },
  { label: '斜角', value: 'bevel' },
]

const lineCapOptions = [
  { label: '无头', value: 'butt' },
  { label: '圆头', value: 'round' },
  { label: '方头', value: 'square' },
]

const formModel = ref<PolylineProps>({})

const { resetFields, clearValidate, validate, initialModel } =
  Form.useForm(formModel)

defineExpose({
  formModel,
  resetFields,
  clearValidate,
  validate,
  initialModel,
})
</script>
