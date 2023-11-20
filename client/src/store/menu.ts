import { getMenu as getMenuApi, getSider } from '@sp/shared/apis'
import { useLoading } from '@sp/shared/hooks'
import { useFetcher } from 'alova'
import { Modal } from 'ant-design-vue'
import { createVNode } from 'vue'
import { Menu } from '#/client'

export interface HandledMenu extends Menu {
  index: number
  keys: string[]
  labels: string[]
  children?: HandledMenu[]
}

export const useMenuStore = defineStore('menu', () => {
  const menu = ref<HandledMenu[]>([])

  const selectedKeys = ref<string[]>([])

  const keysMap = ref<Map<string, HandledMenu>>(new Map())

  const { fetch } = useFetcher()

  onMounted(() => {
    const [openLoading, closeLoading] = useLoading()
    setTimeout(() => {
      getMenu(openLoading, closeLoading)
    })
  })

  function setSelectMenu(item: HandledMenu) {
    selectedKeys.value = item.keys
    menu.value[item.index].label = item.labels.join('-')
  }

  // 处理菜单数组格式，并记录全部key
  function transformMenu(
    data: Menu[],
    parentData: Pick<HandledMenu, 'keys' | 'labels'> = {
      keys: [],
      labels: [],
    },
    index?: number,
  ) {
    return data.map((item, i) => {
      const handledMenu = {
        ...item,
        index: index ?? i,
        keys: [...parentData.keys, item.key],
        labels: [...parentData.labels, item.label],
      } as HandledMenu

      handledMenu.children = item.children?.length
        ? transformMenu(item.children, handledMenu, index ?? i)
        : undefined

      keysMap.value.set(item.key, handledMenu)

      fetch(getSider('left', item.key))
      fetch(getSider('right', item.key))

      return handledMenu
    })
  }

  function getFirstMenu(data: HandledMenu[] = menu.value) {
    if (data[0].children?.length) {
      return getFirstMenu(data[0].children)
    }
    return data[0]
  }

  function getMenu(openLoading: () => void, closeLoading: () => void) {
    openLoading()
    getMenuApi()
      .send()
      .then(res => {
        menu.value = transformMenu(res)
      })
      .catch(() => {
        Modal.confirm({
          title: '菜单请求失败！',
          content: '是否尝试重新获取菜单？',
          centered: true,
          keyboard: false,
          maskClosable: false,
          icon: createVNode('span', {
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
          onOk: () => {
            getMenu(openLoading, closeLoading)
          },
        })
      })
      .finally(() => {
        closeLoading()
      })
  }

  return {
    menu,
    selectedKeys,
    keysMap,
    setSelectMenu,
    getFirstMenu,
  }
})
