<template>
  <ACarousel class="px-4">
    <div
      v-for="(item, index) of data"
      :key="index"
      class="items-center justify-center flex!"
    >
      <AImage
        :src="item"
        class="w-full"
        :style="{ maxHeight: height + 'px' }"
      />
    </div>
  </ACarousel>
</template>

<script setup lang="ts">
import type { CarouselProps } from '#/components'

withDefaults(defineProps<CarouselProps>(), {
  data: () => [],
  autoplay: true,
})
</script>
