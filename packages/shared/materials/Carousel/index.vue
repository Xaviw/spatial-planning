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
        :fallback="ImageFailed"
      />
    </div>
  </ACarousel>
</template>

<script setup lang="ts">
import ImageFailed from '@sp/shared/assets/images/image-failed-filled.png'
import type { CarouselProps } from '#/materials'

const props = withDefaults(defineProps<CarouselProps>(), {
  data: () => [],
  autoplay: true,
  dotPosition: 'bottom',
  dots: true,
})
</script>
