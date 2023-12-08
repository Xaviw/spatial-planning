import { Modal } from '@sp/shared/components'
import { h, render, VNode } from 'vue'
import type { ModalProps } from 'ant-design-vue/es/modal/index'

const modalMap = new Map()

/**
 * modal函数式使用方法，open时传入显示内容
 * @param key 弹窗key，相同key的弹窗会复用wrapper dom，仅替换内容部分
 * @param modalProps antd modal 参数
 * @returns 打开、关闭、销毁方法
 */
export function useModal(
  key: string,
  modalProps?: Partial<Omit<ModalProps, 'open'>>,
): {
  open: (content: JSX.Element | VNode) => void
  close: () => void
  destroy: () => void
} {
  if (modalMap.has(key)) {
    return modalMap.get(key)
  } else {
    const container = document.createDocumentFragment()

    let instance: null | VNode = null

    let currentContent: VNode

    const handler = {
      open(content: JSX.Element | VNode) {
        if (instance?.component) {
          if (content !== currentContent) {
            currentContent = content
            instance.component.slots = { default: () => [content] }
          }
          instance.component.props.modelValue = true
          instance.component.update()
        }
      },
      close() {
        if (instance?.component) {
          instance.component.props.modelValue = false
          instance.component.update()
        }
      },
      destroy() {
        if (instance) {
          render(null, container as any)
          instance = null
          modalMap.delete(key)
        }
      },
    }

    instance = h(Modal, {
      ...modalProps,
      modelValue: false,
      'onUpdate:modelValue': handler.close,
    })

    render(instance, container as any)

    modalMap.set(key, handler)

    return handler
  }
}
