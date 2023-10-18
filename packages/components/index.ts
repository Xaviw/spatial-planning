import 'virtual:uno.css'

import * as components from './src'
import type { WithInstall } from './src'
import type { App, Component } from 'vue'

export * from './src'

export default {
  install: (app: App) => {
    for (const component in components) {
      app.use((components as Record<string, WithInstall<Component>>)[component])
    }
  },
}
