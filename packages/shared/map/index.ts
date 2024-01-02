import { capitalize } from 'lodash-es'
import BaseForm from './baseForm.vue'
import type { RadioGroupChildOption } from 'ant-design-vue/es/radio/Group'
import type { InjectionKey, Ref } from 'vue'

const overlayModules: Record<string, any> = import.meta.glob('./**/index.vue', {
  eager: true,
  import: 'default',
})
const overlays: Record<string, any> = {}
for (const path in overlayModules) {
  const name = /^.*\/(.*?)\/index.vue$/.exec(path)?.[1]
  if (name) {
    overlays[capitalize(name)] = overlayModules[path]
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
    overlayForms[capitalize(name)] = formModules[path]
  }
}

export const layerOptionsKey: InjectionKey<Ref<RadioGroupChildOption[]>> =
  Symbol('layer-options-key')

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
export { BaseForm, overlays, overlayForms }
