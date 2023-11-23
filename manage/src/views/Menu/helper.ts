import type { MenuItem } from '#/client'

export function loop(
  data: MenuItem[],
  key: string,
  callback: (
    item: MenuItem,
    index: number,
    data: MenuItem[],
    parent?: MenuItem,
  ) => void,
  parent?: MenuItem,
) {
  data.forEach((item, index) => {
    if (item.id === key) {
      return callback(item, index, data, parent)
    }
    if (item.children?.length) {
      return loop(item.children, key, callback, item)
    }
  })
}

export function remove(treeData: MenuItem[], id: string) {
  loop(treeData, id, (_item, index, data) => {
    data.splice(index, 1)
  })
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
    loop(treeData, oldParent, item => {
      node = item.children![oldIndex]
      item.children?.splice(oldIndex, 1)
    })
  } else {
    node = treeData[oldIndex]
    treeData.splice(oldIndex, 1)
  }

  if (!node) {
    throw new Error('未获取到拖拽节点！')
  }

  if (currentParent) {
    loop(treeData, currentParent, item => {
      item.children = item.children || []
      item.children.splice(currentIndex, 0, node!)
    })
  } else {
    treeData.splice(currentIndex, 0, node)
  }
}

export function update(treeData: MenuItem[], data: MenuItem) {
  loop(treeData, data.id, (item, index, arr) => {
    arr[index] = { ...item, ...data }
  })
}

export function add(treeData: MenuItem[], data: MenuItem) {
  if (!data.parentId) {
    treeData.push(data)
  } else {
    loop(treeData, data.parentId, item => {
      item.children = item.children || []
      item.children.push(data)
    })
  }
}
