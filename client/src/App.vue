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
.shadow-basic {
  --uno: shadow shadow-light shadow-opacity-50;
}

::-webkit-scrollbar {
  width: 3px;
  height: 3px;
}
::-webkit-scrollbar-track {
  background-color: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: #21b1ff66;
  border-radius: 5px;
}
::-webkit-scrollbar-thumb:hover {
  background-color: #21b1ff;
}
::-webkit-scrollbar-thumb:active {
  background-color: #21b1ff;
}
</style>
