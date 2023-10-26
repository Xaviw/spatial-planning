import type { ModalProps } from 'ant-design-vue/es/modal/index'
import type { VNode } from 'vue'

interface UseModalOptions {
  /** 弹窗key，存在相同key的弹窗时会复用DOM */
  key?: string
  /** Modal props */
  modalProps?: ModalProps
  /** 弹窗内容组件 */
  component: VNode | JSX.Element
}

export default function useModal(options: UseModalOptions) {}
