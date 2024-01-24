export const useSiderStore = defineStore('sider', () => {
  const list = ref<{ left: SiderItem[]; right: SiderItem[] }>({
    left: [],
    right: [],
  })

  const { loading: leftLoading, send: sendLeft } = useRequest(
    (menuId: string) => getSider({ menuId, position: 'left', filter: false }),
    { immediate: false },
  )

  const { loading: rightLoading, send: sendRight } = useRequest(
    (menuId: string) => getSider({ menuId, position: 'right', filter: false }),
    { immediate: false },
  )

  const { canRedo, canUndo, clear, redo, undo, history } = useRefHistory(list, {
    deep: true,
  })

  const loading = computed(
    () => leftLoading.value || rightLoading.value || submitLoading.value,
  )

  const selectedItem = ref<SiderItem>()

  const selectedMenu = ref<string>()
})
