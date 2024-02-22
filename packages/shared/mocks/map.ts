import { defineMock } from '@alova/mock'
import { AMap } from '@amap/amap-jsapi-types'
import Mock from 'mockjs'
import materialStrategies from './materialStrategies'
import type { MaterialItem } from '#/materials'
import type {
  ElasticMarkerProps,
  LabelMarkerProps,
  LayerItem,
  MarkerProps,
  OverlayItem,
  OverlayType,
  PolygonProps,
  PolylineProps,
  TextProps,
  BezierCurveProps,
  CircleProps,
  EllipseProps,
  RectangleProps,
} from '#/overlays'

export default defineMock({
  '/map': ({ query }) => {
    return {
      code: 1,
      data: genList(4, 20, 10, 20, 3, 6, query),
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
      asLegend: true,
      legendImg: Mock.Random.image('40x40', Mock.Random.color()) + '.png',
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
            props: functions[randomIndex](),
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
      status: true,
      createTime: new Date().toLocaleString(),
      updateTime: new Date().toLocaleString(),
    } as MaterialItem
  })
}

const generationFunctions = {
  Marker(): MarkerProps {
    return {
      position: generatePoints()[0],
      title: '点标记',
    }
  },
  Text(): TextProps {
    return {
      position: generatePoints()[0],
      text: '文本',
      title: '文本',
      angle: Mock.Random.float(0, 360),
      style: JSON.stringify({
        color: Mock.Random.color(),
        background: 'transparent',
        border: 'none',
      }),
    }
  },
  LabelMarker(): LabelMarkerProps {
    return {
      position: generatePoints()[0],
      opacity: Mock.Random.float(0.1, 1),
      icon: {
        image: Mock.Random.dataImage('40x40', '文本标记'),
        size: [40, 40],
      },
      text: {
        content: '文本标记',
        direction: 'bottom',
        style: {
          fillColor: Mock.Random.color(),
        },
      },
    }
  },
  ElasticMarker(): ElasticMarkerProps {
    return {
      position: generatePoints()[0],
      styles: [
        {
          icon: {
            img: Mock.Random.dataImage('40x40', '灵活点标记'),
            fitZoom: 12,
            scaleFactor: 2,
            maxScale: 3,
            minScale: 0.1,
          },
        },
      ],
    }
  },
  Polygon(): PolygonProps {
    return {
      path: generatePoints(4, 500),
      strokeColor: Mock.Random.color(),
      strokeOpacity: Mock.Random.float(0.1, 1),
      strokeWeight: Mock.Random.integer(2, 10),
      fillColor: Mock.Random.color(),
      fillOpacity: Mock.Random.float(0.1, 1),
      extrusionHeight: Mock.Random.integer(0, 100),
      wallColor: Mock.Random.color(),
      roofColor: Mock.Random.color(),
      strokeStyle: Mock.Random.boolean() ? 'solid' : 'dashed',
    }
  },
  Polyline(): PolylineProps {
    return {
      path: generatePoints(8, 1000),
      strokeColor: Mock.Random.color(),
      strokeOpacity: Mock.Random.float(0.1, 1),
      strokeWeight: Mock.Random.integer(2, 10),
      isOutline: Mock.Random.boolean(),
      outlineColor: Mock.Random.color(),
      strokeStyle: Mock.Random.boolean() ? 'solid' : 'dashed',
      lineJoin: (['miter', 'round', 'bevel'] as any)[Mock.Random.integer(0, 2)],
      lineCap: (['butt', 'round', 'square'] as any)[Mock.Random.integer(0, 2)],
      geodesic: Mock.Random.boolean(),
      showDir: Mock.Random.boolean(),
    }
  },
  BezierCurve(): BezierCurveProps {
    return {
      path: generatePoints(8, 1000).reduce(
        (p, c) => {
          const last = p[p.length - 1]
          if (last.length < 2) {
            last.push(c)
          } else {
            p.push([c])
          }
          return p
        },
        [[]] as AMap.Vector2[][],
      ) as any,
      strokeColor: Mock.Random.color(),
      strokeOpacity: Mock.Random.float(0.1, 1),
      strokeWeight: Mock.Random.integer(2, 10),
      borderWeight: Mock.Random.integer(2, 10),
      isOutline: Mock.Random.boolean(),
      outlineColor: Mock.Random.color(),
      strokeStyle: Mock.Random.boolean() ? 'solid' : 'dashed',
      lineJoin: (['miter', 'round', 'bevel'] as any)[Mock.Random.integer(0, 2)],
      lineCap: (['butt', 'round', 'square'] as any)[Mock.Random.integer(0, 2)],
      geodesic: Mock.Random.boolean(),
      showDir: Mock.Random.boolean(),
    }
  },
  Circle(): CircleProps {
    return {
      center: generatePoints()[0],
      radius: 100,
      strokeColor: Mock.Random.color(),
      strokeOpacity: Mock.Random.float(0.1, 1),
      strokeWeight: Mock.Random.integer(2, 10),
      strokeStyle: Mock.Random.boolean() ? 'solid' : 'dashed',
      extrusionHeight: Mock.Random.integer(0, 100),
      wallColor: Mock.Random.color(),
      roofColor: Mock.Random.color(),
      fillColor: Mock.Random.color(),
      fillOpacity: Mock.Random.float(0.1, 1),
    }
  },
  Ellipse(): EllipseProps {
    return {
      center: generatePoints()[0],
      radius: [50, 100],
      strokeColor: Mock.Random.color(),
      strokeOpacity: Mock.Random.float(0.1, 1),
      strokeWeight: Mock.Random.integer(2, 10),
      strokeStyle: Mock.Random.boolean() ? 'solid' : 'dashed',
      extrusionHeight: Mock.Random.integer(0, 100),
      wallColor: Mock.Random.color(),
      roofColor: Mock.Random.color(),
      fillColor: Mock.Random.color(),
      fillOpacity: Mock.Random.float(0.1, 1),
    }
  },
  Rectangle(): RectangleProps {
    const points = generatePoints(2, 500)
    return {
      bounds: [points[0], points[1]],
      strokeColor: Mock.Random.color(),
      strokeOpacity: Mock.Random.float(0.1, 1),
      strokeWeight: Mock.Random.integer(2, 10),
      fillColor: Mock.Random.color(),
      fillOpacity: Mock.Random.float(0.1, 1),
      extrusionHeight: Mock.Random.integer(0, 100),
      wallColor: Mock.Random.color(),
      roofColor: Mock.Random.color(),
      strokeStyle: Mock.Random.boolean() ? 'solid' : 'dashed',
    }
  },
  ImageLayer(): AMap.ImageLayerOptions {
    const points = generatePoints(2, 500)
    return {
      bounds: [...points[0], ...points[1]],
      url: Mock.Random.dataImage('40x40', '贴图'),
      opacity: Mock.Random.float(0.1, 1),
    }
  },
}

const generated = new Set<string>()

function generatePoints(num: number = 1, distance?: number): AMap.Vector2[] {
  const points: AMap.Vector2[] = []
  while (points.length < num) {
    const lng = Math.random() * (104.2 - 103.95) + 103.95
    const lat = Math.random() * (30.7 - 30.57) + 30.57
    const point = [lng, lat]
    if (
      !generated.has(point.toString()) &&
      (!points.length ||
        !distance ||
        distance > getDistance(points[0], [lng, lat]))
    ) {
      points.push([lng, lat])
      generated.add(point.toString())
    }
  }
  return points
}

function getDistance(point1: AMap.Vector2, point2: AMap.Vector2): number {
  const R = 6371e3 // Earth's radius in meters
  const phi1 = (point1[1] * Math.PI) / 180
  const phi2 = (point2[1] * Math.PI) / 180
  const deltaPhi = ((point2[1] - point1[1]) * Math.PI) / 180
  const deltaLambda = ((point2[0] - point1[0]) * Math.PI) / 180
  const a =
    Math.sin(deltaPhi / 2) ** 2 +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) ** 2
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}
