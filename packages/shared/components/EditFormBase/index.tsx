import { useRequest } from 'alova'
import { Form, Input, Radio, Select, Switch, TreeSelect } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { defineComponent, reactive, Ref, ref, type VNode } from 'vue'
import { getMenu } from '../../apis'
import { baseRules, componentTypes } from './data'
import type { MenuItem } from '#/client'
import type { Rule } from 'ant-design-vue/es/form'
import type { validateInfos } from 'ant-design-vue/es/form/useForm'
import type { DefaultOptionType } from 'ant-design-vue/es/select'

export default defineComponent(
  function (
    props: {
      element: (
        model: Ref<Recordable>,
        validateInfos: validateInfos,
      ) => JSX.Element | VNode
      rules: Record<string, Rule[]>
    },
    { emit },
  ) {
    const model = ref<Recordable>({})
    const rules = reactive({
      ...baseRules,
      ...props.rules,
    })
    const { validateInfos, clearValidate, resetFields, validate } =
      Form.useForm(model, rules)

    emit('register', {
      validate,
      clearValidate,
      resetFields,
      getFieldsValue() {
        return cloneDeep(model.value)
      },
    })

    const { data: menuData, send: sendMenu } = useRequest(
      () => getMenu(true, 'message'),
      {
        initialData: [],
      },
    )

    function onMenuDropdown(open: boolean) {
      if (!open) return
      if (!menuData.value.length) {
        sendMenu()
      }
    }

    return () => (
      <Form model={model}>
        <Form.Item label='ID' {...validateInfos.id} style={{ display: 'none' }}>
          <Input v-model:value={model.value.id} />
        </Form.Item>

        <Form.Item label='组件类型' {...validateInfos.type}>
          <Select
            disabled
            options={componentTypes}
            v-model:value={model.value.type}
          />
        </Form.Item>

        <Form.Item label='组件状态' {...validateInfos.status}>
          <Switch
            v-model:checked={model.value.status}
            checkedChildren='启用'
            unCheckedChildren='禁用'
          />
        </Form.Item>

        <Form.Item label='显示位置' {...validateInfos.position}>
          <Radio.Group v-model:value={model.value.position} name='position'>
            <Radio value='left'>左栏</Radio>
            <Radio value='right'>右栏</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item label='关联菜单' {...validateInfos.menuIds}>
          <TreeSelect
            fieldNames={{ label: 'name', value: 'id' }}
            placeholder='请选择关联菜单'
            v-model:value={model.value.menuIds}
            treeDefaultExpandAll
            treeData={menuData.value}
            treeCheckable
            onDropdownVisibleChange={onMenuDropdown}
            class='flex-1'
          />
        </Form.Item>

        {props.element(model, validateInfos)}
      </Form>
    )
  },
  {
    name: 'EditFormBase',
    props: ['element', 'rules'],
    emits: ['register'],
  },
)
