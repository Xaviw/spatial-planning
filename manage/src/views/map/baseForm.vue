<template>
  <AForm>
    <AFormItem :style="{ display: 'none' }">
      <AInput v-model:value="formModel.id" />
    </AFormItem>

    <AFormItem label="名称" v-bind="validateInfos.name">
      <AInput v-model:value="formModel.name" />
    </AFormItem>

    <AFormItem label="所属图层" v-bind="validateInfos.layerId">
      <ASelect v-model:value="formModel.layerId" :options="layers" />
    </AFormItem>

    <AFormItem label="覆盖物类型">
      <ASelect
        disabled
        v-model:value="formModel.type"
        :options="overlayOptions"
      />
    </AFormItem>

    <AFormItem label="组件状态" v-bind="validateInfos.status">
      <ASwitch
        v-model:checked="formModel.status"
        checkedChildren="启用"
        unCheckedChildren="禁用"
      />
    </AFormItem>

    <AFormItem label="创建时间">
      <AInput v-model:value="formModel.createTime" disabled />
    </AFormItem>

    <AFormItem label="更新时间">
      <AInput v-model:value="formModel.updateTime" disabled />
    </AFormItem>

    <AFormItem label="详情弹窗内容" help="添加内容后，单击覆盖物可以打开弹窗">
      <AButton @click="openDetail">
        {{ `点击设置（当前包含详情${formModel.details?.length || 0}条）` }}
      </AButton>
    </AFormItem>

    <AFormItem label="详情弹窗标题" help="默认“标题名+详情弹窗”">
      <AInput v-model:value="formModel.detailTitle" />
    </AFormItem>

    <AFormItem label="详情弹窗宽度" help="默认“25rem”">
      <CssSizeInput v-model="formModel.detailWidth" />
    </AFormItem>

    <AFormItem
      label="显示范围"
      help="仅在缩放等级范围内显示"
      extra="可在地图右上角查看缩放等级"
    >
      <Vector
        :modelValue="formModel.props?.zooms"
        @update:modelValue="onZoomsUpdate"
        :props="[
          { addonAfter: '-', min: 2, max: 26 },
          { addonAfter: '级', min: 2, max: 26 },
        ]"
      />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { CssSizeInput, Vector } from '@sp/shared/components'
import { SiderModalEditor } from '@sp/shared/helper/siderHelper'
import { useModal } from '@sp/shared/hooks'
import { overlayOptions, useMapStore } from '@sp/shared/map'
import { Form } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import type { MaterialItem, OverlayItem, OverlayType } from '#/business'
import type { Rule } from 'ant-design-vue/es/form'

const { layers } = storeToRefs(useMapStore())

const formModel = ref({} as OverlayItem<OverlayType>)

const rules = ref<Record<string, Rule[]>>({
  name: [
    {
      required: true,
      message: '请输入覆盖物名称！',
    },
  ],
  layerId: [
    {
      required: true,
      message: '请选择所属图层！',
    },
  ],
  status: [
    {
      required: true,
      message: '请选择组件状态！',
    },
  ],
})

const { validateInfos, resetFields, validate, clearValidate, initialModel } =
  Form.useForm(formModel, rules)

function onZoomsUpdate(zooms: any[]) {
  if (!formModel.value.props) {
    formModel.value.props = {}
  }
  formModel.value.props.zooms = zooms as [number, number]
}

const { open, close } = useModal('OverlayDetailEditor', {
  keyboard: false,
  maskClosable: false,
})

function openDetail() {
  open(
    h(SiderModalEditor, {
      id: formModel.value.id!,
      modalTitle:
        formModel.value.detailTitle || `${formModel.value.name}详情内容`,
      modalData: cloneDeep(formModel.value.details!),
      modalWidth: formModel.value.detailWidth!,
      onConfirm: onDetailConfirm,
      onClose: close,
    }),
  )
}

function onDetailConfirm(list: MaterialItem[]) {
  formModel.value.details = list
}

defineExpose({
  formModel,
  resetFields,
  validate,
  clearValidate,
  initialModel,
})
</script>
