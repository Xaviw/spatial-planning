import { getMenu as getMenuApi } from '@sp/shared'
import { message } from 'ant-design-vue'
import { Menu } from '#/client'

export const useMenuStore = defineStore('menu', () => {
  const menu = ref<Menu[]>([])

  const menuIds = ref<string[]>()

  getMenuApi()
    .then(res => (menu.value = res))
    .catch(() => {
      message.error('菜单获取失败，请尝试刷新页面！')
    })

  function setMenuId(id: string) {
    menuIds.value = [id]
  }

  function getFirstMenu(data: Menu[] = menu.value) {
    if (data[0].children?.length) {
      return getFirstMenu(data[0].children)
    }
    return data[0].key
  }

  function isIncluded(key: string) {
    const queue: Menu[] = []

    for (const menuItem of menu.value) {
      queue.push(menuItem)

      while (queue.length) {
        const current = queue.shift() as Menu
        if (current.key === key) return true
        if (current.children?.length) {
          queue.push(...current.children)
        }
      }
    }

    return false
  }

  return { menu, menuIds, setMenuId, getFirstMenu, isIncluded }
})
