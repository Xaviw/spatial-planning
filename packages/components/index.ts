import { Component } from 'vue'
import '../../unocss-icon'

const modules: Record<string, Component> = import.meta.glob(
  ['./src/*.vue', './src/**/index.vue'],
  {
    eager: true,
    import: 'default',
  },
)

const components: Record<string, Component> = {}

for (const path in modules) {
  let name
  if (path.endsWith('index.vue')) {
    name = /^.*\/(.*?)\/index.vue$/.exec(path)?.[1]
  } else {
    name = modules[path].name || /^\.\/src\/(.*)\.vue$/.exec(path)?.[1]
  }
  if (!name) continue
  components[name] = modules[path]
}

export default components
