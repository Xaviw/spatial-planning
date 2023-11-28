import { Form, Input, Button } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { validateInfos } from 'ant-design-vue/es/form/useForm'
import type { Ref } from 'vue'

export function form(model: Ref<Recordable>, validateInfos: validateInfos) {
  return (
    <>
      <Form.Item label='标题' {...validateInfos.title}>
        <Input v-model:value={model.value.props.title} />
      </Form.Item>
      <Form.Item
        label='详情弹窗内容'
        help='添加内容后标题组件右侧会显示打开弹窗按钮'
      >
        <Button>点击设置</Button>
      </Form.Item>
      <Form.Item label='详情弹窗标题' help='默认为“标题名+详情弹窗”'>
        <Input v-model:value={model.value.props.modalTitle} />
      </Form.Item>
      <Form.Item
        label='详情弹窗宽度'
        help='支持任意CSS宽度单位或数字（px），默认25rem'
      >
        <Input v-model:value={model.value.props.modalWidth} />
      </Form.Item>
    </>
  )
}

export const rules: Record<string, Rule[]> = {
  title: [
    {
      required: true,
      message: '请填写标题！',
    },
  ],
}
