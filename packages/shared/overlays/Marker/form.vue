<template>
  <AForm>
    <AFormItem label="提示" help="鼠标悬停时的文字提示">
      <AInput v-model:value="formModel.title" />
    </AFormItem>

    <AFormItem label="内容" help="设置后图标将不再显示" extra="支持HTML字符串">
      <CodeInput
        type="html"
        v-model="formModel.content"
        :style="{ height: '200px' }"
        placeholder='请输入内容，例如：<span style="color: red">内容</span>'
      />
    </AFormItem>

    <AFormItem label="图标">
      <Upload
        :modelValue="formModel.icon?.image"
        @update:modelValue="onIconUpdate($event, 'image')"
        :maxCount="1"
        accept="image/*"
      />
    </AFormItem>

    <AFormItem
      label="图标尺寸"
      help="根据所设置的大小拉伸或压缩图片"
      v-bind="validateInfos['icon.imageSize']"
    >
      <Vector
        :modelValue="formModel.icon?.imageSize"
        @update:modelValue="onIconUpdate($event, 'imageSize')"
        :num="2"
        :props="[
          { addonBefore: '宽', addonAfter: '像素', min: 0 },
          { addonBefore: '高', addonAfter: '像素', min: 0 },
        ]"
        direction="vertical"
        gap="8px"
      />
    </AFormItem>

    <AFormItem
      label="图标显示尺寸"
      help="从左上角开始截取图标的一部分显示"
      v-bind="validateInfos['icon.size']"
    >
      <Vector
        :modelValue="formModel.icon?.size"
        @update:modelValue="onIconUpdate($event, 'size')"
        :num="2"
        :props="[
          { addonBefore: '宽', addonAfter: '像素', min: 0 },
          { addonBefore: '高', addonAfter: '像素', min: 0 },
        ]"
        direction="vertical"
        gap="8px"
      />
    </AFormItem>

    <AFormItem
      label="图标偏移量"
      help="在显示尺寸中以左上角为起点偏移图片，可通过“图标显示尺寸”和“图标偏移量”配合，显示图标的指定范围"
      v-bind="validateInfos['icon.imageOffset']"
    >
      <Vector
        :modelValue="formModel.icon?.imageOffset"
        @update:modelValue="onIconUpdate($event, 'imageOffset')"
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
      label="位置偏移量"
      help="锚点对准经纬度后在横、竖轴上的偏移量"
      v-bind="validateInfos.offset"
    >
      <Vector
        v-model="formModel.offset"
        :num="2"
        :props="[
          { addonBefore: '横轴', addonAfter: '像素' },
          { addonBefore: '竖轴', addonAfter: '像素' },
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
        :min="-360"
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

    <AFormItem
      label="标注偏移量"
      help="以标注方位基准点进行偏移"
      v-bind="validateInfos['label.offset']"
    >
      <Vector
        :modelValue="formModel.label?.offset"
        @update:value="onLabelUpdate($event, 'offset')"
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
      extra="默认12"
    >
      <AInputNumber v-model:value="formModel.zIndex" :min="1" :precision="0" />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { CodeInput, Vector, Upload } from '@sp/shared/components'
import { anchorOptions, directionOptions } from '@sp/shared/helpers/map'
import { vectorValidator } from '@sp/shared/utils'
import { Form } from 'ant-design-vue'
import type { MarkerProps } from '#/overlays'
import type { Rule } from 'ant-design-vue/es/form'

function onLabelUpdate(value: any, key: 'content' | 'direction' | 'offset') {
  if (!formModel.value.label) {
    formModel.value.label = {} as MarkerProps['label']
  }
  formModel.value.label![key] = value
}

function onIconUpdate(
  value: any,
  key: 'size' | 'imageOffset' | 'image' | 'imageSize',
) {
  if (!formModel.value.icon) {
    formModel.value.icon = {} as MarkerProps['icon']
  }
  formModel.value.icon![key] = value
}

const formModel = ref<MarkerProps>({})

const rules = ref<Record<string, Rule[]>>({
  'icon.imageSize': [{ validator: vectorValidator }],
  'icon.size': [{ validator: vectorValidator }],
  'icon.imageOffset': [{ validator: vectorValidator }],
  offset: [{ validator: vectorValidator }],
  'label.offset': [{ validator: vectorValidator }],
  'icon.zooms': [{ validator: vectorValidator }],
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
