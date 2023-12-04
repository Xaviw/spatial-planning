import { Form, Radio, Switch, Upload } from 'ant-design-vue'
import CssSizeInput from '../CssSizeInput/index.vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { ComponentFormProps } from 'components/SiderHelper/siderBaseForm'

export function form({ model, validateInfos }: ComponentFormProps) {
  return (
    <>
      <Form.Item
        label='自动切换'
        help='默认开启'
        {...validateInfos['props.autoplay']}
      >
        <Switch v-model:checked={model.value.props.autoplay} />
      </Form.Item>
      <Form.Item
        label='显示指示点'
        help='默认显示'
        {...validateInfos['props.dots']}
      >
        <Switch v-model:checked={model.value.props.dots} />
      </Form.Item>
      <Form.Item
        label='指示点位置'
        help='默认“底部”'
        {...validateInfos['props.dotPosition']}
      >
        <Radio.Group v-model:value={model.value.props.dotPosition}>
          <Radio value='top'>顶部</Radio>
          <Radio value='bottom'>底部</Radio>
          <Radio value='left'>左侧</Radio>
          <Radio value='right'>右侧</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label='组件高度'
        help='各图片高度差距过大时定义，可以避免切换到短图时底部留白'
        {...validateInfos['props.height']}
      >
        <CssSizeInput
          modelValue={model.value.props.height}
          onUpdate:modelValue={newValue =>
            (model.value.props.height = newValue)
          }
        />
      </Form.Item>
      <Form.Item label='图片' {...validateInfos['props.data']}>
        <Upload />
      </Form.Item>
    </>
  )
}

export const rules = (): Record<string, Rule[]> => ({
  'props.data': [
    {
      required: true,
      message: '请上传图片！',
    },
  ],
})
