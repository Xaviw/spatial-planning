import { Modal, type ModalFuncProps } from 'ant-design-vue'
import mock from 'mockjs'
import Spark from 'spark-md5'
import type { OperationItem } from '#/business'
import type { FileItemType } from '#/materials'
import type { MaybeRef, ComputedRef } from 'vue'

export * from './request'

export const uuid = mock.Random.guid

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
      for (const valueKey in v.data) {
        if (
          Object.prototype.hasOwnProperty.call(v.data, valueKey) &&
          valueKey !== key &&
          !isEqual(v.data[valueKey], oldValue!.data[valueKey])
        ) {
          operation.value[valueKey] = v.data[valueKey]
        }
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

export function getStaticFile(path: string) {
  return import.meta.env.VITE_HOST + import.meta.env.VITE_STATIC_PATH + path
}

export function calcFileHash(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(file)
    fileReader.onload = e => {
      try {
        const buffer = e.target!.result as ArrayBuffer
        const spark = new Spark.ArrayBuffer()
        spark.append(buffer)
        resolve(spark.end())
      } catch (error) {
        reject(error)
      }
    }
    fileReader.onerror = reject
  })
}

export function getFileIconAndType(src: string): {
  icon: string
  type: FileItemType
} {
  const extName = /^.*\.(\w+)(\?.*)?$/.exec(src)?.[1]?.toLocaleLowerCase() ?? ''
  if (
    ['apng', 'avif', 'gif', 'jpeg', 'jpg', 'png', 'svg', 'webp'].includes(
      extName,
    )
  ) {
    return { icon: '', type: 'image' }
  } else if (extName === 'docx' || extName === 'doc') {
    return { icon: 'i-mdi:file-word', type: 'office' }
  } else if (extName === 'xlsx' || extName === 'xls') {
    return { icon: 'i-mdi:file-excel', type: 'office' }
  } else if (extName === 'pptx' || extName === 'ppt') {
    return { icon: 'i-mdi:file-powerpoint', type: 'office' }
  } else if (['mp4', 'webm', 'ogv', 'mov', 'avi', 'mkv'].includes(extName)) {
    return { icon: 'i-material-symbols:video-file', type: 'video' }
  } else if (['mp3', 'wav', 'ogg', 'aac', 'm4a'].includes(extName)) {
    return { icon: 'i-material-symbols:audio-file', type: 'audio' }
  } else {
    return { icon: 'i-mdi:file', type: 'other' }
  }
}

export function is(value: any) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase()
}

export function isString(value: any): value is string {
  return is(value) === 'string'
}

export function isNumber(value: any): value is number {
  return !isNaN(value) && is(value) === 'number'
}

export function isObject(value: any): value is object {
  return is(value) === 'object'
}

export function isFunction(value: any): value is (...args: any[]) => any {
  return is(value) === 'function'
}

export function isObjectOrArray(value: any): value is object | any[] {
  return isObject(value) || Array.isArray(value)
}

export function isNil(value: any): value is null | undefined {
  return value === null || value === undefined
}

export function isEmpty(value: object | any[]): value is object | [] {
  return (
    (Array.isArray(value) || isObject(value)) &&
    !Object.entries(value || {}).length
  )
}

export function pick<T extends object, K extends keyof T>(
  obj: T,
  keys: K[],
): Pick<T, K> {
  return keys.reduce(
    (result, key) => {
      if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
        result[key] = obj[key]
      }
      return result
    },
    {} as Pick<T, K>,
  )
}

export function merge<T extends object, U extends object[]>(
  target: T,
  ...sources: U
): T & UnionToIntersection<U[number]> {
  for (const source of sources) {
    for (const key in source) {
      if (source[key] === undefined && key in target) {
        continue
      }
      if (isObjectOrArray(source[key])) {
        if (
          isObjectOrArray(target[key]) &&
          is(target[key]) === is(source[key])
        ) {
          if (isObject(target[key])) {
            merge(target[key], source[key])
          } else {
            target[key] = target[key].concat(source[key])
          }
        } else {
          target[key] = source[key]
        }
      } else {
        target[key] = source[key]
      }
    }
  }
  return target as T & UnionToIntersection<U[number]>
}

export function isEqual(a: any, b: any): boolean {
  // 检查两个值的类型是否相等
  if (typeof a !== typeof b) {
    return false
  }

  // 如果是基本类型，直接比较值是否相等
  if (typeof a !== 'object' || a === null || b === null) {
    return a === b
  }

  // 如果是数组，逐个比较数组元素是否相等
  if (Array.isArray(a)) {
    if (a.length !== b.length) {
      return false
    }

    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) {
        return false
      }
    }

    return true
  }

  // 如果是对象，逐个比较对象的属性是否相等
  const keysA = Object.keys(a)
  const keysB = Object.keys(b)

  if (keysA.length !== keysB.length) {
    return false
  }

  for (const key of keysA) {
    if (!isEqual(a[key], b[key])) {
      return false
    }
  }

  return true
}
