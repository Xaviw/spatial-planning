import { PrismaClient } from '@prisma/client'
import { md5 } from '../src/utils'

const prisma = new PrismaClient({ log: [{ emit: 'stdout', level: 'query' }] })

async function seed() {
  // 默认账号
  const userHandler = prisma.user.create({
    data: { name: 'admin', password: md5('123456') },
  })

  // 默认配置
  const defaultConfigs = {
    viewMode: '3D',
    rotation: 0,
    pitch: 0,
    features: ['bg', 'point', 'road', 'building'],
    zooms: [2, 26],
    dragEnable: true,
    zoomEnable: true,
    jogEnable: true,
    pitchEnable: true,
    rotateEnable: true,
    keyboardEnable: true,
    doubleClickZoom: true,
    scrollWheel: true,
    showLabel: true,
    isHotspot: true,
    showBuildingBlock: true,
    scalebar: false,
    toolbar: false,
    controlbar: false,
    wallColor: '#989898',
    roofColor: '#D6D6D6',
    skyColor: '#CCE8FF',
    mapType: false,
    defaultMapType: 0,
    showTraffic: false,
    showRoad: false,
    mapStyle: 'blue',
    mapTypePosition: [null, 5, null, 30],
    scalebarPosition: [null, 5, null, 5],
    toolbarPosition: [null, null, 5, 5],
    controlbarPosition: [37, null, 5, null],
  }
  const configHandler = prisma.config.createMany({
    data: Object.entries(defaultConfigs).map(([key, value]) => ({
      key,
      value,
    })),
  })

  return Promise.allSettled([userHandler, configHandler])
}

seed()
  .then(() => {
    console.log('Prisma 初始化数据成功')
  })
  .catch(error => {
    console.error('Prisma 初始化数据出错：', error)
  })
