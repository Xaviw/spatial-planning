import { Form, Input, Radio, Select, Switch, TreeSelect } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import {
  type DefineComponent,
  computed,
  defineComponent,
  Ref,
  ref,
  type VNode,
} from 'vue'
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

export interface ComponentFormProps {
  model: Ref<Recordable>
  validateInfos: validateInfos
  editorRef: Ref<DefineComponent | null>
  /** Title 组件详情弹窗会复用表单 */
  inModal: boolean
}

export interface ComponentFormRuleProps {
  inModal: boolean
  model: Ref<Recordable>
  editorRef: Ref<DefineComponent | null>
}

export default defineComponent(
  function (
    props: {
      element: (options: ComponentFormProps) => JSX.Element | VNode
      rules: (options: ComponentFormRuleProps) => Record<string, Rule[]>
      inModal: boolean
    },
    { emit },
  ) {
    const editorRef = ref<DefineComponent | null>(null)

    const model = ref<Recordable>({ props: {} })

    const rules = computed(() => ({
      ...baseRules(props.inModal),
      ...(typeof props.rules === 'function'
        ? props.rules({ inModal: props.inModal, model, editorRef })
        : {}),
    }))

    const { validateInfos, clearValidate, validate } = Form.useForm(
      model,
      rules,
    )

    const formMethods = {
      validate: () => {
        const events: Promise<any>[] = [validate()]
        if (editorRef.value?.validate) {
          events.push(editorRef.value.validate())
        }
        return Promise.all(events)
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

        {props.element({
          model,
          validateInfos,
          inModal: props.inModal,
          editorRef,
        })}
      </Form>
    )
  },
  {
    name: 'siderBaseForm',
    props: ['element', 'rules', 'inModal'],
    emits: ['register'],
  },
)
