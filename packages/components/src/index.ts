import _JSXButton from './JSXButton/index'
import _SFCButton from './SFCButton/index.vue'
import type { App, Plugin } from 'vue'

type WithInstall<T> = T & Plugin

const withInstall = <T>(comp: T) => {
  ;(comp as WithInstall<T>).install = (app: App) => {
    const name = (comp as any).name
    app.component(name, comp as WithInstall<T>)
  }
  return comp as WithInstall<T>
}

export const JSXButton = withInstall(_JSXButton)
export const SFCButton = withInstall(_SFCButton)
