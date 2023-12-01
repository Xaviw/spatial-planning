import { Form } from 'ant-design-vue'
import { watchEffect } from 'vue'
import Editor from './editor.vue'
import type { Rule } from 'ant-design-vue/es/form'
import type { ComponentFormProps } from 'components/SiderHelper/siderBaseForm'

export function form({ model, validateInfos }: ComponentFormProps) {
  watchEffect(() => {
    //   // model.value.props.data =
    //   const header: string[] = columns.value.map(item => item.name as string)
    //   const keys: string[] = columns.value.map(item => item.dataIndex as string)
    //   const content: string[][] = data.value.map(item => {
    //     return keys.reduce((p, c) => {
    //       p.push(item[c])
    //       return p
    //     }, [] as string[])
    //   })
    //   model.value.props.data = [header, ...content]
  })

  return (
    <Form.Item label='数据' {...validateInfos['props.data']}>
      <div class='overflow-auto' style='max-width: calc(25rem - 60px);'>
        <Editor
          modelValue={model.value.props.data}
          onUpdate:modelValue={newData => (model.value.props.data = newData)}
        />
      </div>
    </Form.Item>
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
