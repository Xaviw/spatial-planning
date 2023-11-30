import { Form, Input, Switch } from 'ant-design-vue'
import Editor from './editor.vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { validateInfos } from 'ant-design-vue/es/form/useForm'
import type { Ref } from 'vue'

export function form(model: Ref<Recordable>, validateInfos: validateInfos) {
  return (
    <>
      <Form.Item label='标题' {...validateInfos['props.title']}>
        <Input v-model:value={model.value.props.title} />
      </Form.Item>
      {/* HACK: 用编辑器组件传出的_empty判断是否为空，因为editor为空时值为<p><br/></p> */}
      <Form.Item label='内容' {...validateInfos['props._empty']}>
        <Editor
          modelValue={model.value.props.content}
          onUpdate:modelValue={(value: string, text: boolean) => {
            model.value.props.content = value
            model.value.props._empty = text
          }}
        />
      </Form.Item>
      <Form.Item
        label='默认展开'
        help='不设置时初始默认折叠'
        {...validateInfos['props.defaultOpen']}
      >
        <Switch
          v-model:checked={model.value.props.defaultOpen}
          checkedChildren='展开'
          unCheckedChildren='折叠'
        />
      </Form.Item>
    </>
  )
}

export const rules = (): Record<string, Rule[]> => ({
  'props.title': [
    {
      required: true,
      message: '请填写标题！',
    },
  ],
  'props._empty': [
    {
      required: true,
      message: '请填写内容！',
      validator(_rule, value) {
        return value ? Promise.reject() : Promise.resolve()
      },
    },
  ],
})
