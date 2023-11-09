/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TITLE: string
  readonly VITE_MOCK_ENABLE: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  /** 天气组件配置 */
  WIDGET: object
}

type Nullable<T> = T | null

type Recordable<T = any> = Record<string, T>

type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T
}
