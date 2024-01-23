/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TITLE: string
  readonly VITE_MOCK_ENABLE: boolean
  readonly VITE_API_BASE: string
  readonly VITE_AMAP_KEY: string
  readonly VITE_AMAP_SECURITY_KEY: string
  readonly VITE_STATIC_PATH: string
  readonly VITE_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  /** 天气组件配置 */
  WIDGET: object
  /** 高德地图key */
  _AMapSecurityConfig: { securityJsCode: string }
}

type ValueTypes<T> = T[keyof T]

type Nullable<T> = T | null

type Recordable<T = any> = Record<string, T>

type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T
}

type Fn<P extends any[] = any[], R = any> = (...args: P) => R

type EmptyFn = () => void

type ComponentExposed<T> = T extends new () => infer E
  ? E
  : T extends (
      props: any,
      ctx: any,
      expose: (exposed: infer E) => any,
      ...args: any
    ) => any
  ? NonNullable<E>
  : NonNullable<unknown>
