<template>
  <AForm>
    <AFormItem label="提示" help="鼠标悬停时的文字提示">
      <AInput v-model:value="formModel.title" />
    </AFormItem>

    <AFormItem label="内容">
      <ATextarea allowClear autoSize v-model:value="formModel.text" />
    </AFormItem>

    <AFormItem label="锚点位置" help="标记对齐坐标点的位置">
      <ASelect :options="anchorOptions" v-model:value="formModel.anchor" />
    </AFormItem>

    <AFormItem label="图标偏移量" help="横、竖轴上偏移的位置">
      <Vector
        v-model="formModel.offset"
        :props="[
          { addonBefore: '横轴', addonAfter: 'px', min: 0 },
          { addonBefore: '竖轴', addonAfter: 'px', min: 0 },
        ]"
        direction="vertical"
        gap="8px"
      />
    </AFormItem>

    <AFormItem label="旋转角度">
      <AInputNumber
        v-model:value="formModel.angle"
        :min="0"
        :max="360"
        addonAfter="度"
      />
    </AFormItem>

    <AFormItem
      label="文本样式"
      help="CSS代码，如：“{'background-color':'red'}”"
    >
      <ATextarea v-model:value="formModel.style" />
    </AFormItem>

    <AFormItem
      label="显示范围"
      help="仅在缩放等级范围内显示"
      extra="可在地图右上角查看缩放等级"
    >
      <Vector
        v-model="formModel.zooms"
        :props="[
          { addonAfter: '-', min: 2, max: 26 },
          { addonAfter: '级', min: 2, max: 26 },
        ]"
      />
    </AFormItem>

    <AFormItem
      label="层叠顺序"
      help="重叠时层叠顺序高的覆盖物会在上层显示"
      extra="默认12"
    >
      <AInputNumber v-model:value="formModel.zIndex" :min="1" :precision="0" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Vector } from '@sp/shared/components'
import { anchorOptions } from '@sp/shared/map'
import { Form } from 'ant-design-vue'
import type { TextProps } from '#/business'

const formModel = ref<TextProps>({})

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
