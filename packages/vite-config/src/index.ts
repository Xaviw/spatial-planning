import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import { defineConfig } from "vite";

// https://vitejs.dev/config/

export default defineConfig({
  plugins: [vue(), vueJsx()],
  build: {
    rollupOptions: {
      external: ["vue", "vue-router"],
      output: {
        globals: {
          vue: "Vue",
        },
      },
    },
    minify: false,
    lib: {
      entry: "./src/entry.ts",
      name: "Components",
      fileName: "components",
      // 导出模块格式
      formats: ["es"],
    },
  },
});
