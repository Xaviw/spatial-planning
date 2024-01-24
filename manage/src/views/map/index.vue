<template>
  <div class="relative h-full min-w-400 flex">
    <Loading absolute :loading="loading" />

    <Toolbar class="absolute left-2 top-2 z-1 rounded bg-white" />

    <Suspense>
      <Map class="mr-2 flex-1 bg-white" />
      <template #fallback>
        <div class="mr-2 flex-1 bg-white"></div>
      </template>
    </Suspense>

    <div class="w-100 flex flex-col">
      <Header class="mb-2 bg-white p-4" />

      <FormBar class="mb-2 flex-1 overflow-hidden bg-white p-4" />

      <Layer class="bg-white" v-model="mapData" :disabled="!selectedMenu">
        <template #default="{ visible, list }">
          <component
            v-for="overlay of list"
            :is="overlays[overlay.type]?.overlay"
            :key="overlay.id"
            v-bind="overlay"
            :visible="visible"
          />
        </template>
      </Layer>
    </div>

    <LayerModal />
  </div>
</template>

<script setup lang="ts">
import { Loading } from '@sp/shared/components'
import {
  useMapStore,
  hasRightMenuKey,
  mapKey,
  labelsLayerKey,
} from '@sp/shared/helpers/map'
import { overlays } from '@sp/shared/overlays'
import FormBar from './formBar.vue'
import Header from './header.vue'
import Layer from './layer.vue'
import LayerModal from './layerModal.vue'
import Map from './map.vue'
import Toolbar from './toolbar.vue'
import type { AMap } from '@amap/amap-jsapi-types'

const { loading, mapData, selectedMenu } = storeToRefs(useMapStore())

provide(mapKey, ref<AMap.Map>())
provide(labelsLayerKey, ref<AMap.LabelsLayer>())
provide(hasRightMenuKey, true)
</script>
