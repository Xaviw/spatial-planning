import { defineMock } from '@alova/mock'
import { generateRandomDecimal } from '@sp/shared/utils'
import Mock from 'mockjs'
import materialStrategies from './materialStrategies'
import type {
  LayerItem,
  MarkerProps,
  MaterialItem,
  OverlayItem,
  OverlayType,
  PolygonProps,
  PolylineProps,
} from '#/business'
import type { GetMapParams } from '@sp/shared/apis'

export default defineMock({
  '/map': ({ query }) => {
    return {
      code: 1,
      data: genList(2, 4, 1, 3, 3, 6, query as GetMapParams),
      message: 'ok',
    }
  },
  '[POST]/map': () => {
    return {
      code: 1,
      data: true,
      message: 'ok',
    }
  },
})

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
  const keys = Object.keys(generationFunctions)
  const functions = Object.values(generationFunctions)
  return Array.from({ length: Mock.Random.natural(lMin, lMax) }).map(() => {
    const layerId = Mock.Random.id()
    return {
      id: layerId,
      name: Mock.Random.cword(),
      asLegend: Mock.Random.boolean(),
      legendImg: Mock.Random.image('60x60', Mock.Random.color()),
      status:
        (params.filter as unknown as string) === 'true'
          ? undefined
          : Mock.Random.boolean(),
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString(),
      overlays: Array.from({ length: Mock.Random.natural(oMin, oMax) }).map(
        () => {
          const randomIndex = Mock.Random.natural(0, functions.length - 1)
          return {
            id: Mock.Random.id(),
            layerId,
            type: keys[randomIndex],
            name: Mock.Random.cword(),
            status:
              (params.filter as unknown as string) === 'true'
                ? undefined
                : Mock.Random.boolean(),
            createTime: new Date().toLocaleString(),
            updateTime: new Date().toLocaleString(),
            props: functions[randomIndex](params),
            detailTitle: Mock.Random.ctitle(),
            detailWidth: Mock.Random.natural(25, 80) + 'rem',
            details: genDetails(dMin, dMax),
          } as OverlayItem<OverlayType>
        },
      ),
    } as LayerItem<OverlayType>
  })
}

function genDetails(min: number, max: number) {
  const strategies = Object.values(materialStrategies)
  return Array.from({ length: Mock.Random.natural(min, max) }).map(() => {
    return {
      ...strategies[Mock.Random.natural(0, strategies.length - 1)](),
      id: Mock.Random.id(),
    } as MaterialItem
  })
}

const generationFunctions = {
  Marker(_params: GetMapParams): MarkerProps {
    return {
      position: [
        generateRandomDecimal(103.95, 104.2, 6),
        generateRandomDecimal(30.57, 30.7, 6),
      ],
      title: Mock.Random.ctitle(),
    }
  },
  Polyline(): PolylineProps {
    return {
      path: Array.from({ length: Mock.Random.integer(2, 5) }).map(() => [
        generateRandomDecimal(103.95, 104.2, 6),
        generateRandomDecimal(30.57, 30.7, 6),
      ]),
    }
  },
  Polygon(): PolygonProps {
    return {
      path: Array.from({ length: Mock.Random.integer(2, 5) }).map(() => [
        generateRandomDecimal(103.95, 104.2, 6),
        generateRandomDecimal(30.57, 30.7, 6),
      ]),
    }
  },
}
