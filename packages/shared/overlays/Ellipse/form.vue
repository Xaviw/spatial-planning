<template>
  <AForm>
    <AFormItem label="填充颜色">
      <ColorPicker v-model:pureColor="formModel.fillColor" disableAlpha />
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
      <ColorPicker v-model:pureColor="formModel.strokeColor" disableAlpha />
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

    <AFormItem
      label="虚线间隙"
      help="仅在线条样式为虚线时生效"
      extra="生成的线条会反复使用传入的值，对应为 [实线,虚线,实线,虚线]。例如 [10,2,10] 表示10个像素的实线和2个像素的空白 + 10个像素的实线和10个像素的空白 （如此反复）"
      v-bind="validateInfos.strokeDasharray"
    >
      <Vector
        v-model="formModel.strokeDasharray"
        :props="[{ addonAfter: '像素', min: 0 }]"
        gap="8px"
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

    <AFormItem
      label="立面体顶面颜色"
      help="仅“高度”大于0时生效，会覆盖填充颜色"
    >
      <ColorPicker v-model:pureColor="formModel.roofColor" />
    </AFormItem>
  </AForm>

  <AFormItem
    label="显示范围"
    help="仅在缩放等级范围内显示"
    extra="可在地图右上角查看缩放等级"
    v-bind="validateInfos.zooms"
  >
    <Vector
      v-model="formModel.zooms"
      :num="2"
      :props="[
        { addonAfter: '-', min: 2, max: 26 },
        { addonAfter: '级', min: 2, max: 26 },
      ]"
    />
  </AFormItem>

  <AFormItem
    label="层叠顺序"
    help="重叠时层叠顺序高的覆盖物会在上层显示"
    extra="默认10"
  >
    <AInputNumber v-model:value="formModel.zIndex" :min="1" :precision="0" />
  </AFormItem>
</template>

<script setup lang="ts">
import { Vector } from '@sp/shared/components'
import { vectorValidator } from '@sp/shared/utils'
import { Form } from 'ant-design-vue'
import { ColorPicker } from 'vue3-colorpicker'
import type { CircleProps } from '#/overlays'
import type { Rule } from 'ant-design-vue/es/form'

const strokeStyleOptions = [
  { label: '实线', value: 'solid' },
  { label: '虚线', value: 'dashed' },
]

const formModel = ref<CircleProps>({})

const rules = ref<Record<string, Rule[]>>({
  strokeDasharray: [{ validator: vectorValidator }],
  zooms: [{ validator: vectorValidator }],
})

const { resetFields, clearValidate, validate, initialModel, validateInfos } =
  Form.useForm(formModel, rules)

defineExpose({
  formModel,
  resetFields,
  clearValidate,
  validate,
  initialModel,
})
</script>
