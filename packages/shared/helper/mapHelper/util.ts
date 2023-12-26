import { toRawValue } from '@sp/shared/utils'
import { cloneDeep, isObject, isString, isSymbol } from 'lodash-es'

const proxyMap: WeakMap<object, any> = new WeakMap()

/** 创建响应式覆盖物 */
export function createReactiveOverlay<T extends object>(
  /** 覆盖物配置 */
  config: T,
  /** 覆盖物属性变动时对应触发的方法 */
  handlers: Record<string, Fn<[any, any], void>>,
) {
  const source = cloneDeep(toRawValue(config))

  const proxy = createReactiveObject(source, handlers)

  /** 手动调整覆盖物时同步原数据以及代理对象，只会处理一级属性 */
  function replaceSource(config: Partial<T>) {
    for (const key in config) {
      source[key] = config[key] as any
    }
  }

  return { proxy, replaceSource }
}

/** 创建响应式对象 */
function createReactiveObject<T>(
  target: T,
  handlers: Record<string, Fn<[any, any], void>>,
  /** 标记变动属于哪个第一层属性，深层次属性触发第一层属性的处理事件 */
  parentKey?: string,
): T {
  // 如果是vue响应式对象，解包
  target = toRawValue(target)

  // 非对象，或已响应式处理，直接返回
  if (!isObject(target) || (target as any).__ro) {
    return target
  }

  // 该对象已处理过，返回缓存的代理对象
  const existingProxy = proxyMap.get(target)
  if (existingProxy) {
    return existingProxy
  }

  // 生成proxy
  const proxy = new Proxy(target, {
    get(target, key, receiver) {
      // 已处理过的代理对象，标记__ro
      if (key === '__ro') {
        return true
      }

      // 如果是vue响应式对象，解包
      const res = toRawValue(Reflect.get(target, key, receiver))

      // key是symbol时，直接返回
      if (isSymbol(key)) {
        return res
      }

      const realParentKey = parentKey || key

      // 没有对应处理函数的属性，直接返回
      if (!Object.keys(handlers).includes(realParentKey)) {
        return res
      }

      // 获取时再创建子代理对象
      if (isObject(res)) {
        return createReactiveObject(res, handlers, realParentKey)
      }
      return res
    },
    set(target, key, value, receiver) {
      const res = Reflect.set(target, key, value, receiver)
      const realParentKey = parentKey || key
      // 关键数据或关键数据属性修改时触发操作
      if (isString(realParentKey) && handlers[realParentKey]) {
        handlers[realParentKey](value, proxy)
      }
      return res
    },
  })

  // 缓存
  proxyMap.set(target, proxy)

  return proxy
}
