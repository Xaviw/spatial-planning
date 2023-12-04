import { Form, Radio } from 'ant-design-vue'
import Editor from './editor.vue'
import 'vue3-colorpicker/style.css'
import type { Rule } from 'ant-design-vue/es/form'
import type { ComponentFormProps } from 'components/SiderHelper/siderBaseForm'

export function form({ model, validateInfos, editorRef }: ComponentFormProps) {
  return (
    <>
      <Form.Item
        label='轴位置'
        help='默认显示在“左侧”'
        {...validateInfos['props.mode']}
      >
        <Radio.Group v-model:value={model.value.props.mode}>
          <Radio value='left'>左侧</Radio>
          <Radio value='alternate'>左右交替</Radio>
          <Radio value='right'>右侧</Radio>
        </Radio.Group>
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

export const rules = (): Record<string, Rule[]> => ({
  'props.data': [
    {
      required: true,
      message: '请填写数据！',
    },
  ],
})
