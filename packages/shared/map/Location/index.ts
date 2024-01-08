import { useMapStore } from '@sp/shared/map'
import { message } from 'ant-design-vue'
import type { MapEvent, OverlayModule } from '#/business'

const { map } = storeToRefs(useMapStore())

const { copy } = useClipboard({ legacy: true })

function copyLocation(e: MapEvent) {
  copy(`${e.lnglat.lng},${e.lnglat.lat}`).then(() => {
    message.success('经纬度已复制！')
  })
}

export default {
  type: 'Location',
  sort: 11,
  name: '经纬度拾取',
  icon: 'i-material-symbols:my-location-outline',
  drawHelp: [
    '启用后点击地图目标位置会自动复制经纬度',
    '复制后可以直接粘贴到经纬度输入框中',
  ],
  toolItemStyle: 'border-top: 3px solid #666',
  handleDraw: (open: boolean) => {
    if (open) {
      map.value?.on('click', copyLocation)
    } else {
      map.value?.off('click', copyLocation)
    }
  },
} as OverlayModule
