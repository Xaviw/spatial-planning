<template>
  <ACarousel class="px-4" v-bind="props">
    <div
      v-for="(item, index) of data"
      :key="index"
      class="min-h-12 items-center justify-center flex!"
    >
      <AImage
        :src="item"
        class="w-full"
        :style="{ maxHeight: height + 'px' }"
        :fallback="failed_img"
      />
    </div>
  </ACarousel>
</template>

<script setup lang="ts">
import { failed_img } from '@sp/shared/utils'
import type { CarouselProps } from '#/materials'

const props = withDefaults(defineProps<CarouselProps>(), {
  data: () => [],
  autoplay: true,
  dotPosition: 'bottom',
  dots: true,
})
</script>
