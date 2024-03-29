import { getMenu } from '@sp/shared/apis'
import { loop } from '@sp/shared/utils'
import { useRequest } from 'alova'
import { clone } from 'ramda'
import { ref } from 'vue'
import type { MenuItem } from '#/business'

export function useMenuTree(disableParent: boolean = true) {
  const menuSearchValue = ref<string>()
  const selectedMenu = ref<string>()

  const {
    data: menuData,
    send: sendMenu,
    onSuccess,
  } = useRequest(() => getMenu(true, 'message'), {
    initialData: [],
  })

  onSuccess(({ data }) => {
    if (!selectedMenu.value) return
    // 刷新时若已选择的菜单被删除，清除已选择
    let flag = true
    loop(
      data,
      'id',
      'children',
      () => {
        flag = false
      },
      selectedMenu.value,
    )
    if (flag) {
      selectedMenu.value = undefined
    }
  })

  const transformData = computed(() => {
    const data = clone(menuData.value) as (MenuItem & {
      disabled?: boolean
    })[]
    loop(data, 'id', 'children', item => {
      if (item.children?.length) {
        ;(item as MenuItem & { disabled: boolean }).disabled = true
      }
    })
    return data
  })

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
    menuData: disableParent ? transformData : menuData,
    onMenuDropdown,
    onMenuFilter,
    sendMenu,
  }
}
