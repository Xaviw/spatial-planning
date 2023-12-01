/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TITLE: string
  readonly VITE_MOCK_ENABLE: boolean
  readonly VITE_AMAP_KEY: string
  readonly VITE_AMAP_SECURITY_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  /** 天气组件配置 */
  WIDGET: object
  /** 高德地图key */
  _AMapSecurityConfig: { securityJsCode: string }
  /** 高德UI库 */
  Loca: any
}

type Nullable<T> = T | null

type Recordable<T = any> = Record<string, T>

type ReadonlyRecordable<T = any> = {
  readonly [key: string]: T
}
