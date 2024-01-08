import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/config',
    method: 'get',
    timeout: 1000,
    statusCode: 200,
    response: () => ({
      code: 1,
      data: {
        scalebar: true,
        scalebarPosition: [null, 5, null, 5],
        toolbar: true,
        toolbarPosition: [null, null, 5, 5],
        controlbar: true,
        controlbarPosition: [37, null, 5, null],
      },
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
