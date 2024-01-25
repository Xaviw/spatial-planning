import { defineMock } from '@alova/mock'
import mockjs from 'mockjs'

export default defineMock({
  '[POST]/user/login': () => {
    return {
      code: 1,
      data: {
        id: mockjs.Random.id(),
        name: mockjs.Random.name(),
      },
      message: 'ok',
    }
  },
  '[PUT]/user/{id}': () => {
    return {
      code: 1,
      message: 'ok',
    }
  },
})
