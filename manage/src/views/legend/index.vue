<template>
  <div class="h-full flex">
    <div class="mr-2 flex flex-col bg-white p-4">
      <LegendType />
    </div>

    <div
      class="flex flex-1 justify-center overflow-auto bg-white px-4 pt-24"
    ></div>
  </div>
</template>

<script setup lang="ts">
import LegendType from './legendType.vue'
</script>
