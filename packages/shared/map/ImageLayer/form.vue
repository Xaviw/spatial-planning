<template>
  <AForm>
    <AFormItem label="图片链接" v-bind="validateInfos.url">
      <AInput v-model:value="formModel.url" />
    </AFormItem>

    <AFormItem label="图层透明度">
      <AInputNumber
        v-model:value="formModel.opacity"
        :min="0"
        :max="1"
        :step="0.1"
      />
    </AFormItem>

    <AFormItem
      label="显示范围"
      help="仅在缩放等级范围内显示"
      extra="可在地图右上角查看缩放等级"
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
      extra="默认6"
    >
      <AInputNumber v-model:value="formModel.zIndex" :min="1" :precision="0" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Vector } from '@sp/shared/components'
import { Form } from 'ant-design-vue'
import { Rule } from 'ant-design-vue/es/form'
import type { AMap } from '@amap/amap-jsapi-types'

const formModel = ref<AMap.ImageLayerOptions>({} as AMap.ImageLayerOptions)

const rules = ref<Record<string, Rule[]>>({
  url: [{ required: true, message: '请上传图片！' }],
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
