import { Form, Input, InputNumber, Switch } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { validateInfos } from 'ant-design-vue/es/form/useForm'
import type { Ref } from 'vue'

export function form(model: Ref<Recordable>, validateInfos: validateInfos) {
  return (
    <>
      <Form.Item label='名称' {...validateInfos['props.title']}>
        <Input v-model:value={model.value.props.title} />
      </Form.Item>
      <Form.Item label='数据' {...validateInfos['props.content']}>
        <Input v-model:value={model.value.props.content} />
      </Form.Item>
      <Form.Item label='图片' {...validateInfos['props.img']}>
        <Input v-model:value={model.value.props.img} />
      </Form.Item>
      <Form.Item label='支持预览' {...validateInfos['props.imgPreview']}>
        <Switch
          v-model:checked={model.value.props.imgPreview}
          checkedChildren='是'
          unCheckedChildren='否'
        />
      </Form.Item>
      <Form.Item
        label='图片宽度'
        help='默认36像素'
        {...validateInfos['props.imgWidth']}
      >
        <InputNumber
          v-model:value={model.value.props.imgWidth}
          addonAfter='像素'
          max={48}
          min={20}
          precision={0}
        />
      </Form.Item>
      <Form.Item
        label='图片高度'
        help='默认36像素'
        {...validateInfos['props.imgHeight']}
      >
        <InputNumber
          v-model:value={model.value.props.imgHeight}
          addonAfter='像素'
          max={48}
          min={20}
          precision={0}
        />
      </Form.Item>
    </>
  )
}

export const rules = (): Record<string, Rule[]> => ({
  'props.title': [
    {
      required: true,
      message: '请填写名称！',
    },
  ],
})
