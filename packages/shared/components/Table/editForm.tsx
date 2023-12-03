import { Form } from 'ant-design-vue'
import Editor from './editor.vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { ComponentFormProps } from 'components/SiderHelper/siderBaseForm'

export function form({ model, validateInfos }: ComponentFormProps) {
  return (
    <Form.Item
      label='数据'
      extra='点击左上角进入全屏编辑'
      {...validateInfos['props.data']}
    >
      <div class='overflow-auto' style='max-width: calc(25rem - 60px);'>
        <Editor
          modelValue={model.value.props.data}
          onUpdate:modelValue={newData => (model.value.props.data = newData)}
        />
      </div>
    </Form.Item>
  )
}

export const rules = (): Record<string, Rule[]> => ({
  'props.data': [
    {
      required: true,
      message: '请填写数据！',
      validator(_rule, value) {
        if (
          !value.length ||
          !value[0].length ||
          !value[0].every((item: string) => !!item)
        )
          return Promise.reject()
        return Promise.resolve()
      },
    },
  ],
})
