<template>
  <AForm>
    <AFormItem label="名称" help="仅作为标注标识">
      <AInput v-model:value="formModel.name" />
    </AFormItem>

    <AFormItem label="透明度">
      <AInputNumber
        v-model:value="formModel.opacity"
        :min="0"
        :max="1"
        :step="0.1"
      />
    </AFormItem>

    <AFormItem
      label="避让优先级"
      help="重叠时优先级高的标注会会避让优先级低的标注，默认1"
    >
      <AInputNumber v-model:value="formModel.rank" :min="0" />
    </AFormItem>

    <AFormItem label="图标">
      <AInput
        :value="formModel.icon?.image"
        @update:value="onIconUpdate('image', $event)"
      />
    </AFormItem>

    <AFormItem label="图标大小">
      <Vector
        :modelValue="formModel.icon?.size"
        @update:modelValue="onIconUpdate('size', $event)"
        :props="[
          { addonBefore: '宽', addonAfter: 'px', min: 0 },
          { addonBefore: '高', addonAfter: 'px', min: 0 },
        ]"
        direction="vertical"
        gap="8px"
      />
    </AFormItem>

    <AFormItem label="图标偏移量">
      <Vector
        :modelValue="formModel.icon?.offset"
        @update:modelValue="onIconUpdate('offset', $event)"
        :props="[
          { addonBefore: '横轴', addonAfter: 'px', min: 0 },
          { addonBefore: '竖轴', addonAfter: 'px', min: 0 },
        ]"
        direction="vertical"
        gap="8px"
      />
    </AFormItem>

    <AFormItem label="图标裁剪起点">
      <Vector
        :modelValue="formModel.icon?.clipOrigin"
        @update:modelValue="onIconUpdate('clipOrigin', $event)"
        :props="[
          { addonBefore: '横轴', addonAfter: 'px', min: 0 },
          { addonBefore: '竖轴', addonAfter: 'px', min: 0 },
        ]"
        direction="vertical"
        gap="8px"
      />
    </AFormItem>

    <AFormItem label="图标裁剪大小">
      <Vector
        :modelValue="formModel.icon?.clipSize"
        @update:modelValue="onIconUpdate('clipSize', $event)"
        :props="[
          { addonBefore: '宽', addonAfter: 'px', min: 0 },
          { addonBefore: '高', addonAfter: 'px', min: 0 },
        ]"
        direction="vertical"
        gap="8px"
      />
    </AFormItem>

    <AFormItem label="锚点位置" help="标记对齐坐标点的位置">
      <ASelect
        :options="anchorOptions"
        :value="formModel.icon?.anchor"
        @update:value="onIconUpdate('anchor', $event)"
      />
    </AFormItem>

    <AFormItem label="文本内容">
      <AInput
        :value="formModel.text?.content"
        @update:value="onTextUpdate('content', $event)"
      />
    </AFormItem>

    <AFormItem label="文本方位">
      <ASelect
        :options="directionOptions"
        :value="formModel.text?.direction"
        @update:value="onTextUpdate('direction', $event)"
      />
    </AFormItem>

    <AFormItem label="文本偏移量">
      <Vector
        :modelValue="formModel.text?.offset"
        @update:modelValue="onTextUpdate('offset', $event)"
        :props="[
          { addonBefore: '横轴', addonAfter: 'px', min: 0 },
          { addonBefore: '竖轴', addonAfter: 'px', min: 0 },
        ]"
        direction="vertical"
        gap="8px"
      />
    </AFormItem>

    <AFormItem label="文本显示范围" help="单独设置文本的缩放等级显示范围">
      <Vector
        :modelValue="formModel.text?.zooms"
        @update:modelValue="onTextUpdate('zooms', $event)"
        :props="[
          { addonAfter: '-', min: 2, max: 26 },
          { addonAfter: '级', min: 2, max: 26 },
        ]"
      />
    </AFormItem>

    <AFormItem label="文本字号">
      <AInputNumber
        :value="formModel.text?.style?.fontSize"
        @update:value="onTextStyleUpdate('fontSize', $event)"
        :min="8"
      />
    </AFormItem>

    <AFormItem label="文本颜色">
      <ColorPicker
        :pureColor="formModel.text?.style?.fillColor"
        @update:pureColor="onTextStyleUpdate('fillColor', $event)"
      />
    </AFormItem>

    <AFormItem label="文本描边颜色">
      <ColorPicker
        :pureColor="formModel.text?.style?.strokeColor"
        @update:pureColor="onTextStyleUpdate('strokeColor', $event)"
      />
    </AFormItem>

    <AFormItem label="文本外边距">
      <Vector
        :modelValue="formModel.text?.style?.padding"
        @update:modelValue="onTextStyleUpdate('padding', $event)"
        :props="[
          { addonBefore: '上', addonAfter: '像素', min: 0 },
          { addonBefore: '右', addonAfter: '像素', min: 0 },
          { addonBefore: '下', addonAfter: '像素', min: 0 },
          { addonBefore: '左', addonAfter: '像素', min: 0 },
        ]"
      />
    </AFormItem>

    <AFormItem label="文本背景颜色">
      <ColorPicker
        :pureColor="formModel.text?.style?.backgroundColor"
        @update:pureColor="onTextStyleUpdate('backgroundColor', $event)"
      />
    </AFormItem>

    <AFormItem label="文本背景描边颜色">
      <ColorPicker
        :pureColor="formModel.text?.style?.borderColor"
        @update:pureColor="onTextStyleUpdate('borderColor', $event)"
      />
    </AFormItem>

    <AFormItem label="文本背景描边宽度">
      <AInputNumber
        :value="formModel.text?.style?.borderWidth"
        @update:value="onTextStyleUpdate('borderWidth', $event)"
        :min="0"
        addonAfter="像素"
      />
    </AFormItem>

    <AFormItem label="文本是否折行">
      <ASwitch
        :checkedValue="formModel.text?.style?.fold"
        @update:checked="onTextStyleUpdate('fold', $event)"
      />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Vector } from '@sp/shared/components'
import { anchorOptions, directionOptions } from '@sp/shared/map'
import { Form } from 'ant-design-vue'
import { ColorPicker } from 'vue3-colorpicker'
import type { LabelMarkerProps } from '#/business'

function onIconUpdate(
  key: keyof Required<LabelMarkerProps>['icon'],
  value: any,
) {
  if (!formModel.value.icon) {
    formModel.value.icon = {} as LabelMarkerProps['icon']
  }
  formModel.value.icon![key] = value
}

function onTextUpdate(
  key: keyof Required<LabelMarkerProps>['text'],
  value: any,
) {
  if (!formModel.value.text) {
    formModel.value.text = {} as LabelMarkerProps['text']
  }
  formModel.value.text![key] = value
}

function onTextStyleUpdate(
  key: keyof Required<Required<LabelMarkerProps>['text']>['style'],
  value: any,
) {
  if (!formModel.value.text) {
    formModel.value.text = {} as LabelMarkerProps['text']
  }
  if (!formModel.value.text?.style) {
    formModel.value.text!.style =
      {} as Required<LabelMarkerProps>['text']['style']
  }
  formModel.value.text!.style![key] = value
}

const formModel = ref<Omit<LabelMarkerProps, 'position'>>({})

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
