import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

import legacyPlugin from '@vitejs/plugin-legacy';
// 引入svg插件
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

const pathResolve = (pathStr) => {
  return path.resolve(__dirname, pathStr)
}

import { createRequire } from 'node:module'
const require = createRequire( import.meta.url )
import ckeditor5 from '@ckeditor/vite-plugin-ckeditor5'
// https://vitejs.dev/config/
export default defineConfig({
  base:"/myadmin/",
  server: {
    port: 7900,
    open: true,
    //设置代理
    proxy:{
      '/api':{
        target:'http://localhost:5200',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        ws:true
      },
      '/socket.io': {
        target: 'http://localhost:5200', // 你的后端服务器地址
        ws: true,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/socket.io/, ''),
      },
    },

  }
  ,

  plugins: [vue(),
    ckeditor5({ theme: require.resolve( '@ckeditor/ckeditor5-theme-lark') }),
    createSvgIconsPlugin({
      // 指定需要缓存的svg图标文件夹，即需要识别的svg都应该放在这个文件夹下
      // iconDirs: [path.resolve(process.cwd(), 'src/assets/svgs')],
      // 或
      iconDirs: [pathResolve('./src/icons/svg')],
      // 指定symbolId格式（这里的配置与6.2步骤中的引入svg组件的name配置项写法有关）
      symbolId: 'icon-[dir]-[name]',
    }),
    // 浏览器兼容问题配置
    legacyPlugin({
      targets: [],
      additionalLegacyPolyfills: ['regenerator-runtime/runtime'],
      renderLegacyChunks: true,
      polyfills: [
        'es.symbol',
        'es.promise',
        'es.promise.finally',
        'es/map',
        'es/set',
        'es.array.filter',
        'es.array.for-each',
        'es.array.flat-map',
        'es.object.define-properties',
        'es.object.define-property',
        'es.object.get-own-property-descriptor',
        'es.object.get-own-property-descriptors',
        'es.object.keys',
        'es.object.to-string',
        'web.dom-collections.for-each',
        'esnext.global-this',
        'esnext.string.match-all'
      ]
    })


  ],
  build: {
    target: 'es2015'
  },
  css: {
    /* CSS 预处理器 */
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/scss/variable.scss";
                         @import "@/assets/scss/mixin.scss"; `
      }
    }
  },
  resolve: {
    // 设置路径别名
    alias: {
      '@': pathResolve('src'),
    }
  },

})


