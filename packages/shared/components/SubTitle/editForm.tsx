import { Form, Input } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { validateInfos } from 'ant-design-vue/es/form/useForm'
import type { Ref } from 'vue'

export function form(model: Ref<Recordable>, validateInfos: validateInfos) {
  return (
    <>
      <Form.Item label='1111111标题' {...validateInfos.title}>
        <Input v-model:value={model.value.title} />
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
