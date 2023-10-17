import 'virtual:uno.css'

import { App } from 'vue'

import * as components from './src'

export * from './src'

export default {
  install: (app: App) => {
    for (const component in components) {
      app.use(components[component])
    }
  },
}
