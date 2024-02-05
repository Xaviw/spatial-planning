import { defineMock } from '@alova/mock'
import mockjs from 'mockjs'

export default defineMock({
  '[POST]/user/login': ({ data: { name, password } }) => {
    if (name !== 'admin' || password !== '123456') {
      return {
        status: 400,
        statusText: 'OK',
        body: {
          code: 0,
          message: '用户名或密码错误！',
        },
      }
    }

    return {
      status: 200,
      statusText: 'OK',
      responseHeaders: {
        'Access-Token':
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwYXNzd29yZCI6ImUxMGFkYzM5NDliYTU5YWJiZTU2ZTA1N2YyMGY4ODNlIiwiaWQiOiIwOGFlNTkxMy1mYTQxLTRmNWQtOTVhNy1hMDRmYzE1NjZjMDUiLCJuYW1lIjoiYWRtaW4iLCJpYXQiOjE3MDcwMTYwODEsImV4cCI6MTcwNzAxOTY4MX0.OGhtFZQjxNAEPWBl9D2PCZ5JNvz2X0X19__7SlEVcs4',
        'Refresh-Token':
          'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjA4YWU1OTEzLWZhNDEtNGY1ZC05NWE3LWEwNGZjMTU2NmMwNSIsImlhdCI6MTcwNzAxNjA4MSwiZXhwIjoxNzA3NjIwODgxfQ.mOKnsM5xNvPo-1wIN5wy-d28LvGBtUzz1QwQV5GkU1M',
      },
      body: {
        code: 1,
        data: {
          id: mockjs.Random.id(),
          name: mockjs.Random.name(),
        },
        message: 'ok',
      },
    }
  },
  '[PUT]/user/{id}': () => {
    return {
      code: 1,
      message: 'ok',
    }
  },
})
