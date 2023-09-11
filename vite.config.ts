import { fileURLToPath, URL } from 'node:url'
import path from 'path'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    'process.env': process.env
  },
  build: {
    // 在 outDir 中生成 manifest.json
    // manifest: true,
    // rollupOptions: {
    //   // 覆盖默认的 .html 入口
    // input: './src/main.ts',
    //   output: {
    //     entryFileNames: `assets/[name].js`,
    //     chunkFileNames: `assets/[name].js`,
    //     assetFileNames: `assets/[name].[ext]`
    //   }
    // },
    // rollupOptions: {
    //   external: ['vue','buffer','jszip'],
    //   output: {
    //     globals: {
    //       vue: 'Vue'
    //     }
    //   }
    // },
    cssCodeSplit: true,
    lib: {
      entry: path.resolve(__dirname, 'src/main.ts'),
      name: 'smth.top',
      formats: ['iife'],
      fileName: (format) => `smth_to_app.${format}.js`
    }
  },
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
