import { Form, InputNumber, Switch } from 'ant-design-vue'
import CssSizeInput from '../CssSizeInput/index.vue'
import Editor from './editor.vue'
import type { Rule } from 'ant-design-vue/es/form'
import type {
  ComponentFormProps,
  ComponentFormRuleProps,
} from 'components/SiderHelper/siderBaseForm'

export function form({ model, validateInfos, editorRef }: ComponentFormProps) {
  return (
    <>
      <Form.Item
        label='容器高度'
        help='默认“240px”'
        {...validateInfos['props.height']}
      >
        <CssSizeInput
          modelValue={model.value.props.height}
          onUpdate:modelValue={newValue =>
            (model.value.props.height = newValue)
          }
          min={0}
        />
      </Form.Item>
      <Form.Item
        label='外环半径'
        help='默认“95%”'
        {...validateInfos['props.outterRadius']}
      >
        <InputNumber
          v-model:value={model.value.props.outterRadius}
          min={1}
          max={100}
          addonAfter='%'
        />
      </Form.Item>
      <Form.Item
        label='内环半径'
        help='设置后显示为环形图'
        {...validateInfos['props.innerRadius']}
      >
        <InputNumber
          v-model:value={model.value.props.innerRadius}
          min={1}
          max={100}
          addonAfter='%'
        />
      </Form.Item>
      <Form.Item
        label='中心点位于横轴位置'
        help='默认“45%”'
        {...validateInfos['props.centerX']}
      >
        <InputNumber
          v-model:value={model.value.props.centerX}
          min={0}
          max={100}
          addonAfter='%'
        />
      </Form.Item>
      <Form.Item
        label='中心点位于纵轴位置'
        help='默认“50%”'
        {...validateInfos['props.centerY']}
      >
        <InputNumber
          v-model:value={model.value.props.centerY}
          min={0}
          max={100}
          addonAfter='%'
        />
      </Form.Item>
      <Form.Item
        label='南丁格尔图（玫瑰图）'
        {...validateInfos['props.enableRose']}
      >
        <Switch v-model:checked={model.value.props.enableRose} />
      </Form.Item>
      <Form.Item label='数据' {...validateInfos['props.data']}>
        <Editor
          modelValue={model.value.props.data}
          onUpdate:modelValue={newValue => (model.value.props.data = newValue)}
          ref={editorRef}
        />
      </Form.Item>
    </>
  )
}

export const rules: (
  options: ComponentFormRuleProps,
) => Record<string, Rule[]> = ({ model }) => ({
  'props.innerRadius': [
    {
      validator(_rule, value) {
        if (value) {
          const outterRadius = model.value.props.outterRadius
          if (
            (outterRadius && value >= outterRadius) ||
            (!outterRadius && value >= 95)
          ) {
            return Promise.reject('内环半径不能大于外环半径！')
          }
        }
        return Promise.resolve()
      },
    },
  ],
  'props.data': [
    {
      required: true,
      message: '请填写数据！',
    },
  ],
})
