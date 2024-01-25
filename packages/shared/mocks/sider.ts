import { defineMock } from '@alova/mock'
import Mock from 'mockjs'
import materialStrategies from './materialStrategies'
import type { GetSiderParams } from '@sp/shared/apis'

export default defineMock({
  '-/sider': ({ query }) => {
    return {
      code: 1,
      data: genList(8, 50, query as GetSiderParams),
      message: 'ok',
    }
  },
  '-[POST]/sider': () => {
    return {
      code: 1,
      data: true,
      message: 'ok',
    }
  },
})

function genList(min: number, max: number, params: GetSiderParams) {
  if (!['11', '121', '122', '13'].includes(params.menuId)) return []
  const strategies = Object.values(materialStrategies)
  return Array.from({ length: Mock.Random.natural(min, max) }).map(() => {
    const material = strategies[Mock.Random.natural(0, strategies.length - 1)]()
    return {
      ...material,
      id: Mock.Random.id(),
      status:
        (params.filter as unknown as string) === 'true'
          ? undefined
          : Mock.Random.boolean(),
      position: params.position,
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString(),
    }
  })
}
