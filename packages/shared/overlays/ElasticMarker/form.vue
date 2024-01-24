<template>
  <AForm>
    <AFormItem label="偏移量">
      <Vector
        v-model="formModel.offset"
        :num="2"
        :props="[{ addonBefore: '横轴' }, { addonBefore: '竖轴' }]"
        gap="8px"
      />
    </AFormItem>

    <AFormItem label="图标">
      <Upload
        :modelValue="formModel.styles?.[0]?.icon?.img"
        @update:modelValue="onUpdate('icon', 'img', $event)"
        :maxCount="1"
        accept="image/*"
      />
    </AFormItem>

    <AFormItem label="图标尺寸">
      <Vector
        :modelValue="formModel.styles?.[0]?.icon?.size"
        @update:modelValue="onUpdate('icon', 'size', $event)"
        :num="2"
        :props="[{ addonBefore: '宽' }, { addonBefore: '高' }]"
        gap="8px"
      />
    </AFormItem>

    <AFormItem label="图标锚点">
      <ASelect
        :options="anchorOptions"
        :value="formModel.styles?.[0]?.icon?.anchor"
        @update:value="onUpdate('icon', 'anchor', $event)"
      />
    </AFormItem>

    <AFormItem
      label="图标最合适级别"
      help="在此地图缩放等级下显示为原始大小，地图缩放等级大于此级别时图标将按缩放系数放大，小于此级别时将按缩放系数缩小"
    >
      <AInputNumber
        :value="formModel.styles?.[0]?.icon?.fitZoom"
        @update:value="onUpdate('icon', 'fitZoom', $event)"
        :min="0"
        :max="26"
      />
    </AFormItem>

    <AFormItem label="图标缩放系数" help="地图缩放一级时图标的缩放比例">
      <AInputNumber
        :value="formModel.styles?.[0]?.icon?.scaleFactor"
        @update:value="onUpdate('icon', 'scaleFactor', $event)"
        :min="0"
        :step="0.1"
      />
    </AFormItem>

    <AFormItem label="图标最大放大比例">
      <AInputNumber
        :value="formModel.styles?.[0]?.icon?.maxScale"
        @update:value="onUpdate('icon', 'maxScale', $event)"
        :min="0"
      />
    </AFormItem>

    <AFormItem label="图标最小放大比例">
      <AInputNumber
        :value="formModel.styles?.[0]?.icon?.minScale"
        @update:value="onUpdate('icon', 'minScale', $event)"
        :min="0"
      />
    </AFormItem>

    <AFormItem label="文本内容">
      <ATextarea
        :value="formModel.styles?.[0]?.label?.content"
        @update:value="onUpdate('label', 'content', $event)"
        autoSize
      />
    </AFormItem>

    <AFormItem label="文本位置基准点" help="对齐坐标的基准点">
      <ASelect
        :options="positionOptions"
        :value="formModel.styles?.[0]?.label?.position"
        @update:value="onUpdate('label', 'position', $event)"
      />
    </AFormItem>

    <AFormItem label="文本偏移量">
      <Vector
        :modelValue="formModel.styles?.[0]?.label?.offset"
        :num="2"
        @update:modelValue="onUpdate('label', 'offset', $event)"
        :props="[{ addonBefore: '横轴' }, { addonBefore: '竖轴' }]"
        gap="8px"
      />
    </AFormItem>

    <AFormItem label="文本最小显示级别">
      <AInputNumber
        :value="formModel.styles?.[0]?.label?.minZoom"
        @update:value="onUpdate('label', 'minZoom', $event)"
        :min="0"
        :max="26"
      />
    </AFormItem>

    <AFormItem
      label="层叠顺序"
      help="重叠时层叠顺序高的覆盖物会在上层显示（仅灵活点标记之间有效）"
      extra="默认1"
    >
      <AInputNumber v-model:value="formModel.zIndex" :min="1" :precision="0" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Vector, Upload } from '@sp/shared/components'
import { anchorOptions } from '@sp/shared/helpers/map'
import { Form } from 'ant-design-vue'
import type {
  ElasticMarkerProps,
  ElasticMarkerStyle,
  ElasticMarkerIcon,
  ElasticMarkerLabel,
} from '#/business'

const positionOptions = [
  { label: '左下角', value: 'BL' },
  { label: '底部中央', value: 'BM' },
  { label: '右下角', value: 'BR' },
  { label: '左侧中央', value: 'ML' },
  { label: '右侧中央', value: 'MR' },
  { label: '左上角', value: 'TL' },
  { label: '顶部中央', value: 'TM' },
  { label: '右上角', value: 'TR' },
]

function onUpdate(
  styleKey: keyof ElasticMarkerStyle,
  propKey: keyof ElasticMarkerIcon | keyof ElasticMarkerLabel,
  value,
) {
  if (!formModel.value.styles) {
    formModel.value.styles = [{}]
  }
  if (!formModel.value.styles[0][styleKey]) {
    formModel.value.styles[0][styleKey] = {} as any
  }
  ;(formModel.value.styles[0][styleKey] as any)[propKey] = value
}

const formModel = ref<ElasticMarkerProps>({} as ElasticMarkerProps)

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
