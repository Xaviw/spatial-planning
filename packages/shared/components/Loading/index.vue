<template>
  <section
    :class="['full-loading', absolute && 'absolute!']"
    :style="[background ? `background-color: ${background}` : '']"
    v-show="loading"
  >
    <ASpin v-bind="$attrs" :tip="tip" :size="size" :spinning="loading" />
  </section>
</template>

<script lang="ts" setup>
import type { LoadingProps } from '@sp/shared/hooks'

withDefaults(defineProps<LoadingProps>(), {
  tip: '',
  size: 'default',
  absolute: false,
  loading: false,
})
</script>

<style scoped>
.full-loading {
  display: flex;
  position: fixed;
  z-index: 300;
  top: 0;
  left: 0;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: rgb(240 242 245 / 30%);
}
</style>
