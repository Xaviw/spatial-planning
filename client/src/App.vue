<template>
  <AConfigProvider
    :locale="zhCN"
    :theme="{
      token: {
        colorSplit: '#0387CE',
        colorText: '#fff',
      },
      components: {
        Table: {
          colorBgContainer: 'rgb(3, 135, 206)',
        },
        Modal: {
          paddingMD: 0,
          paddingContentHorizontalLG: 0,
          colorBgElevated: 'transparent',
        },
        Menu: {
          colorItemTextHover: '#ffe14d',
          colorItemTextHoverHorizontal: '#ffe14d',
          colorItemTextSelected: '#ffe14d',
          colorItemTextSelectedHorizontal: '#ffe14d',
          colorItemBg: 'transparent',
          colorItemBgHover: 'inherit',
          colorItemBgSelected: 'inherit',
          colorItemBgSelectedHorizontal: 'inherit',
          colorActiveBarWidth: 0,
          colorActiveBarHeight: 0,
        },
        Message: {
          colorText: '#000',
        },
      },
    }"
  >
    <RouterView />
  </AConfigProvider>
</template>

<script setup lang="ts">
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import dayjs from 'dayjs'
import 'dayjs/locale/zh-cn'

dayjs.locale('zh-cn')
</script>

<style>
@import url('@sp/shared/styles/common.css');

.wv-lt-refresh {
  display: none !important;
}
</style>
