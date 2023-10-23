<template>
  <div
    class="relative flex items-center from-[#05294B] to-[#05294B] bg-gradient-to-r py-4"
  >
    <!-- 顶部装饰 -->
    <div
      class="absolute left-0 top-0 h-2px w-full from-[#0783FA] from-opacity-100 to-opacity-0 bg-gradient-to-r"
    />

    <!-- 左侧装饰 -->
    <div class="mr-2 h-4 w-2px bg-[#0783FA]" />

    <!-- 底部装饰 -->
    <div class="absolute bottom-0 left-0 h-1px w-8px bg-[#0783FA]" />
    <div
      class="absolute bottom-0 left-10px h-1px w-8px bg-[#0783FA] opacity-70"
    />
    <div
      class="absolute bottom-0 left-20px right-0 h-1px bg-[#0783FA] opacity-50"
    />
    <div class="absolute bottom-0 right-[30%] h-1px w-8 bg-[#FFD15C]" />
    <div class="absolute bottom-0 right-4px h-3px w-6 bg-[#FFD15C]" />

    <i class="i-uim:cube mr-2 text-3xl text-[#0783FA]" />

    <span class="title flex-1 break-all text-xl font-bold">
      {{ title }}
    </span>

    <div
      class="btn mr-8 cursor-pointer border border-[#2e79b5] rounded-4px border-solid bg-[025493] p-3px"
    >
      <i class="i-ph:list-bold text-xl text-[#19ECFF]" />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<style scoped>
.title {
  text-shadow: 0px 0px 6px rgba(0, 233, 215, 0.6);
}

.btn {
  box-shadow: inset 0px 2px 5px 0px rgba(0, 0, 0, 0.5);
}
</style>
