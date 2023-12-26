import { loopMenu } from '@sp/shared/utils'
import type { MenuItem } from '#/request'

export function remove(treeData: MenuItem[], id: string) {
  loopMenu(
    treeData,
    (_item, index, data) => {
      data.splice(index, 1)
    },
    id,
  )
}

export function move(
  treeData: MenuItem[],
  data: {
    oldIndex: number
    oldParent?: string
    currentIndex: number
    currentParent?: string
  },
) {
  const { oldIndex, oldParent, currentIndex, currentParent } = data
  let node: MenuItem | undefined

  if (oldParent) {
    loopMenu(
      treeData,
      item => {
        node = item.children![oldIndex]
        item.children?.splice(oldIndex, 1)
      },
      oldParent,
    )
  } else {
    node = treeData[oldIndex]
    treeData.splice(oldIndex, 1)
  }

  if (!node) {
    throw new Error('未获取到拖拽节点！')
  }

  if (currentParent) {
    loopMenu(
      treeData,
      item => {
        item.children = item.children || []
        item.children.splice(currentIndex, 0, node!)
      },
      currentParent,
    )
  } else {
    treeData.splice(currentIndex, 0, node)
  }
}

export function update(treeData: MenuItem[], data: MenuItem) {
  loopMenu(
    treeData,
    (item, index, arr) => {
      arr[index] = {
        ...item,
        ...data,
        updateTime: new Date().toLocaleString(),
      }
    },
    data.id,
  )
}

export function add(treeData: MenuItem[], data: MenuItem) {
  const createTime = new Date().toLocaleString(),
    updateTime = new Date().toLocaleString()
  if (!data.parentId) {
    treeData.push({
      ...data,
      createTime,
      updateTime,
    })
  } else {
    loopMenu(
      treeData,
      item => {
        item.children = item.children || []
        item.children.push({
          ...data,
          createTime,
          updateTime,
        })
      },
      data.parentId,
    )
  }
}
