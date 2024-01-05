<template>
  <AForm>
    <AFormItem label="提示" help="鼠标悬停时的文字提示">
      <AInput v-model:value="formModel.title" />
    </AFormItem>

    <AFormItem label="内容" help="设置后图标将不再显示" extra="支持HTML字符串">
      <ATextarea allowClear autoSize v-model:value="formModel.content" />
    </AFormItem>

    <AFormItem label="图标">
      <template v-if="!formModel.icon || typeof formModel.icon === 'string'">
        <AInput v-model:value="formModel.icon" />
      </template>
    </AFormItem>

    <AFormItem label="图标尺寸" help="图标宽、高">
      <Vector
        v-model="formModel.size"
        :props="[
          { addonBefore: '宽', addonAfter: 'px', min: 0 },
          { addonBefore: '高', addonAfter: 'px', min: 0 },
        ]"
        direction="vertical"
        gap="8px"
      />
    </AFormItem>

    <AFormItem label="图标偏移量" help="图标在横、竖轴上偏移的位置">
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

    <AFormItem label="锚点位置" help="标记对齐坐标点的位置">
      <ASelect :options="anchorOptions" v-model:value="formModel.anchor" />
    </AFormItem>

    <AFormItem label="旋转角度">
      <AInputNumber
        v-model:value="formModel.angle"
        :min="0"
        :max="360"
        addonAfter="度"
      />
    </AFormItem>

    <AFormItem label="标注内容">
      <AInput
        :value="formModel.label?.content"
        @update:value="onLabelUpdate($event, 'content')"
      />
    </AFormItem>

    <AFormItem label="标注方位">
      <ASelect
        :options="directionOptions"
        :value="formModel.label?.direction"
        @update:value="onLabelUpdate($event, 'direction')"
      />
    </AFormItem>

    <AFormItem label="标注偏移量" help="以标注方位基准点进行偏移">
      <Vector
        :modelValue="formModel.label?.offset"
        @update:value="onLabelUpdate($event, 'offset')"
        :props="[
          { addonBefore: '横轴', addonAfter: 'px', min: 0 },
          { addonBefore: '竖轴', addonAfter: 'px', min: 0 },
        ]"
        direction="vertical"
        gap="8px"
      />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Vector } from '@sp/shared/components'
import { anchorOptions, directionOptions } from '@sp/shared/map'
import { Form } from 'ant-design-vue'
import type { MarkerProps } from '#/business'

function onLabelUpdate(value: any, key: 'content' | 'direction' | 'offset') {
  if (!formModel.value.label) {
    formModel.value.label = {} as MarkerProps['label']
  }
  formModel.value.label![key] = value
}

const formModel = ref<MarkerProps>({})

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
