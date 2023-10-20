/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  type Nullable<T> = T | null
  type Recordable<T = any> = Record<string, T>
  type ReadonlyRecordable<T = any> = {
    readonly [key: string]: T
  }

  interface Window {
    WIDGET: object
  }
}

export interface Sider {
  id: string
  componentType: string
  componentProps: Recordable
  relationMenu: string[]
}
