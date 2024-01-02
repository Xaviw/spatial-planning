const componentModules: Record<string, any> = import.meta.glob(
  './**/index.vue',
  {
    eager: true,
    import: 'default',
  },
)
const components: Record<string, any> = {}
for (const path in componentModules) {
  const name = /^.*\/(.*?)\/index.vue$/.exec(path)?.[1]
  if (name) {
    components[name] = componentModules[path]
  }
}

const formModules: Record<string, any> = import.meta.glob('./**/form.vue', {
  eager: true,
  import: 'default',
})
const componentForms: Record<string, any> = {}
for (const path in formModules) {
  const name = /^.*\/(.*?)\/form.vue$/.exec(path)?.[1]
  if (name) {
    componentForms[name] = formModules[path]
  }
}

export { components, componentForms }
