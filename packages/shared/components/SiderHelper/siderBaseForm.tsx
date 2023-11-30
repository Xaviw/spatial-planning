import {
  Button,
  Form,
  Input,
  Radio,
  Select,
  Switch,
  TreeSelect,
} from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { computed, defineComponent, provide, Ref, ref, type VNode } from 'vue'
import { baseRules, componentTypes } from './data'
import { useMenuTree } from './useMenuTree'
import type { Rule } from 'ant-design-vue/es/form'
import type {
  validateInfos,
  validateOptions,
} from 'ant-design-vue/es/form/useForm'

export interface BaseFormMethods {
  validate: (names?: string | string[], options?: validateOptions) => void
  clearValidate: (names?: string | string[]) => void
  resetFields: (newValues?: Recordable) => void
  getFieldsValue: () => Recordable
}

export default defineComponent(
  function (
    props: {
      element: (
        model: Ref<Recordable>,
        validateInfos: validateInfos,
        inModal: boolean,
      ) => JSX.Element | VNode
      rules: (inModal: boolean) => Record<string, Rule[]>
      inModal: boolean
    },
    { emit },
  ) {
    const model = ref<Recordable>({ props: {} })

    const rules = computed(() => ({
      ...baseRules(props.inModal),
      ...(typeof props.rules === 'function' ? props.rules(props.inModal) : {}),
    }))

    const { validateInfos, clearValidate, validate } = Form.useForm(
      model,
      rules,
    )

    const validateFlag = ref(0)
    provide('validateFlag', validateFlag)

    const formMethods = {
      validate() {
        validateFlag.value++
        validate()
      },
      clearValidate,
      resetFields(newValues: Recordable = { props: {} }) {
        if (!newValues.props) newValues.props = {}
        model.value = newValues
      },
      getFieldsValue() {
        return cloneDeep(model.value)
      },
    }

    emit('register', formMethods)

    const { menuData, onMenuDropdown } = useMenuTree()

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
        {!props.inModal && (
          <>
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
          </>
        )}

        {props.element(model, validateInfos, props.inModal)}
        <Form.Item>
          <Button htmlType='submit'>submit</Button>
        </Form.Item>
      </Form>
    )
  },
  {
    name: 'siderBaseForm',
    props: ['element', 'rules', 'inModal'],
    emits: ['register'],
  },
)
