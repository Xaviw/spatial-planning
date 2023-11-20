import { unref } from 'vue'
import { createLoading } from '../components/Loading/createLoading'
import type { LoadingProps } from '../components/Loading/index.vue'
import type { Ref } from 'vue'

export interface UseLoadingOptions {
  target?: any
  props?: Partial<LoadingProps>
}

interface Fn {
  (): void
}

export function useLoading(
  props?: Partial<LoadingProps>,
): [Fn, Fn, (tip: string) => void]
export function useLoading(
  opt?: Partial<UseLoadingOptions>,
): [Fn, Fn, (tip: string) => void]
export function useLoading(
  opt: Partial<LoadingProps> | Partial<UseLoadingOptions> = {},
): [Fn, Fn, (tip: string) => void] {
  let props: Partial<LoadingProps>
  let target: HTMLElement | Ref<Nullable<HTMLElement>> = document.body

  if (Reflect.has(opt, 'target') || Reflect.has(opt, 'props')) {
    const options = opt as Partial<UseLoadingOptions>
    props = options.props || {}
    target = options.target || document.body
  } else {
    props = opt as Partial<LoadingProps>
    target = document.body
  }

  const instance = createLoading(props, undefined, true)

  const open = (): void => {
    const t = unref(target as Ref<Nullable<HTMLElement>>)
    if (!t) return
    instance.open(t)
  }

  const close = (): void => {
    instance.close()
  }

  const setTip = (tip: string) => {
    instance.setTip(tip)
  }

  return [open, close, setTip]
}
