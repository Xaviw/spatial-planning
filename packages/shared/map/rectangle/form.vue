<template>
  <AForm>
    <AFormItem label="填充颜色">
      <ColorPicker v-model:pureColor="formModel.fillColor" />
    </AFormItem>

    <AFormItem label="填充透明度">
      <AInputNumber
        v-model:value="formModel.fillOpacity"
        :min="0"
        :max="1"
        :step="0.1"
      />
    </AFormItem>

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

    <AFormItem label="高度" help="大于0时多边形显示为立面体">
      <AInputNumber
        v-model:value="formModel.extrusionHeight"
        :min="0"
        addonAfter="米"
      />
    </AFormItem>

    <AFormItem label="立面体侧面颜色" help="仅“高度”大于0时生效">
      <ColorPicker v-model:pureColor="formModel.wallColor" />
    </AFormItem>

    <AFormItem label="立面体顶面颜色" help="仅“高度”大于0时生效">
      <ColorPicker v-model:pureColor="formModel.roofColor" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Vector } from '@sp/shared/components'
import { Form } from 'ant-design-vue'
import { ColorPicker } from 'vue3-colorpicker'
import type { RectangleProps } from '#/business'

const strokeStyleOptions = [
  { label: '实线', value: 'solid' },
  { label: '虚线', value: 'dashed' },
]

const formModel = ref<RectangleProps>({})

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
