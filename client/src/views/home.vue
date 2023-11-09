<template>
  <div
    class="h-screen w-screen flex flex-col overflow-hidden bg-[#001231] text-white"
  >
    <!-- 顶部 -->
    <Header />

    <div class="min-h-0 flex flex-1">
      <!-- 左侧 -->
      <div
        :class="[
          'relative',
          'w-100',
          'transition-all',
          'z-1',
          !layoutState.left && 'ml--100',
        ]"
      >
        <Sider />

        <div
          class="trigger arrow right-0 translate-x-[100%] rounded-r"
          @click="layoutState.left = !layoutState.left"
        >
          <i
            :class="[
              'i-material-symbols:arrow-forward-ios',
              'transition-all',
              layoutState.left && 'rotate-180',
            ]"
          />
        </div>
      </div>

      <div class="relative flex flex-1 flex-col">
        <!-- 菜单 -->
        <Menu class="absolute left-4 top-4" />

        <!-- 地图 -->
        <div class="flex-1"></div>

        <!-- 图例 -->
        <div
          :class="[
            'relative',
            'h-20',
            'transition-all',
            !layoutState.bottom && 'mb--20',
          ]"
        >
          <div class="absolute left-0 top-0 flex translate-y-[-100%] text-10px">
            <div
              class="trigger px-2 py-1"
              @click="layoutState.bottom = !layoutState.bottom"
            >
              {{ `${layoutState.bottom ? '折叠' : '展开'}图例` }}
            </div>
            <div
              class="trigger border-x border-y-0 border-light-6 border-solid px-2 py-1"
            >
              全部隐藏
            </div>
            <div class="trigger px-2 py-1">全部显示</div>
          </div>
        </div>
      </div>

      <!-- 右侧 -->
      <div
        :class="[
          'relative',
          'w-100',
          'transition-all',
          !layoutState.right && 'mr--100',
        ]"
      >
        <div
          class="trigger arrow left-0 translate-x-[-100%] rounded-l"
          @click="layoutState.right = !layoutState.right"
        >
          <i
            :class="[
              'i-material-symbols:arrow-forward-ios',
              'transition-all',
              !layoutState.right && 'rotate-180',
            ]"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const layoutState = reactive({
  left: true,
  right: true,
  bottom: true,
})
</script>

<style scoped>
.trigger {
  @apply cursor-pointer bg-blue opacity-50 hover:opacity-100 select-none;
}

.arrow {
  @apply py-2 absolute top-[50%] translate-y-[50%] flex items-center justify-center;
}
</style>
