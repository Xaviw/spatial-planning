<template>
  <AForm>
    <AFormItem label="名称" help="仅作为标注标识">
      <AInput v-model:value="formModel.name" />
    </AFormItem>

    <AFormItem label="经纬度" v-bind="validateInfos.position">
      <Vector
        v-model="formModel.position"
        :num="2"
        :props="[{ addonBefore: '精度' }, { addonBefore: '纬度' }]"
        direction="vertical"
        gap="8px"
      />
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
      <Upload
        :modelValue="formModel.icon?.image"
        @update:modelValue="onIconUpdate('image', $event)"
        :maxCount="1"
        accept="image/*"
      />
    </AFormItem>

    <AFormItem label="显示尺寸" v-bind="validateInfos['icon.size']">
      <Vector
        :modelValue="formModel.icon?.size"
        :num="2"
        @update:modelValue="onIconUpdate('size', $event)"
        :props="[
          { addonBefore: '宽', addonAfter: '像素', min: 0 },
          { addonBefore: '高', addonAfter: '像素', min: 0 },
        ]"
        direction="vertical"
        gap="8px"
      />
    </AFormItem>

    <AFormItem label="图标偏移量" v-bind="validateInfos['icon.offset']">
      <Vector
        :modelValue="formModel.icon?.offset"
        @update:modelValue="onIconUpdate('offset', $event)"
        :num="2"
        :props="[
          { addonBefore: '横轴', addonAfter: '像素' },
          { addonBefore: '竖轴', addonAfter: '像素' },
        ]"
        direction="vertical"
        gap="8px"
      />
    </AFormItem>

    <AFormItem
      label="图标裁剪大小"
      help="相对于图标原尺寸裁剪，决定了图标显示哪部分"
      v-bind="validateInfos['icon.clipSize']"
    >
      <Vector
        :modelValue="formModel.icon?.clipSize"
        @update:modelValue="onIconUpdate('clipSize', $event)"
        :num="2"
        :props="[
          { addonBefore: '宽', addonAfter: '像素', min: 0 },
          { addonBefore: '高', addonAfter: '像素', min: 0 },
        ]"
        direction="vertical"
        gap="8px"
      />
    </AFormItem>

    <AFormItem label="图标裁剪起点" v-bind="validateInfos['icon.clipOrigin']">
      <Vector
        :modelValue="formModel.icon?.clipOrigin"
        @update:modelValue="onIconUpdate('clipOrigin', $event)"
        :num="2"
        :props="[
          { addonBefore: '横轴', addonAfter: '像素', min: 0 },
          { addonBefore: '竖轴', addonAfter: '像素', min: 0 },
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

    <AFormItem label="文本偏移量" v-bind="validateInfos['text.offset']">
      <Vector
        :modelValue="formModel.text?.offset"
        @update:modelValue="onTextUpdate('offset', $event)"
        :num="2"
        :props="[
          { addonBefore: '横轴', addonAfter: '像素' },
          { addonBefore: '竖轴', addonAfter: '像素' },
        ]"
        direction="vertical"
        gap="8px"
      />
    </AFormItem>

    <AFormItem
      label="文本显示范围"
      help="单独设置文本的缩放等级显示范围"
      v-bind="validateInfos['text.zooms']"
    >
      <Vector
        :modelValue="formModel.text?.zooms"
        @update:modelValue="onTextUpdate('zooms', $event)"
        :num="2"
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
        addonAfter="像素"
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

    <AFormItem label="文本外边距" v-bind="validateInfos['text.style.padding']">
      <Vector
        :modelValue="formModel.text?.style?.padding"
        @update:modelValue="onTextStyleUpdate('padding', $event)"
        :num="4"
        direction="vertical"
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
      extra="默认1"
    >
      <AInputNumber v-model:value="formModel.zIndex" :min="1" :precision="0" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Vector, Upload } from '@sp/shared/components'
import { anchorOptions, directionOptions } from '@sp/shared/helpers/map'
import { vectorValidator } from '@sp/shared/utils'
import { Form } from 'ant-design-vue'
import { ColorPicker } from 'vue3-colorpicker'
import type { LabelMarkerProps } from '#/overlays'
import type { Rule } from 'ant-design-vue/es/form'

function onIconUpdate(key: keyof Required<LabelMarkerProps>['icon'], value) {
  if (!formModel.value.icon) {
    formModel.value.icon = {} as LabelMarkerProps['icon']
  }
  ;(formModel.value.icon![key] as any) = value
}

function onTextUpdate(key: keyof Required<LabelMarkerProps>['text'], value) {
  if (!formModel.value.text) {
    formModel.value.text = {} as LabelMarkerProps['text']
  }
  formModel.value.text![key] = value
}

function onTextStyleUpdate(
  key: keyof Required<Required<LabelMarkerProps>['text']>['style'],
  value,
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

const formModel = ref<LabelMarkerProps>({} as LabelMarkerProps)

const rules = ref<Record<string, Rule[]>>({
  position: [{ validator: vectorValidator }],
  zooms: [{ validator: vectorValidator }],
  'icon.size': [{ validator: vectorValidator }],
  'icon.offset': [{ validator: vectorValidator }],
  'icon.clipSize': [{ validator: vectorValidator }],
  'icon.clipOrigin': [{ validator: vectorValidator }],
  'text.zooms': [{ validator: vectorValidator }],
  'text.offset': [{ validator: vectorValidator }],
  'text.style.padding': [{ validator: vectorValidator }],
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
