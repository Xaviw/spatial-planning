import { Modal, type ModalFuncProps } from 'ant-design-vue'
import type { MenuItem } from '#/request'
import type { MaybeRef, ComputedRef } from 'vue'

export * from './enums'
export * from './request'

export const color = [
  '#05f8d6',
  '#0082fc',
  '#fdd845',
  '#22ed7c',
  '#09b0d3',
  '#1d27c9',
  '#f9e264',
  '#f47a75',
  '#009db2',
  '#024b51',
  '#0780cf',
  '#765005',
]

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
      centered: true,
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

export function toRawValue<T>(value: MaybeRef<T> | ComputedRef<T>): T {
  if (isRef(value)) return unref<T>(value)
  if (isProxy(value)) return toRaw(value)
  return value
}

export function loopMenu(
  data: MenuItem[],
  callback: (
    item: MenuItem,
    index: number,
    data: MenuItem[],
    parent?: MenuItem,
  ) => void,
  key?: string,
  parent?: MenuItem,
) {
  data.forEach((item, index) => {
    if (key) {
      if (item.id === key) {
        return callback(item, index, data, parent)
      }
      if (item.children?.length) {
        return loopMenu(item.children, callback, key, item)
      }
    } else {
      if (item.children?.length) {
        loopMenu(item.children, callback, key, item)
      }
      callback(item, index, data, parent)
    }
  })
}
