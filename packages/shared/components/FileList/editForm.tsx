import { Form, InputNumber } from 'ant-design-vue'
import CssSizeInput from '../CssSizeInput/index.vue'
import Editor from './editor.vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { ComponentFormProps } from 'components/SiderHelper/siderBaseForm'

export function form({ model, validateInfos, editorRef }: ComponentFormProps) {
  return (
    <>
      <Form.Item
        label='列数'
        help='默认“4”列'
        {...validateInfos['props.columns']}
      >
        <InputNumber
          v-model:value={model.value.props.columns}
          min={1}
          precision={0}
        />
      </Form.Item>
      <Form.Item label='间隔' help='默认“8px”' {...validateInfos['props.gap']}>
        <CssSizeInput
          modelValue={model.value.props.gap}
          onUpdate:modelValue={newValue => (model.value.props.gap = newValue)}
        />
      </Form.Item>
      <Form.Item label='文件列表' {...validateInfos['props.data']}>
        <Editor
          modelValue={model.value.props.data}
          onUpdate:modelValue={data => (model.value.props.data = data)}
          ref={editorRef}
        />
      </Form.Item>
    </>
  )
}

export const rules = (): Record<string, Rule[]> => ({
  'props.data': [
    {
      required: true,
      message: '请上传文件！',
    },
  ],
})
