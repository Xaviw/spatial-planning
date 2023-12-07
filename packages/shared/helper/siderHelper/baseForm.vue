<template>
  <AForm>
    <AFormItem
      label="ID"
      v-bind="validateInfos.id"
      :style="{ display: 'none' }"
    >
      <AInput v-model:value="formModel.id" />
    </AFormItem>

    <AFormItem label="组件类型" v-bind="validateInfos.type">
      <ASelect
        disabled
        :options="componentTypes"
        v-model:value="formModel.type"
      />
    </AFormItem>

    <AFormItem label="组件状态" v-bind="validateInfos.status">
      <ASwitch
        v-model:checked="formModel.status"
        checkedChildren="启用"
        unCheckedChildren="禁用"
      />
    </AFormItem>

    <AFormItem label="关联菜单" v-bind="validateInfos.menuIds">
      <ATreeSelect
        :fieldNames="{ label: 'name', value: 'id' }"
        placeholder="请选择关联菜单"
        v-model:value="formModel.menuIds"
        treeDefaultExpandAll
        :treeData="menuData"
        treeCheckable
        :onDropdownVisibleChange="onMenuDropdown"
        class="flex-1"
      />
    </AFormItem>
  </AForm>
</template>

<script setup lang="ts">
import { Form } from 'ant-design-vue'
import { pick } from 'lodash-es'
import { computed, ref } from 'vue'
import { useMenuTree } from '../../hooks'
import { componentTypes } from './data'
import type { Rule } from 'ant-design-vue/es/form'
import { SiderItem } from '#/request'

const props = withDefaults(
  defineProps<{
    inModal?: boolean
  }>(),
  {
    inModal: false,
  },
)

const { menuData, onMenuDropdown } = useMenuTree()

const formModel = ref<Partial<Omit<SiderItem, 'props'>>>({
  // type: undefined,
  // status: true,
  // menuIds: [],
})

const baseRules = computed(() => {
  const rules: Record<string, Rule[]> = {
    type: [
      {
        required: true,
        message: '请选择组件类型！',
      },
    ],
    status: [
      {
        required: true,
        message: '请选择组件状态！',
      },
    ],
    menuIds: [
      {
        required: true,
        message: '请选择组件关联菜单！',
      },
    ],
  }
  if (!props.inModal) return rules
  return pick(rules, ['type', 'status'])
})

const { validateInfos, resetFields, validate, clearValidate, initialModel } =
  Form.useForm(formModel, baseRules)

defineExpose({
  formModel,
  resetFields,
  validate,
  clearValidate,
  initialModel,
})
</script>
