const materialModules: Record<string, any> = import.meta.glob(
  './**/index.vue',
  {
    eager: true,
    import: 'default',
  },
)
const materials: Record<string, any> = {}
for (const path in materialModules) {
  const name = /^.*\/(.*?)\/index.vue$/.exec(path)?.[1]
  if (name) {
    materials[name] = materialModules[path]
  }
}

const formModules: Record<string, any> = import.meta.glob('./**/form.vue', {
  eager: true,
  import: 'default',
})
const materialForms: Record<string, any> = {}
for (const path in formModules) {
  const name = /^.*\/(.*?)\/form.vue$/.exec(path)?.[1]
  if (name) {
    materialForms[name] = formModules[path]
  }
}

export { materials, materialForms }
