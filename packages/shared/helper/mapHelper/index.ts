import { toRawValue } from '@sp/shared/utils'
import { isObject, isSymbol } from 'lodash-es'

const proxyMap: WeakMap<object, any> = new WeakMap()

/**
 * 创建响应式覆盖物
 */
export function reactiveOverlay<T extends object>(
  /** 覆盖物配置 */
  config: T,
  /** 覆盖物属性变动时对应触发的方法 */
  handlers: Record<string, Fn>,
  /** 无需响应式处理的属性，默认忽略extData */
  ignore: string[] = ['extData'],
) {
  const source = config

  const proxy = createReactiveObject(
    source,
    proxyMap,
    ignore,
    (target, key, value, receiver, path) => {
      const res = Reflect.set(target, key, value, receiver)
      // 数据对象本身或数据对象修改时触发操作
      if (path) {
        handlers[path]?.(value, target)
        handlers[`${path},${String(key)}`]?.(value, target)
      } else {
        handlers[String(key)]?.(value, target)
      }
      return res
    },
  )

  /** 手动调整覆盖物时同步原数据以及代理对象，只会处理一级属性 */
  function replaceSource(config: Partial<T>) {
    for (const key in config) {
      source[key] = config[key] as any
    }
  }

  return { proxy, replaceSource }
}

function createReactiveObject<T>(
  target: T,
  proxyMap: WeakMap<object, any>,
  ignore: string[],
  handler: (
    target: any,
    p: string | symbol,
    newValue: any,
    receiver: any,
    path?: string,
  ) => boolean,
  parentPath?: string,
): T {
  // 如果是vue响应式对象，解包
  target = toRawValue(target)

  // 非对象，或已响应式处理，直接返回
  if (!isObject(target) || (target as unknown as Recordable).__ro) {
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
      // 如果是vue响应式对象，解包
      const res = toRawValue(Reflect.get(target, key, receiver))

      // key是symbol或内置对象时，直接返回
      if (isSymbol(key) || key === '__proto__') {
        return res
      }

      const currentPath = parentPath ? `${parentPath},${key}` : key

      // 忽略ignore传入的属性
      if (ignore.includes(currentPath)) {
        return res
      }

      // 获取时再创建子代理对象
      if (isObject(res)) {
        return createReactiveObject(res, proxyMap, ignore, handler, currentPath)
      }
      return res
    },
    set(target, key, value, receiver) {
      return handler(target, key, value, receiver, parentPath)
    },
  })

  // 缓存
  proxyMap.set(target, proxy)

  return proxy
}

export const commonLayerHandler = (
  instance: Loca.Layer,
): Record<string, (value: any, source: any) => void> => ({
  opacity(value) {
    instance.setOpacity(value)
  },
  zIndex(value) {
    instance.setzIndex(value)
  },
  zooms(_value, source) {
    instance.setZooms(source.zooms || [2, 20])
  },
  visible(value) {
    if (value) {
      instance.show()
    } else {
      instance.hide()
    }
  },
  source(_value, source) {
    console.log('source.source: ', source.source)
    instance.setSource(new Loca.GeoJSONSource(source.source))
  },
})
