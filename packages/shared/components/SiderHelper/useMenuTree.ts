import { useRequest } from 'alova'
import { ref } from 'vue'
import { getMenu } from '../../apis'
import type { MenuItem } from '#/request'

export function useMenuTree() {
  const menuSearchValue = ref<string>()
  const selectedMenu = ref<string>()

  const { data: menuData, send: sendMenu } = useRequest(
    () => getMenu(true, 'message'),
    {
      initialData: [],
    },
  )

  function onMenuDropdown(open: boolean) {
    if (!open) return
    if (!menuData.value.length) {
      sendMenu()
    }
  }

  function onMenuFilter(val: string, node: MenuItem) {
    return node.name.includes(val)
  }

  return {
    menuSearchValue,
    selectedMenu,
    menuData,
    onMenuDropdown,
    onMenuFilter,
  }
}
