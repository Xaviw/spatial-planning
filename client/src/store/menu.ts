import { getMenu as getMenuApi, getSider } from '@sp/shared/apis'
import { useFetcher } from 'alova'
import { message } from 'ant-design-vue'
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

  getMenuApi()
    .send()
    .then(res => {
      menu.value = transformMenu(res)
    })
    .catch(() => {
      message.error('菜单获取失败，请尝试刷新页面！')
    })

  const { fetch } = useFetcher()

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

  return {
    menu,
    selectedKeys,
    keysMap,
    setSelectMenu,
    getFirstMenu,
  }
})
