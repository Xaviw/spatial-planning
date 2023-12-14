import { Loading } from '@sp/shared/components'
import { createVNode, render } from 'vue'

export interface UseLoadingOptions {
  target?: any
  props?: Partial<LoadingProps>
}

export interface LoadingProps {
  tip?: string
  size?: 'small' | 'default' | 'large'
  absolute?: boolean
  loading?: boolean
  background?: string
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

function createLoading(
  props?: Partial<LoadingProps>,
  target?: HTMLElement,
  wait = false,
) {
  let vm: Nullable<VNode> = null
  const data = reactive({
    tip: '',
    loading: true,
    ...props,
  })

  const LoadingWrap = defineComponent({
    render() {
      return h(Loading, { ...data })
    },
  })

  vm = createVNode(LoadingWrap)

  if (wait) {
    setTimeout(() => {
      render(vm, document.createElement('div'))
    }, 0)
  } else {
    render(vm, document.createElement('div'))
  }

  function close() {
    if (vm?.el && vm.el.parentNode) {
      vm.el.parentNode.removeChild(vm.el)
    }
  }

  function open(target: HTMLElement = document.body) {
    if (!vm || !vm.el) {
      return
    }
    target.appendChild(vm.el as HTMLElement)
  }

  if (target) {
    open(target)
  }
  return {
    vm,
    close,
    open,
    setTip: (tip: string) => {
      data.tip = tip
    },
    setLoading: (loading: boolean) => {
      data.loading = loading
    },
    get loading() {
      return data.loading
    },
    get $el() {
      return vm?.el as HTMLElement
    },
  }
}
