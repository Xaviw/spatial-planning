<template>
  <div>
    <div
      class="flex items-center justify-between bg-[#1a4f84] px-4 py-2 text-xl font-900 text-white"
    >
      <span class="title">{{ title }}</span>
      <i
        class="i-ant-design:close-outlined origin-center cursor-pointer transition-500 transition-all hover:transform-scale-120"
        @click="$emit('close')"
      />
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /** 标题 */
    title: string
    /** 是否显示右上角关闭按钮 */
    closable?: boolean
  }>(),
  {
    closable: true,
  },
)

defineEmits<{
  (e: 'close'): void
}>()
</script>

<style scoped>
.title {
  text-shadow: 0px 0px 6px rgba(0, 233, 215, 0.6);
}
</style>
