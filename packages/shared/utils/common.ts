export function generateRandomDecimal(
  min: number,
  max: number,
  decimalPlaces: number,
): number {
  const randomNum = Math.random() * (max - min) + min
  const multiplier = Math.pow(10, decimalPlaces)
  return Math.round(randomNum * multiplier) / multiplier
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
