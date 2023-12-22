import { reactiveOverlay, commonLayerHandler } from '../index'

export function create(opts: Loca.PointLayerProps, loca?: Loca.Container) {
  let instance = new Loca.PointLayer(opts)
  if (opts.source) {
    instance.setSource(new Loca.GeoJSONSource({ data: opts.source }))
  }
  if (opts.style) {
    instance.setStyle(opts.style)
  }
  if (loca) {
    instance.setLoca(loca)
  }

  const { proxy, replaceSource } = reactiveOverlay(
    opts,
    {
      ...commonLayerHandler(instance),
      style() {
        instance.setStyle(proxy.style || {})
      },
    },
    [],
  )

  return {
    proxy,
    replaceSource,
    replaceInstance(newInstance: Loca.PointLayer) {
      instance = newInstance
    },
  }
}

export const data: GeoJSON.JSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [106.551556, 29.563009],
      },
      properties: {
        id: 1,
        名称: '重庆市',
        地址: '重庆市',
        adcode_n: -1,
        adcode_p: -1,
        adcode_c: -1,
        adcode_d: -1,
        point_status: 0,
        创建时间: '2021-01-27 14:45:12',
        修改时间: '2021-01-27 14:45:12',
        人口: 2884.62,
        GDP: 7894.24,
        人均GDP: 27367,
        人均折美元: 4043,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [121.473701, 31.230416],
      },
      properties: {
        id: 2,
        名称: '上海市',
        地址: '上海市',
        adcode_n: 100000,
        adcode_p: 310000,
        adcode_c: 310000,
        adcode_d: 310101,
        point_status: 0,
        创建时间: '2021-01-27 14:45:12',
        修改时间: '2021-01-27 14:45:12',
        人口: 2301.91,
        GDP: 16872.42,
        人均GDP: 73297,
        人均折美元: 10828,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [116.407526, 39.90403],
      },
      properties: {
        id: 3,
        名称: '北京市',
        地址: '北京市',
        adcode_n: 100000,
        adcode_p: 110000,
        adcode_c: 110000,
        adcode_d: 110101,
        point_status: 0,
        创建时间: '2021-01-27 14:45:12',
        修改时间: '2021-01-27 14:45:12',
        人口: 1961.24,
        GDP: 13777.9,
        人均GDP: 70251,
        人均折美元: 10378,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [104.066541, 30.572269],
      },
      properties: {
        id: 4,
        名称: '成都市',
        地址: '成都市',
        adcode_n: -1,
        adcode_p: -1,
        adcode_c: -1,
        adcode_d: -1,
        point_status: 0,
        创建时间: '2021-01-27 14:45:12',
        修改时间: '2021-01-27 14:45:12',
        人口: 1404.76,
        GDP: 5551.3,
        人均GDP: 39518,
        人均折美元: 5838,
      },
    },
    {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [117.200983, 39.084158],
      },
      properties: {
        id: 5,
        名称: '天津市',
        地址: '天津市',
        adcode_n: -1,
        adcode_p: -1,
        adcode_c: -1,
        adcode_d: -1,
        point_status: 0,
        创建时间: '2021-01-27 14:45:12',
        修改时间: '2021-01-27 14:45:12',
        人口: 1293.82,
        GDP: 9108.83,
        人均GDP: 70402,
        人均折美元: 10400,
      },
    },
  ],
}
