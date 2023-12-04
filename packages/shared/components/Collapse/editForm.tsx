import { Form, Input, Switch } from 'ant-design-vue'
import Editor from './editor.vue'
import type { Rule } from 'ant-design-vue/es/form'
import type {
  ComponentFormProps,
  ComponentFormRuleProps,
} from 'components/SiderHelper/siderBaseForm'

export function form({ model, validateInfos, editorRef }: ComponentFormProps) {
  return (
    <>
      <Form.Item label='标题' {...validateInfos['props.title']}>
        <Input v-model:value={model.value.props.title} />
      </Form.Item>
      <Form.Item label='内容' {...validateInfos['props.content']}>
        <Editor
          modelValue={model.value.props.content}
          onUpdate:modelValue={(value: string) => {
            model.value.props.content = value
          }}
          ref={editorRef}
        />
      </Form.Item>
      <Form.Item
        label='默认展开'
        help='不设置时，初始默认“折叠”'
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

export const rules = ({
  editorRef,
}: ComponentFormRuleProps): Record<string, Rule[]> => {
  return {
    'props.title': [
      {
        required: true,
        message: '请填写标题！',
      },
    ],
    'props.content': [
      {
        required: true,
        message: '请填写内容！',
        validator(_rule, value) {
          if (editorRef.value?.validate) {
            return editorRef.value.validate()
          }
          return value === '<p><br></p>' ? Promise.reject() : Promise.resolve
        },
      },
    ],
  }
}
