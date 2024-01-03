import { Modal, type ModalFuncProps } from 'ant-design-vue'
import { isEqual } from 'lodash-es'
import type { OperationItem } from '#/business'
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

export function loop<T extends Recordable>(
  data: T[],
  primaryKey: string,
  childrenKey: string,
  callback: (item: T, index: number, data: T[], parent?: T) => void,
  searchKey?: string,
  parent?: T,
) {
  data.forEach((item, index) => {
    if (searchKey) {
      if (item[primaryKey] === searchKey) {
        return callback(item, index, data, parent)
      }
      if (item[childrenKey]?.length) {
        return loop(
          item[childrenKey],
          primaryKey,
          childrenKey,
          callback,
          searchKey,
          item,
        )
      }
    } else {
      if (item[childrenKey]?.length) {
        loop(
          item[childrenKey],
          primaryKey,
          childrenKey,
          callback,
          searchKey,
          item,
        )
      }
      callback(item, index, data, parent)
    }
  })
}

export function getOperationsFromDiff<T extends Recordable>(
  newArr: T[],
  oldArr: T[],
  sortKey?: string,
  key: keyof T = 'id',
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

  const operations: OperationItem<T>[] = []

  for (const [k, v] of newMap) {
    if (!oldMap.has(k)) {
      const operate: OperationItem<T> = {
        op: 'add',
        value: { ...v.data },
      }
      if (sortKey) {
        ;(operate.value as any)[sortKey] = v.index
      }
      operations.push(operate)
    } else {
      const oldValue = oldMap.get(k)!
      const operation = {
        op: 'replace',
        id: k,
        value: {},
      } as OperationItem<any>
      if (sortKey && v.index !== oldValue.index) {
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
