import path from 'path'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import { visualizer } from 'rollup-plugin-visualizer'
import unoCSS from 'unocss/vite'
import autoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import components from 'unplugin-vue-components/vite'
import { defineConfig, loadEnv } from 'vite'
import viteCompression from 'vite-plugin-compression'

export default function (name) {
  return defineConfig(({ mode }) => {
    const { VITE_BASE_URL = '' } = loadEnv(
      mode,
      path.join(process.cwd(), '../'),
    )

    return {
      base: `${VITE_BASE_URL}/${name}/`,
      envDir: '../',
      plugins: [
        addFavicon(),
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
        viteCompression(),
        visualizer({
          open: true,
        }),
      ],
      build: {
        target: 'esnext',
        rollupOptions: {
          output: {
            manualChunks: {
              vue: ['vue', 'vue-router', 'pinia'],
            },
          },
        },
      },
      json: {
        stringify: true,
      },
      server: {
        host: true,
        proxy: {
          '/static': {
            target: 'http://localhost:3000',
            changeOrigin: true,
          },
          '/api': {
            target: 'http://localhost:3000',
            changeOrigin: true,
            rewrite: path => path.replace(/^\/api/, ''),
          },
        },
      },
    }
  })
}

// 添加 base64 ico
function addFavicon() {
  const favicon =
    'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAEUUlEQVR4nO1WXUxcRRReNT7pi9YXH030xb+Y8GLUpEm5c5eduReXnZnlr1qgRdTQ1qQltVa6jTa1EquQYCuR0hIoJQFbtGKDLTGoKVVapUKKBVa2QKG0C+zyY3dh9x5zbgGp7G6blfoiX3J2Z+89O98355w5MxbLClawgjigqvJhlfIXFModaDjGZ5a7CSnlfSrjOSwl4wxhIkyYgMWmatLQHBmtiiay0XdZyRVNvkTtaT1IlJe/Fapq6qDt/K/Q57kMl3r7oLH5B9hTUg6vbNhkimH2DDexOV5cJnKRrWpyNis332j9qQ2iYepGENrdw3Co/iSkZb0BquYMESqz/h055Q7ChLG9cDdMTU3fQmgAQCiMn39jJhSGC38MQ0t7N+QXuDAtGJG0uMitOn9K1Z2BLW+7jNnZ0JIVD3r90OEZgeA/3uHvtu5B+LHTA7mbtkFScmpwTZJ88o6JVV0+rjBeTqiYsctXwz7/RMSQe/3T0Ds0CqFweMm76/5paO3qh+a2i/CyXAe25LSmOyJPtDm4wvgUYXwSi6m2rgHiRbt7yBSxr6zKLEwlKeX5266cMH6DMHFKsfHPqD09HAgE4hYwNDphCmi50AvUng4K5ftiCiBMbFcoD2JDSUp2une+tzducixGz8i4KQBt/cYCUHXnBGMZD8UQwAsJ4zNk7doHVE3MVlbXxi2g/5oPfuu7uiCgYNeHN9NARZfVmvJoZAFUPmc62WQRfn/V2BSVwDAM02KFHwWc/X3AFFBy8OicAD6pMNHicrnujShCYbwM9z06H/uyMeLk/ukAdHpGTMNxZIE3/XA7ooCP5wpRZTzXbN0aVyMKSEh47X7CRD065eRtBu/o2JLJu694zdWh9VzxRo1C2DAWUrDro0+xMwbxjDDTTMW7serxHkJFP3YxnWdCRWUNXPeOLkx8eS6/aDiOBozAvICcN7eCVXe2qUwmYITxUIu5IxQqd6Cja3cR/hG7GbjeL4JTzS0w7vPD8NikaZGa0ILQuV3QdLYDiCaxAA8TxocJE+7VUj4YUwDR5WO4E0oPlMPVkWtw8HA1ZGa9buYRBeGJWFxaBie+aTJPxf6BQfD5/BAIBk0b8/mg8ftzUFHXCOvy3oL5ulKoOI9zxySfh8JEqVV3hrt73Aur6ul1w5Gj9bDDtQd4WvYt94FYpjDep1CeHrX6IyHRbl+latLjzFw/E6kYEfi8o/MifHv6O2g4cRJq645DZU0dfPL5ESgur4GU1CzDqqcOxH1bWqPzZ1VNTqGIXncf3A4Tfwbg50sDcOz0GeAZGwxVd04TlvJ0XOSLRVg12Y/p2F9WYYyP+6I2n+ZzXVC4twSsyamGVXcOKDb5jGU5sFpLf4RQcYAwGcK73+Yt7wTLD1XDFw1fQ1XtcfiguAxyN26bu4DIMKF8P6bQstxQmOMJhQoXYeIXoonAogtpkOip7QqVO9HH8l8h0W5fdVdWavk/4S84kVOE4jHEBQAAAABJRU5ErkJggg=='

  return {
    name: 'add-favicon',
    transformIndexHtml(html) {
      const faviconLink = `<link rel="icon" href="${favicon}">`
      return html.replace('</head>', `${faviconLink}</head>`)
    },
  }
}
