import { Modal, type ModalFuncProps } from 'ant-design-vue'

export function modal(
  method: 'info' | 'success' | 'error' | 'warning' | 'confirm',
  props: ModalFuncProps,
) {
  const defaultTitle = {
    info: '提示',
    success: '成功',
    error: '错误',
    warning: '警告',
    confirm: '警告',
  }
  return new Promise((resolve, reject) => {
    Modal[method]({
      title: defaultTitle[method],
      ...props,
      async onOk() {
        const res = await props.onOk?.()
        resolve(res)
      },
      async onCancel() {
        const res = await props.onCancel?.()
        reject(res)
      },
    })
  })
}
