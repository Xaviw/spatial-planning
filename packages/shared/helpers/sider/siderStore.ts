import { getSider } from '@sp/shared/apis'
import { isEqual, modal } from '@sp/shared/utils'
import type { SiderItem } from '#/business'

export const useSiderStore = defineStore('sider', () => {
  const list = ref<{ left: SiderItem[]; right: SiderItem[] }>({
    left: [],
    right: [],
  })

  const loading = ref(false)

  const selectedItem = ref<SiderItem>()

  const selectedMenu = ref<string>()

  const { canRedo, canUndo, clear, redo, undo, history } = useRefHistory(list, {
    deep: true,
  })

  function getList(menuId: string) {
    loading.value = true

    const leftEvent = getSider({
      filter: false,
      menuId,
      position: 'left',
    }).send()

    const rightEvent = getSider({
      filter: false,
      menuId,
      position: 'right',
    }).send()

    Promise.all([leftEvent, rightEvent])
      .then(([left, right]) => {
        list.value.left = left
        list.value.right = right
        nextTick(clear)
      })
      .finally(() => {
        loading.value = false
      })
  }

  async function edit(item: SiderItem) {
    if (selectedItem.value) {
      if (item.id === selectedItem.value.id) return
      const data = await formBarEl.value!.getData()
      if (!isEqual(data, selectedItem)) {
        await modal('confirm', {
          title: '提示！',
          content: '您有正在编辑的组件还未保存，是否直接切换？',
          okText: '切换',
        })
      }
    }
    selectedItem.value = item
  }

  return {
    list,
    getList,
    loading,
    canRedo,
    canUndo,
    clear,
    redo,
    undo,
    history,
    selectedItem,
    selectedMenu,
    edit,
  }
})
