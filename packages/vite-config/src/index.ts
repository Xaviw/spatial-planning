import { resolve } from 'node:path'

import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unoCSS from 'unocss/vite'
import { defineConfig, type UserConfig } from 'vite'
import dts from 'vite-plugin-dts'

const baseConfig: UserConfig = {
  plugins: [
    vue(),
    vueJsx(),
    dts({ entryRoot: './src', outDir: ['dist/es/src', 'dist/lib/src'] }),
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
}

export const libConfig = defineConfig(
  Object.assign(
    {
      build: {
        rollupOptions: {
          external: ['vue'],
          input: ['index.ts'],
          output: [
            {
              format: 'es',
              entryFileNames: ({ name }) => {
                console.log('name: ', name)
                if (
                  name == 'D:/code/spatial-planning/packages/components/index'
                ) {
                  return '[hash].js'
                } else {
                  return '[name].js'
                }
              },
              preserveModules: true,
              exports: 'named',
              dir: 'dist/es',
            },
            {
              format: 'cjs',
              entryFileNames: ({ name }) => {
                if (
                  name == 'D:/code/spatial-planning/packages/components/index'
                ) {
                  return '[hash].js'
                } else {
                  return '[name].js'
                }
              },
              preserveModules: true,
              exports: 'named',
              dir: 'dist/lib',
            },
          ],
        },
        lib: {
          entry: './index.ts',
        },
        cssCodeSplit: true,
      },
    } as UserConfig,
    baseConfig,
  ),
)

export const webConfig = defineConfig(
  Object.assign(
    {
      build: {
        target: 'es2015',
        cssTarget: 'chrome80',
        rollupOptions: {
          output: {
            // 入口文件名
            entryFileNames: 'assets/[name].js',
            manualChunks: {
              vue: ['vue', 'pinia', 'vue-router'],
              antd: ['ant-design-vue', '@ant-design/icons-vue'],
            },
          },
        },
      },
    } as UserConfig,
    baseConfig,
  ),
)
