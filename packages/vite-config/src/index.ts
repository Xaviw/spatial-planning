import { resolve } from 'node:path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unoCSS from 'unocss/vite'
import autoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { defineConfig } from 'vite'

export const appConfig = defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    autoImport({
      imports: ['vue', 'vue-router', 'pinia'],
      resolvers: [ElementPlusResolver()],
      vueTemplate: true,
      eslintrc: {
        enabled: true,
        filepath: '../.eslintrc-auto-import.json',
      },
    }),
    unoCSS(),
  ],
  resolve: {
    alias: [
      {
        find: /@\//,
        replacement: resolve(process.cwd(), '.', 'src') + '/',
      },
    ],
  },
})
