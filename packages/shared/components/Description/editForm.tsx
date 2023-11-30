import { Form, Input, InputNumber, Radio } from 'ant-design-vue'
import Editor from './editor.vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { validateInfos } from 'ant-design-vue/es/form/useForm'
import type { Ref } from 'vue'

export function form(model: Ref<Recordable>, validateInfos: validateInfos) {
  return (
    <>
      <Form.Item
        label='列数量'
        help='默认三列'
        {...validateInfos['props.column']}
      >
        <InputNumber
          v-model:value={model.value.props.column}
          min={1}
          precision={0}
        />
      </Form.Item>

      <Form.Item
        label='标题'
        help='显示在列表顶部的标题'
        {...validateInfos['props.title']}
      >
        <Input v-model:value={model.value.props.title} />
      </Form.Item>

      <Form.Item
        label='布局方式'
        help='名称与内容同行或换行显示，默认同行'
        {...validateInfos['props.layout']}
      >
        <Radio.Group v-model:value={model.value.props.layout}>
          <Radio value='horizontal'>同行</Radio>
          <Radio value='vertical'>换行</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item label='数据' {...validateInfos['props.data']}>
        <Editor
          modelValue={model.value.props.data}
          onUpdate:modelValue={data => (model.value.props.data = data)}
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
      validator(_rule, value) {
        if (value.length) return Promise.resolve()
        return Promise.reject()
      },
    },
  ],
})
