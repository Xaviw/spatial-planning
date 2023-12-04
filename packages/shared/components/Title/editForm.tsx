import { Form, Input, Button } from 'ant-design-vue'
import { useModal } from '../../hooks'
import CssSizeInput from '../CssSizeInput/index.vue'
import SiderModalEditor from '../SiderHelper/siderModalEditor.vue'
import type { DetailItem } from '#/request'
import type { Rule } from 'ant-design-vue/es/form'
import type { ComponentFormProps } from 'components/SiderHelper/siderBaseForm'

export function form({ model, validateInfos, inModal }: ComponentFormProps) {
  const { open, close } = useModal('TitleDetailEditor')

  function openDetail() {
    open(
      <SiderModalEditor
        title={
          model.value.props.modalTitle || `${model.value.props.title}详情内容`
        }
        modalWidth={model.value.props.modalWidth}
        modalData={model.value.props.modalData}
        onClose={close}
        onConfirm={onDetailConfirm}
      />,
    )
  }

  function onDetailConfirm(list: DetailItem[]) {
    model.value.props.modalData = list
  }

  return (
    <>
      <Form.Item label='标题' {...validateInfos['props.title']}>
        <Input v-model:value={model.value.props.title} />
      </Form.Item>
      {!inModal && (
        <>
          <Form.Item
            label='详情弹窗内容'
            help='添加内容后，标题组件右侧会显示打开弹窗按钮'
          >
            <Button onClick={openDetail}>{`点击设置（当前包含详情${
              model.value.props.modalData?.length || 0
            }条）`}</Button>
          </Form.Item>
          <Form.Item label='详情弹窗标题' help='默认“标题名+详情弹窗”'>
            <Input v-model:value={model.value.props.modalTitle} />
          </Form.Item>
          <Form.Item label='详情弹窗宽度' help='默认“25rem”'>
            <CssSizeInput
              modelValue={model.value.props.modalWidth}
              onUpdate:modelValue={newValue =>
                (model.value.props.modalWidth = newValue)
              }
            />
          </Form.Item>
        </>
      )}
    </>
  )
}

export const rules = (): Record<string, Rule[]> => ({
  'props.title': [
    {
      required: true,
    },
  ],
})
