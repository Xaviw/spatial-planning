<template>
  <div
    class="flex items-center from-[#043563] to-[#043563] from-opacity-10 to-opacity-100 bg-gradient-to-r p-4"
  >
    <div
      class="relative flex items-center justify-center border-24px border-[#0E4A85] border-l-[#053670] border-solid"
    >
      <div class="absolute" v-if="img">
        <AImage
          :width="imgWidth"
          :height="imgHeight"
          :preview="imgPreview"
          :src="img"
          :fallback="getStaticFile('/failed.png')"
        >
          <template #previewMask>
            <i class="i-ant-design:eye-outlined" />
          </template>
        </AImage>
      </div>
      <i
        class="i-solar:database-bold-duotone absolute text-3xl text-blue-300"
        v-else
      />
    </div>

    <span class="mx-4 flex-1 break-all text-lg">
      {{ title }}
    </span>

    <span class="text-3xl font-bold text-[#FFD15C]">{{ content }}</span>
  </div>
</template>

<script setup lang="ts">
import { getStaticFile } from '@sp/shared/utils'
import type { DataCardProps } from '#/materials'

withDefaults(defineProps<DataCardProps>(), {
  imgWidth: '36px',
  imgHeight: '36px',
  imgPreview: true,
})
</script>
