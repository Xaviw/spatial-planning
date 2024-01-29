<template>
  <div class="flex flex-col">
    <template v-if="activeOverlay">
      <div class="flex-1 overflow-x-hidden overflow-y-auto">
        <BaseForm ref="baseFormEl" />

        <component
          :is="overlays[activeOverlay.type].form"
          :key="activeOverlay.id"
          ref="overlayFormEl"
        />
      </div>

      <div class="flex">
        <AButton class="mr-4 flex-1" type="primary" @click="onConfirm">
          确定
        </AButton>
        <AButton class="flex-1" danger @click="onCancel">取消</AButton>
      </div>
    </template>
    <AEmpty
      v-else
      description="请右击地图中的覆盖物，选择“编辑”"
      class="h-full flex flex-col items-center justify-center"
    />
  </div>
</template>

<script setup lang="ts">
import { useMapStore, findOverlay } from '@sp/shared/helpers/map'
import { overlays } from '@sp/shared/overlays'
import { modal } from '@sp/shared/utils'
import { equals, clone } from 'ramda'
import BaseForm from './baseForm.vue'

const baseFormEl = ref<InstanceType<typeof BaseForm> | null>(null)
const overlayFormEl = ref<any | null>(null)

const mapStore = useMapStore()

const { activeOverlay, mapData, editData } = storeToRefs(mapStore)

watch(activeOverlay, async overlay => {
  if (overlay) {
    await nextTick()
    if (baseFormEl.value && overlayFormEl.value) {
      // 开启覆盖物编辑
      overlays[overlay.type].handleEdit?.(mapStore, true)
      // 开启表单编辑
      editData.value = clone(overlay)
      baseFormEl.value.formModel = editData.value
      overlayFormEl.value.formModel = editData.value.props
    }
  }
})

async function onConfirm() {
  await baseFormEl.value?.validate()
  await overlayFormEl.value?.validate()

  // 同步修改的值
  const newData = editData.value!
  if (!equals(newData, activeOverlay.value)) {
    const { layer, index } =
      findOverlay(mapData.value, activeOverlay.value!.id) || {}
    if (newData.layerId === activeOverlay.value!.layerId && layer) {
      layer.overlays[index!] = newData
    } else if (layer) {
      layer.overlays.splice(index!, 1)
      const layerIndex = mapData.value.findIndex(
        item => item.id === newData.layerId,
      )
      mapData.value[layerIndex].overlays.push(newData)
    }
  }
  // 关闭编辑
  overlays[activeOverlay.value!.type]?.handleEdit?.(mapStore, false)
  mapStore.cancelEdit()
}

async function onCancel() {
  if (!equals(editData.value!, activeOverlay.value)) {
    await modal('confirm', {
      title: '警告!',
      content: '您的修改将不会保留，是否确定？',
    })
  }
  // 暂停历史记录追踪
  mapStore.pause()
  // 恢复覆盖物编辑器产生的修改
  const { layer, index, overlay } = findOverlay(
    mapData.value,
    activeOverlay.value!.id,
  )!
  overlays[activeOverlay.value!.type].cancelEdit?.(
    mapStore,
    layer,
    index,
    overlay,
  )
  nextTick(() => {
    mapStore.resume()
  })

  // 关闭编辑
  overlays[activeOverlay.value!.type]?.handleEdit?.(mapStore, false)
  mapStore.cancelEdit()
}
</script>
