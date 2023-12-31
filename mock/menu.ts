import Mock from 'mockjs'
import type { MenuItem } from '../types/business'
import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/menu',
    method: 'get',
    timeout: 1000,
    statusCode: 200,
    response: () => {
      const data: MenuItem[] = [
        {
          id: '1',
          parentId: null,
          name: '工作组',
          status: true,
          sort: 1,
          createTime: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
          updateTime: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
          children: [
            {
              id: '11',
              parentId: '1',
              createTime: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
              updateTime: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
              name: '工作组1',
              status: true,
              sort: 1,
            },
            {
              id: '12',
              parentId: '1',
              createTime: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
              updateTime: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
              name: '工作组2',
              status: true,
              sort: 2,
              children: [
                {
                  id: '121',
                  parentId: '12',
                  createTime: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
                  updateTime: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
                  name: '工作组2-1',
                  status: true,
                  sort: 1,
                },
                {
                  id: '122',
                  parentId: '12',
                  createTime: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
                  updateTime: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
                  name: '工作组2-2',
                  status: true,
                  sort: 2,
                },
              ],
            },
            {
              id: '13',
              parentId: '1',
              createTime: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
              updateTime: Mock.Random.datetime('yyyy/MM/dd HH:mm:ss'),
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
  },
  {
    url: '/api/menu',
    method: 'post',
    timeout: 1000,
    statusCode: 200,
    response: () => {
      return {
        code: 1,
        data: Mock.Random.id(),
        message: 'ok',
      }
    },
  },
  {
    url: '/api/menu',
    method: 'put',
    timeout: 1000,
    statusCode: 200,
    response: () => {
      return {
        code: 1,
        data: true,
        message: 'ok',
      }
    },
  },
  {
    url: '/api/menu',
    method: 'delete',
    timeout: 1000,
    statusCode: 200,
    response: () => {
      return {
        code: 1,
        data: true,
        message: 'ok',
      }
    },
  },
  {
    url: '/api/menu/move',
    method: 'post',
    timeout: 1000,
    statusCode: 200,
    response: () => {
      return {
        code: 1,
        data: true,
        message: 'ok',
      }
    },
  },
] as MockMethod[]
