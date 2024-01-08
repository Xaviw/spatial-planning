import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/config',
    method: 'get',
    timeout: 1000,
    statusCode: 200,
    response: () => ({
      code: 1,
      data: {},
      message: 'ok',
    }),
  },
  {
    url: '/api/config',
    method: 'post',
    timeout: 1000,
    statusCode: 200,
    response: () => ({
      code: 1,
      data: true,
      message: 'ok',
    }),
  },
] as MockMethod[]
