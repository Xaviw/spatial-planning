<template>
  <AForm>
    <AFormItem label="提示" help="鼠标悬停时的文字提示">
      <AInput v-model:value="formModel.title" />
    </AFormItem>

    <AFormItem label="内容">
      <ATextarea autoSize allowclear v-model:value="formModel.text" />
    </AFormItem>

    <AFormItem label="锚点位置" help="标记对齐坐标点的位置">
      <ASelect :options="anchorOptions" v-model:value="formModel.anchor" />
    </AFormItem>

    <AFormItem
      label="文本偏移量"
      help="横、竖轴上偏移的位置"
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

    <AFormItem label="旋转角度">
      <AInputNumber
        v-model:value="formModel.angle"
        :min="-360"
        :max="360"
        addonAfter="度"
      />
    </AFormItem>

    <AFormItem
      label="文本样式"
      help='JSON格式CSS代码，如：{"background-color":"red"}'
    >
      <CodeInput
        type="json"
        v-model="formModel.style"
        :style="{ height: '200px' }"
        placeholder="请输入样式代码：用英文花括号包裹样式，属性用英文双引号包裹，样式代码间使用英文逗号分隔（最后一条样式后不能有逗号）"
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
import { Vector, CodeInput } from '@sp/shared/components'
import { anchorOptions } from '@sp/shared/helpers/map'
import { vectorValidator } from '@sp/shared/utils'
import { Form } from 'ant-design-vue'
import type { TextProps } from '#/overlays'
import type { Rule } from 'ant-design-vue/es/form'

const formModel = ref<TextProps>({})

const rules = ref<Record<string, Rule[]>>({
  offset: [{ validator: vectorValidator }],
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
