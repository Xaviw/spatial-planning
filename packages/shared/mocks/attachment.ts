import { defineMock } from '@alova/mock'
import mockjs from 'mockjs'

export default defineMock({
  '[POST]/attachment': () => {
    return {
      code: 1,
      data: mockjs.Random.image() + '.png',
      message: 'ok',
    }
  },
  '/attachment/check': () => {
    return {
      code: 1,
      message: 'ok',
    }
  },
  '/attachment/merge': () => {
    return {
      code: 1,
      data: mockjs.Random.image() + '.png',
      message: 'ok',
    }
  },
})
