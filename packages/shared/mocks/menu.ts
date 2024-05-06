import { defineMock } from '@alova/mock'
import { Random } from 'mockjs'
import type { MenuItem } from '#/business'

export default defineMock({
  '/menu': () => {
    const data: MenuItem[] = [
      {
        id: '1',
        parentId: null,
        name: '工作组',
        status: true,
        sort: 1,
        createTime: Random.datetime('yyyy/MM/dd HH:mm:ss'),
        updateTime: Random.datetime('yyyy/MM/dd HH:mm:ss'),
        children: [
          {
            id: '11',
            parentId: '1',
            createTime: Random.datetime('yyyy/MM/dd HH:mm:ss'),
            updateTime: Random.datetime('yyyy/MM/dd HH:mm:ss'),
            name: '工作组1',
            status: true,
            sort: 1,
          },
          {
            id: '12',
            parentId: '1',
            createTime: Random.datetime('yyyy/MM/dd HH:mm:ss'),
            updateTime: Random.datetime('yyyy/MM/dd HH:mm:ss'),
            name: '工作组2',
            status: true,
            sort: 2,
            children: [
              {
                id: '121',
                parentId: '12',
                createTime: Random.datetime('yyyy/MM/dd HH:mm:ss'),
                updateTime: Random.datetime('yyyy/MM/dd HH:mm:ss'),
                name: '工作组2-1',
                status: true,
                sort: 1,
              },
              {
                id: '122',
                parentId: '12',
                createTime: Random.datetime('yyyy/MM/dd HH:mm:ss'),
                updateTime: Random.datetime('yyyy/MM/dd HH:mm:ss'),
                name: '工作组2-2',
                status: true,
                sort: 2,
              },
            ],
          },
          {
            id: '13',
            parentId: '1',
            createTime: Random.datetime('yyyy/MM/dd HH:mm:ss'),
            updateTime: Random.datetime('yyyy/MM/dd HH:mm:ss'),
            name: '工作组3',
            status: true,
            sort: 3,
          },
        ],
      },
    ]

    return {
      code: 1,
      data,
      message: 'ok',
    }
  },
  '[POST]/menu': () => {
    return {
      code: 1,
      data: Random.id(),
      message: 'ok',
    }
  },
  '[PUT]/menu/{id}': () => {
    return {
      code: 1,
      data: true,
      message: 'ok',
    }
  },
  '[DELETE]/menu/{id}': () => {
    return {
      code: 1,
      data: true,
      message: 'ok',
    }
  },
  '[POST]/menu/move/{id}': () => {
    return {
      code: 1,
      data: true,
      message: 'ok',
    }
  },
})
