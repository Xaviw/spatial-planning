import Mock from 'mockjs'
import materialStrategies from './material'
import type { LayerItem, MaterialItem, OverlayItem } from '../types/request'
import type { GetMapParams } from '@sp/shared/apis'
import type { MockMethod } from 'vite-plugin-mock'

export default [
  {
    url: '/api/map',
    method: 'get',
    timeout: 1000,
    statusCode: 200,
    response: ({ query }) => ({
      code: 1,
      data: genList(1, 3, 5, 10, 3, 10, query as GetMapParams),
      message: 'ok',
    }),
  },
  {
    url: '/api/sider',
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

function genList(
  lMin: number,
  lMax: number,
  oMin: number,
  oMax: number,
  dMin: number,
  dMax: number,
  params: GetMapParams,
) {
  if (!['11', '121', '122', '13'].includes(params.menuId)) return []
  const functions = Object.values(generationFunctions)
  return Array.from({ length: Mock.Random.natural(lMin, lMax) }).map(
    () =>
      ({
        id: Mock.Random.id(),
        name: Mock.Random.cword(),
        asLegend: Mock.Random.boolean(),
        legendImg: Mock.Random.image('60x60'),
        status: params.filter ? undefined : Mock.Random.boolean(),
        createTime: new Date().toLocaleString(),
        updateTime: new Date().toLocaleString(),
        overlays: Array.from({ length: Mock.Random.natural(oMin, oMax) }).map(
          () =>
            ({
              id: Mock.Random.id(),
              name: Mock.Random.cword(),
              status: params.filter ? undefined : Mock.Random.boolean(),
              createTime: new Date().toLocaleString(),
              updateTime: new Date().toLocaleString(),
              props:
                functions[Mock.Random.natural(0, functions.length - 1)](params),
              details: genDetails(dMin, dMax, params),
            }) as OverlayItem,
        ),
      }) as LayerItem,
  )
}

function genDetails(min: number, max: number, params: GetMapParams) {
  const strategies = Object.values(materialStrategies)
  return Array.from({ length: Mock.Random.natural(min, max) }).map(() => {
    return {
      ...strategies[Mock.Random.natural(0, strategies.length - 1)](),
      id: Mock.Random.id(),
      status: params.filter ? undefined : Mock.Random.boolean(),
    } as MaterialItem
  })
}

const generationFunctions = {
  genMarker(_params: GetMapParams): Recordable {
    return {
      position: [
        Mock.Random.float(103.95, 104.2, 6, 6),
        Mock.Random.float(30.57, 30.7, 6, 6),
      ],
      title: Mock.Random.ctitle(),
    }
  },
}
