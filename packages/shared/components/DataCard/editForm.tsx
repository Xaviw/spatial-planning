import { Form, Input, Switch } from 'ant-design-vue'
import CssSizeInput from '../CssSizeInput/index.vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { ComponentFormProps } from 'components/SiderHelper/siderBaseForm'

export function form({ model, validateInfos }: ComponentFormProps) {
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
        help='默认“36px”'
        {...validateInfos['props.imgWidth']}
      >
        <CssSizeInput
          modelValue={model.value.props.imgWidth}
          onUpdate:modelValue={newValue =>
            (model.value.props.imgWidth = newValue)
          }
          max={48}
          min={20}
        />
      </Form.Item>
      <Form.Item
        label='图片高度'
        help='默认“36px”'
        {...validateInfos['props.imgHeight']}
      >
        <CssSizeInput
          modelValue={model.value.props.imgHeight}
          onUpdate:modelValue={newValue =>
            (model.value.props.imgHeight = newValue)
          }
          max={48}
          min={20}
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
