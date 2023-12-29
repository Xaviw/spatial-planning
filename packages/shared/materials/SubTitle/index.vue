<template>
  <div class="flex items-center">
    <div class="mr-2 h-4 w-4px bg-[#21B1FF]" />

    <span class="text-[#21B1FF]">{{ title }}</span>
  </div>
</template>

<script setup lang="ts">
import type { SubTitleProps } from '#/materials'

defineProps<SubTitleProps>()
</script>
