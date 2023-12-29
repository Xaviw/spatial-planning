import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import unoCSS from 'unocss/vite'
import autoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import components from 'unplugin-vue-components/vite'
import { loadEnv, defineConfig } from 'vite'
import { viteMockServe } from 'vite-plugin-mock'

export default function ({ name } = {}) {
  return defineConfig(({ mode }) => {
    const env = loadEnv(mode, '../')
    return {
      publicDir: '../public',
      envDir: '../',
      plugins: [
        vue(),
        vueJsx(),
        autoImport({
          imports: ['vue', 'vue-router', 'pinia', '@vueuse/core'],
          vueTemplate: true,
          eslintrc: {
            enabled: true,
            filepath: '../.eslintrc-auto-import.json',
          },
          dts: `../types/auto-import-${name}.d.ts`,
        }),
        components({
          resolvers: [AntDesignVueResolver({ importStyle: false })],
          dts: `../types/auto-components-${name}.d.ts`,
        }),
        unoCSS(),
        viteMockServe({
          mockPath: '../mock',
          localEnabled: env.DEV && env.VITE_MOCK_ENABLE,
          prodEnabled: env.PROD && env.VITE_MOCK_ENABLE,
        }),
      ],
    }
  })
}
