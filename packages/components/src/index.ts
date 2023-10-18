import _JSXButton from './JSXButton/index'
import _SFCButton from './SFCButton/index.vue'
import type { App, Plugin, Component } from 'vue'

export type WithInstall<T> = T & Plugin

const withInstall = <T extends Component>(component: T) => {
  ;(component as WithInstall<T>).install = (app: App) => {
    const name = component.name
    if (!name) return
    app.component(name, component)
  }
  return component as WithInstall<T>
}

export const JSXButton = withInstall(_JSXButton)
export const SFCButton = withInstall(_SFCButton)
