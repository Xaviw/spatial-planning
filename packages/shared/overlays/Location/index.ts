import { useMapStore } from '@sp/shared/helpers/map'
import { message } from 'ant-design-vue'
import type { MapEvent, OverlayModule } from '#/overlays'

const { copy } = useClipboard({ legacy: true })

function copyLocation(e: MapEvent) {
  copy(`${e.lnglat.lng},${e.lnglat.lat}`).then(() => {
    message.success('经纬度已复制！')
  })
}

export default {
  type: 'Location',
  sort: 12,
  name: '经纬度拾取',
  icon: 'i-material-symbols:my-location-outline',
  drawHelp: [
    '启用后点击地图目标位置会自动复制经纬度',
    '复制后可以直接粘贴到经纬度输入框中',
    '如目标位置被遮挡可以先右击覆盖物选择“隐藏”',
  ],
  toolItemStyle: 'border-top: 3px solid #666',
  handleDraw: (mapStore: ReturnType<typeof useMapStore>, open: boolean) => {
    if (open) {
      mapStore.map?.on('click', copyLocation)
    } else {
      mapStore.map?.off('click', copyLocation)
    }
  },
} as OverlayModule
