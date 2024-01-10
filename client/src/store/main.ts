import { getMap, getMenu, getSider } from '@sp/shared/apis'
import { useRequest } from 'alova'
import { Modal } from 'ant-design-vue'
import { h } from 'vue'
import type { MenuItem, HandledMenu } from '#/business'

console.log('mainStore')
export const useMainStore = defineStore('main', () => {
  // -------------------------加载菜单-------------------------
  const menuData = ref()
  const keysMap = ref<Map<string, HandledMenu>>(new Map())
  const selectedKeys = ref<string[]>([])

  const {
    loading: menuLoading,
    send: sendMenu,
    onSuccess: onMenuSuccess,
    onError: onMenuError,
  } = useRequest(getMenu(true), { initialData: [] })

  onMenuError(() => {
    Modal.confirm({
      title: '菜单请求失败！',
      content: '是否尝试重新获取菜单？',
      centered: true,
      keyboard: false,
      maskClosable: false,
      icon: h('span', {
        class: 'i-ant-design:close-circle-filled anticon',
        style: {
          color: '#ff4d4f',
          flex: 'none',
          marginInlineEnd: '12px',
          fontSize: '22px',
        },
      }),
      cancelButtonProps: {
        ghost: true,
      },
      onOk: sendMenu,
    })
  })

  onMenuSuccess(({ data }) => {
    menuData.value = transformMenu(data)
  })

  // -------------------------边栏数据-------------------------
  const {
    data: leftData,
    loading: leftLoading,
    send: sendLeft,
  } = useRequest(
    (menuId: string) => getSider({ menuId, filter: true, position: 'left' }),
    { initialData: [], immediate: false },
  )

  const {
    data: rightData,
    loading: rightLoading,
    send: sendright,
  } = useRequest(
    (menuId: string) => getSider({ menuId, filter: true, position: 'right' }),
    { initialData: [], immediate: false },
  )

  // -------------------------地图数据-------------------------
  const {
    data: mapData,
    loading: mapLoading,
    send: sendMap,
  } = useRequest((menuId: string) => getMap(menuId, true), {
    immediate: false,
    initialData: [],
  })

  // -------------------------菜单加载完成后监听路由-------------------------
  const route = useRoute()
  const router = useRouter()

  watch(
    [menuData, () => route.params.id as string],
    ([menuData, paramsId]) => {
      if (
        !menuData?.length ||
        paramsId === selectedKeys.value[selectedKeys.value.length - 1]
      )
        return

      const item = keysMap.value.get(paramsId)

      // 没有选择菜单或菜单key错误时，切换到第一个菜单
      if (!paramsId || !item) {
        const firstMenu = getFirstMenu()
        setSelectMenu(firstMenu)
        router.replace('/' + firstMenu.key)
      } else {
        setSelectMenu(item)
      }
    },
    { immediate: true },
  )

  // ----------------------选中菜单后加载数据并设置标题----------------------
  function setSelectMenu(item: HandledMenu) {
    sendLeft(item.key)
    sendright(item.key)
    sendMap(item.key)
    selectedKeys.value = item.keys
    menuData.value[item.index].label = item.labels.join('-')
  }

  // 从地图数据中获取第一个菜单
  function getFirstMenu(data: HandledMenu[] = menuData.value) {
    if (data[0].children?.length) {
      return getFirstMenu(data[0].children)
    }
    return data[0]
  }

  // 处理菜单数组格式，并记录全部key
  function transformMenu(
    data: MenuItem[],
    parentData: Pick<HandledMenu, 'keys' | 'labels'> = {
      keys: [],
      labels: [],
    },
    index?: number,
  ) {
    return data.map((item, i) => {
      const handledMenu = {
        key: item.id,
        label: item.name,
        index: index ?? i,
        keys: [...parentData.keys, item.id],
        labels: [...parentData.labels, item.name],
      } as HandledMenu

      handledMenu.children = item.children?.length
        ? transformMenu(item.children, handledMenu, index ?? i)
        : undefined

      if (!item.children?.length) {
        keysMap.value.set(item.id, handledMenu)
      }

      return handledMenu
    })
  }

  return {
    menuLoading,
    leftLoading,
    leftData,
    rightLoading,
    rightData,
    setSelectMenu,
    selectedKeys,
    menuData,
    mapData,
    mapLoading,
  }
})
