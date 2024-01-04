const overlayModules: Record<string, any> = import.meta.glob('./**/index.vue', {
  eager: true,
  import: 'default',
})
const overlays: Record<string, any> = {}
for (const path in overlayModules) {
  const name = /^.*\/(.*?)\/index.vue$/.exec(path)?.[1]
  if (name) {
    overlays[name[0].toUpperCase() + name.slice(1)] = overlayModules[path]
  }
}

const formModules: Record<string, any> = import.meta.glob('./**/form.vue', {
  eager: true,
  import: 'default',
})
const overlayForms: Record<string, any> = {}
for (const path in formModules) {
  const name = /^.*\/(.*?)\/form.vue$/.exec(path)?.[1]
  if (name) {
    overlayForms[name[0].toUpperCase() + name.slice(1)] = formModules[path]
  }
}

export const overlayOptions = [
  { label: '标记点', value: 'Marker' },
  { label: '折线', value: 'Polyline' },
  { label: '曲线', value: 'BezierCurve' },
  { label: '多边形', value: 'Polygon' },
  { label: '矩形', value: 'Rectangle' },
  { label: '圆形', value: 'Circle' },
  { label: '椭圆形', value: 'Ellipse' },
  { label: '文本', value: 'Text' },
  { label: '贴图', value: 'Image' },
]

export * from './utils'
export * from './mapStore'
export { overlays, overlayForms }
