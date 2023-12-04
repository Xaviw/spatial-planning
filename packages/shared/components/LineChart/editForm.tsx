import { Form } from 'ant-design-vue'
import CssSizeInput from '../CssSizeInput/index.vue'
import DataEditor from './dataEditor.vue'
import Editor from './editor.vue'
import type { BarChartItem } from '#/components'
import type { Rule } from 'ant-design-vue/es/form'
import type {
  ComponentFormProps,
  ComponentFormRuleProps,
} from 'components/SiderHelper/siderBaseForm'

export function form({ model, validateInfos, editorRef }: ComponentFormProps) {
  function onRemove(index: number) {
    model.value.props.series.forEach((item: BarChartItem) =>
      item.data.splice(index, 1),
    )
  }

  function onAdd() {
    model.value.props.series.forEach((item: BarChartItem) => item.data.push(0))
  }

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
      <Form.Item label='数据项' {...validateInfos['props.xAxis']}>
        <DataEditor
          type='string'
          modelValue={model.value.props.xAxis}
          onUpdate:modelValue={newValue => (model.value.props.xAxis = newValue)}
          onRemove={onRemove}
          onAdd={onAdd}
        />
      </Form.Item>
      <Form.Item label='数据' {...validateInfos['props.series']}>
        <Editor
          modelValue={model.value.props.series}
          onUpdate:modelValue={newValue =>
            (model.value.props.series = newValue)
          }
          xAxis={model.value.props.xAxis}
          ref={editorRef}
        />
      </Form.Item>
    </>
  )
}

export const rules: (
  options: ComponentFormRuleProps,
) => Record<string, Rule[]> = () => ({
  'props.xAxis': [
    {
      required: true,
      message: '请将数据项补充完整！',
      validator(_rule, value) {
        if (value?.some((item: string) => !item)) return Promise.reject()
        return Promise.resolve()
      },
    },
  ],
  'props.series': [
    {
      required: true,
      message: '请填写数据！',
    },
  ],
})
