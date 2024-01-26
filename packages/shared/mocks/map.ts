import { defineMock } from '@alova/mock'
import { generateRandomDecimal } from '@sp/shared/utils'
import Mock from 'mockjs'
import materialStrategies from './materialStrategies'
import type { MaterialItem } from '#/materials'
import type {
  LayerItem,
  MarkerProps,
  OverlayItem,
  OverlayType,
  PolygonProps,
  PolylineProps,
} from '#/overlays'

export default defineMock({
  '/map': ({ query }) => {
    return {
      code: 1,
      data: genList(2, 4, 1, 3, 3, 6, query),
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
  params,
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
            modalTitle: Mock.Random.ctitle(),
            modalWidth: Mock.Random.natural(25, 80) + 'rem',
            materials: genMaterials(dMin, dMax),
          } as OverlayItem<OverlayType>
        },
      ),
    } as LayerItem<OverlayType>
  })
}

function genMaterials(min: number, max: number) {
  const strategies = Object.values(materialStrategies)
  return Array.from({ length: Mock.Random.natural(min, max) }).map(() => {
    return {
      ...strategies[Mock.Random.natural(0, strategies.length - 1)](),
      id: Mock.Random.id(),
      sort: 1,
      status: true,
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString(),
    } as MaterialItem
  })
}

const generationFunctions = {
  Marker(_params): MarkerProps {
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
