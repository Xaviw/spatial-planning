/* eslint-disable @typescript-eslint/triple-slash-reference */
/// <reference path="../../../types/global.d.ts" />
/// <reference path="../../../types/request.d.ts" />

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unoCSS from 'unocss/vite'
import autoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import components from 'unplugin-vue-components/vite'
import { defineConfig } from 'vite'
import { createHtmlPlugin } from 'vite-plugin-html'
import { viteMockServe } from 'vite-plugin-mock'

export const appConfig = defineConfig({
  publicDir: '../public',
  plugins: [
    vue(),
    vueJsx(),
    autoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      vueTemplate: true,
      eslintrc: {
        enabled: true,
        filepath: '../.eslintrc-auto-import.json',
      },
      dts: 'src/typings/auto-imports.d.ts',
    }),
    components({
      resolvers: [AntDesignVueResolver({ importStyle: false })],
      dts: 'src/typings/components.d.ts',
    }),
    unoCSS(),
    createHtmlPlugin({
      minify: import.meta.env.PROD,
      inject: {
        data: {
          VITE_TITLE: import.meta.env.VITE_TITLE,
        },
      },
    }),
    viteMockServe({
      mockPath: '../mock',
      localEnabled: import.meta.env.DEV && import.meta.env.VITE_MOCK_ENABLE,
      prodEnabled: import.meta.env.PROD && import.meta.env.VITE_MOCK_ENABLE,
    }),
  ],
  resolve: {
    alias: {
      '@/': '/src/',
    },
  },
})
