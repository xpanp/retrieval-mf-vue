import {fileURLToPath,URL} from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// cdn引入element-plus
import { Plugin as importToCDN } from 'vite-plugin-cdn-import'
//代码压缩
import viteCompression from 'vite-plugin-compression';
// 可视化
import { visualizer } from "rollup-plugin-visualizer";
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    visualizer({open:true}),
    viteCompression({
      threshold: 10240,
    }),
    importToCDN({
      modules: [
        {
          name: 'vue',
          var: 'Vue',
          path: `https://unpkg.com/vue@3/dist/vue.global.js`,
        },
        {
          name: 'element-plus',
          var: 'ElementPlus',
          path: `//unpkg.com/element-plus`,
          css: "//unpkg.com/element-plus/dist/index.css"
        },
      ],
    }),
  ],
  optimizeDeps: {
    entries:['./src/App.vue'],
  },
  resolve:{
    alias:{
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server:{
    hmr:true,
    host:'0.0.0.0',
    port:5004,
    proxy:{
      "/api":{
        target:"http://10.199.130.173:8000",
        changeOrigin:true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },

    // 打包配置
    build: {
      sourcemap: false,
      chunkSizeWarningLimit:3000,
      rollupOptions: {
        output: {
          // 静态资源分类打包
          chunkFileNames: 'static/js1/[name]-[hash].js',
          entryFileNames: 'static/js2/[name]-[hash].js',
          assetFileNames: 'static/[ext]/[name]-[hash].[ext]'
        },
        // 静态资源分拆打包
        manualChunks(id){
          if(id.includes('node_modules')){
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        },
        brotliSize: false, // 不统计
        target: 'esnext',
        minify: 'tenser',// 混淆器，terser构建后文件体积更小
        tenserOptions: {
          compress: {
            //生产环境移除console
            drop_console: true,
            drop_debugger: true,
          }
        }
      }
    }
})
