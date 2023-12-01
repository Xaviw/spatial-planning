import { Form, InputNumber, Radio, type RadioChangeEvent } from 'ant-design-vue'
import { ColorPicker } from 'vue3-colorpicker'
import Editor from './editor.vue'
import Format from './format.vue'
import 'vue3-colorpicker/style.css'
import type { Rule } from 'ant-design-vue/es/form'
import type { ComponentFormProps } from 'components/SiderHelper/siderBaseForm'

export function form({ model, validateInfos, editorRef }: ComponentFormProps) {
  function onTypeChange({ target: { value } }: RadioChangeEvent) {
    if (value === 'line') {
      model.value.props.strokeWidth = undefined
      model.value.props.gapDegree = undefined
      model.value.props.gapPosition = undefined
    } else if (value === 'circle') {
      model.value.props.steps = undefined
      model.value.props.gapDegree = undefined
      model.value.props.gapPosition = undefined
    } else if (value === 'dashboard') {
      model.value.props.steps = undefined
    }
  }

  return (
    <>
      <Form.Item
        label='类型'
        help='默认进度条'
        {...validateInfos['props.type']}
      >
        <Radio.Group
          v-model:value={model.value.props.type}
          onChange={onTypeChange}
        >
          <Radio value='line'>进度条</Radio>
          <Radio value='circle'>进度环</Radio>
          <Radio value='dashboard'>仪表盘</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label='排列方式'
        help='默认纵向排列'
        {...validateInfos['props.layout']}
      >
        <Radio.Group v-model:value={model.value.props.layout}>
          <Radio value='vertical'>纵向</Radio>
          <Radio value='horizontal'>横向</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item
        label='数据模板'
        help='默认“数据%”'
        {...validateInfos['props.format']}
      >
        <Format
          modelValue={model.value.props.format}
          onUpdate:modelValue={newValue =>
            (model.value.props.format = newValue)
          }
        />
      </Form.Item>
      {model.value.props.type === 'line' && (
        <Form.Item
          label='进度条分段数'
          help='默认不分段'
          {...validateInfos['props.steps']}
        >
          <InputNumber v-model:value={model.value.props.steps} precision={0} />
        </Form.Item>
      )}
      {model.value.props.type !== 'line' && (
        <Form.Item
          label='进度条宽度'
          help='单位为相对于整体尺寸所占百分比，默认6%'
          {...validateInfos['props.strokeWidth']}
        >
          <InputNumber
            v-model:value={model.value.props.strokeWidth}
            precision={0}
            min={1}
            max={99}
            addonAfter='%'
          />
        </Form.Item>
      )}
      {model.value.props.type === 'dashboard' && (
        <>
          <Form.Item
            label='缺口角度'
            help='仪表盘缺口角度，默认75度'
            {...validateInfos['props.gapDegree']}
          >
            <InputNumber
              v-model:value={model.value.props.gapDegree}
              precision={0}
              min={0}
              max={295}
              addonAfter='度'
            />
          </Form.Item>
          <Form.Item
            label='缺口位置'
            help='仪表盘缺口位置，默认底部'
            {...validateInfos['props.gapPosition']}
          >
            <Radio.Group v-model:value={model.value.props.gapPosition}>
              <Radio value='top'>顶部</Radio>
              <Radio value='bottom'>底部</Radio>
              <Radio value='left'>左侧</Radio>
              <Radio value='right'>右侧</Radio>
            </Radio.Group>
          </Form.Item>
        </>
      )}
      <Form.Item
        label='进度条颜色'
        help='默认蓝色（#1677ff）'
        {...validateInfos['props.strokeColor']}
      >
        <ColorPicker v-model:pureColor={model.value.props.strokeColor} />
      </Form.Item>
      <Form.Item
        label='进度条底色'
        help='默认半透明（#ffffff22'
        {...validateInfos['props.trailColor']}
      >
        <ColorPicker v-model:pureColor={model.value.props.trailColor} />
      </Form.Item>
      <Form.Item
        label='尺寸'
        help='类型为进度条时，尺寸是进度条高度，否则尺寸是整体大小'
        {...validateInfos['props.size']}
      >
        <InputNumber
          v-model={model.value.props.size}
          min={1}
          precision={0}
          addonAfter='像素'
        />
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
