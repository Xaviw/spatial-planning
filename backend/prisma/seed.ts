import { PrismaClient } from '@prisma/client'
import { md5 } from '../src/utils'

const prisma = new PrismaClient({ log: [{ emit: 'stdout', level: 'query' }] })

async function seed() {
  // 没有用户时创建默认账号
  prisma.user.count({ select: { name: true } }).then(async ({ name }) => {
    if (!name) {
      await prisma.user.create({
        data: { name: 'admin', password: md5('123456') },
      })
    }
  })

  // 没有配置时创建默认配置
  prisma.config.count({ select: { id: true } }).then(async ({ id }) => {
    if (!id) {
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
      await prisma.config.createMany({
        data: Object.entries(defaultConfigs).map(([key, value]) => ({
          key,
          value,
        })),
      })
    }
  })
}

seed()
