import { Table } from 'ant-design-vue'
import { debounce } from 'lodash-es'
import type { MaybeRef } from 'vue'

export function useTableScroll(
  instance: MaybeRef<InstanceType<typeof Table> | null>,
) {
  // 需要一个基础高度，否则vue-draggable-plus在初始状态列表为空时无法识别到拖拽元素
  const scroll = reactive<{ y: number }>({ y: 300 })

  const getScrollY = async () => {
    await nextTick()
    const parent: HTMLDivElement = (instance as Ref<InstanceType<typeof Table>>)
      .value.$parent.$el
    const parentRect = parent.getBoundingClientRect()

    const header = parent.querySelector('thead')
    const headerRect = header!.getBoundingClientRect()

    const height = parentRect.height - headerRect.height
    if (typeof height === 'number') {
      scroll.y = height
    }
  }

  const calcFunc = debounce(getScrollY, 1000)

  onMounted(() => {
    instance = isRef(instance) ? instance : ref(instance)
    if (!instance.value) {
      throw new Error('未获取到表格容器！')
    }
    calcFunc()
    window.addEventListener('resize', calcFunc)
  })

  onUnmounted(() => {
    window.removeEventListener('resize', calcFunc)
  })

  return scroll
}
