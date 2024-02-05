<template>
  <section
    :class="['full-loading', absolute && 'absolute!']"
    :style="[background ? `background-color: ${background}` : '']"
    v-show="state"
  >
    <ASpin v-bind="$attrs" :tip="tip" :size="size" :spinning="loading" />
  </section>
</template>

<script lang="ts" setup>
import type { LoadingProps } from '@sp/shared/hooks'

const props = withDefaults(defineProps<LoadingProps>(), {
  tip: '',
  size: 'default',
})

const state = ref<number>()

let showTimer: NodeJS.Timeout | undefined, hideTimer: NodeJS.Timeout | undefined

// 避免loading闪烁,100ms内的不显示,至少显示500ms
watch(
  () => props.loading,
  (val, oldVal) => {
    if (!oldVal && val) {
      // loading=true 时
      // 延迟100ms才显示加载（忽略100ms内完成的加载）
      showTimer = setTimeout(() => {
        // 有即将取消的timer，先取消
        hideTimer && clearTimeout(hideTimer)
        // 标记开启加载状态时的时间戳
        state.value = performance.now()
        // 删除加载timer
        showTimer = undefined
      }, 100)
    } else if (oldVal && !val) {
      // loading=false 时
      if (showTimer) {
        // 加载timer存在说明100ms未到加载就已经完成，忽略
        clearTimeout(showTimer)
      } else if (state.value) {
        // 判断是否显示了500ms
        const gap = performance.now() - state.value
        if (gap < 500) {
          // 不足500ms时延迟关闭
          hideTimer = setTimeout(() => {
            state.value = undefined
          }, 500 - gap)
        } else {
          // 够500ms，直接关闭
          state.value = undefined
        }
      }
    }
  },
  {
    immediate: true,
  },
)
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
