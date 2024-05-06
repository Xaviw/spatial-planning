import { defineMock } from '@alova/mock'
import { Random } from 'mockjs'

export default defineMock({
  '[POST]/attachment': () => {
    return {
      code: 1,
      data: Random.image() + '.png',
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
      data: Random.image() + '.png',
      message: 'ok',
    }
  },
})
