<template>
  <AForm>
    <AFormItem label="标题" v-bind="validateInfos.title">
      <AInput v-model:value="formModel.title" />
    </AFormItem>
    <template v-if="!inModal">
      <AFormItem
        label="详情弹窗内容"
        help="添加内容后，标题组件右侧会显示打开弹窗按钮"
      >
        <AButton @click="openDetail">
          {{ `点击设置（当前包含详情${formModel.modalData?.length || 0}条）` }}
        </AButton>
      </AFormItem>
      <AFormItem label="详情弹窗标题" help="默认“标题名+详情弹窗”">
        <AInput v-model:value="formModel.modalTitle" />
      </AFormItem>
      <AFormItem label="详情弹窗宽度" help="默认“25rem”">
        <CssSizeInput v-model="formModel.modalWidth" />
      </AFormItem>
    </template>
  </AForm>
</template>

<script setup lang="ts">
import { CssSizeInput } from '@sp/shared/components'
import { SiderModalEditor } from '@sp/shared/helper/siderHelper'
import { useModal } from '@sp/shared/hooks'
import { Form } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { h, ref } from 'vue'
import type { TitleProps } from '#/components'
import type { Rule } from 'ant-design-vue/es/form'
import { DetailItem } from '#/request'

withDefaults(
  defineProps<{
    inModal?: boolean
  }>(),
  {
    inModal: false,
  },
)

const formModel = ref<Partial<TitleProps>>({
  // title: undefined,
  // modalData: [],
  // modalTitle: undefined,
  // modalWidth: '25rem',
})

const rules = ref<Record<string, Rule[]>>({
  title: [
    {
      required: true,
      message: '请填写标题！',
    },
  ],
})

const { validateInfos, resetFields, clearValidate, validate, initialModel } =
  Form.useForm(formModel, rules)

const { open, close } = useModal('TitleDetailEditor', {
  keyboard: false,
  maskClosable: false,
})

function openDetail() {
  open(
    h(SiderModalEditor, {
      modalTitle:
        formModel.value.modalTitle || `${formModel.value.title}详情内容`,
      modalData: cloneDeep(formModel.value.modalData),
      modalWidth: formModel.value.modalWidth,
      onConfirm: onDetailConfirm,
      onClose: close,
    }),
  )
}

function onDetailConfirm(list: DetailItem[]) {
  formModel.value.modalData = list
}

defineExpose({
  formModel,
  resetFields,
  clearValidate,
  validate,
  initialModel,
})
</script>
