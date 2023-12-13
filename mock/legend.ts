import Mock from 'mockjs'
import type { LegendItem, LegendTypeItem } from '../types/request'
import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/legendType/showSingle',
    method: 'get',
    timeout: 1000,
    statusCode: 200,
    response: () => {
      return {
        code: 1,
        data: Mock.Random.boolean(),
        message: 'ok',
      }
    },
  },
  {
    url: '/api/legendType/showSingle',
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
    url: '/api/legendType',
    method: 'get',
    timeout: 1000,
    statusCode: 200,
    response: () => {
      const data: LegendTypeItem[] = [
        { id: 'a', name: '图例A' },
        { id: 'b', name: '图例B' },
        { id: 'c', name: '图例C' },
      ]

      return {
        code: 1,
        data,
        message: 'ok',
      }
    },
  },
  {
    url: '/api/legendType',
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
    url: '/api/legendType',
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
    url: '/api/legendType',
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
    url: '/api/legendType/move',
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

  {
    url: '/api/legend',
    method: 'get',
    timeout: 1000,
    statusCode: 200,
    response: () => {
      const typeData: LegendTypeItem[] = [
        { id: 'a', name: '图例A' },
        { id: 'b', name: '图例B' },
        { id: 'c', name: '图例C' },
      ]

      const data: LegendItem[] = Array.from({
        length: Mock.Random.integer(10, 20),
      }).map(() => ({
        id: Mock.Random.id(),
        type: typeData[Mock.Random.integer(0, 2)],
        name: Mock.Random.cword(),
        img: Mock.Random.image(),
      }))

      return {
        code: 1,
        data,
        message: 'ok',
      }
    },
  },
  {
    url: '/api/legend',
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
    url: '/api/legend',
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
    url: '/api/legend',
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
    url: '/api/legend/move',
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
