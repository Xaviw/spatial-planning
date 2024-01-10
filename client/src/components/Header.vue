<template>
  <div
    class="flex select-none items-center justify-between px-18 py-1 text-white"
  >
    <div class="flex flex-1 items-center text-4xl font-bold">
      <i
        class="i-streamline:ecology-science-planet-solar-system-ring-planet-saturn-space-astronomy"
      />

      <span class="ml-4 tracking-widest">
        {{ AppTitle }}
      </span>
    </div>

    <div class="flex items-center">
      <Weather />

      <div class="ml-2 flex flex-col items-center tracking-wide">
        <span class="mb-1 text-xl font-bold">{{ currentTime }}</span>
        <span>{{ currentDate }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const AppTitle = import.meta.env.VITE_TITLE
const currentTime = ref<string>()
const currentDate = ref<string>()

updateDateTime()

function updateDateTime() {
  const update = () => {
    currentTime.value = new Date().toLocaleTimeString()
    currentDate.value = new Date().toLocaleDateString()
    requestAnimationFrame(update)
  }
  requestAnimationFrame(update)
}
</script>
