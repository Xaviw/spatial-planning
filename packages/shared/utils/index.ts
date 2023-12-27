import { Modal, type ModalFuncProps } from 'ant-design-vue'
import { isEqual } from 'lodash-es'
import type { MenuItem, OperationItem } from '#/request'
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

export function getOperationsFromDiff<T extends Recordable>(
  newArr: T[],
  oldArr: T[],
  key: keyof T = 'id',
  sortKey = 'sort',
) {
  const newMap = new Map(
    newArr.map((data, index) => [
      data[key],
      {
        index,
        data,
      },
    ]),
  )
  const oldMap = new Map(
    oldArr.map((data, index) => [
      data[key],
      {
        index,
        data,
      },
    ]),
  )

  const operations: OperationItem<T & { [key: string]: number }>[] = []

  for (const [k, v] of newMap) {
    if (!oldMap.has(k)) {
      operations.push({
        op: 'add',
        value: { ...v.data, [sortKey]: v.index },
      })
    } else {
      const oldValue = oldMap.get(k)
      const operation = {
        op: 'replace',
        id: k,
        value: {},
      } as OperationItem<any>
      if (v.index !== oldValue!.index) {
        operation.value[sortKey] = v.index
      }
      if (!isEqual(v.data, oldValue!.data)) {
        operation.value = { ...v.data, ...operation.value }
      }
      if (Object.keys(operation.value).length) {
        operations.push(operation)
      }
    }
  }

  for (const [k] of oldMap) {
    if (!newMap.has(k)) {
      operations.push({ op: 'remove', id: k })
    }
  }

  return operations
}

export function generateRandomDecimal(
  min: number,
  max: number,
  decimalPlaces: number,
): number {
  const randomNum = Math.random() * (max - min) + min
  const multiplier = Math.pow(10, decimalPlaces)
  return Math.round(randomNum * multiplier) / multiplier
}
