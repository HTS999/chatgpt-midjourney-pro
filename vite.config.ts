import path from 'path'
import type { PluginOption } from 'vite'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

function setupPlugins(env: ImportMetaEnv): PluginOption[] {
  return [
    vue(),
    env.VITE_GLOB_APP_PWA === 'true' && VitePWA({
      injectRegister: 'auto',
      manifest: {
        name: 'chatGPT',
        short_name: 'chatGPT',
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
    }),
  ]
}

export default defineConfig((env) => {
  const viteEnv = loadEnv(env.mode, process.cwd()) as unknown as ImportMetaEnv

  return {
    resolve: {
      alias: {
        '@': path.resolve(process.cwd(), 'src'),
      },
    },
    plugins: setupPlugins(viteEnv),
    server: {
      host: 'wvip.minihuo.com',
      port: 1102,
      open: false,
      proxy: {
        '/api': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true, // 允许跨域
          rewrite: path => path.replace('/api/', '/'),
        },
        '/vapi': {
          target: viteEnv.VITE_APP_DATA_URL,
          changeOrigin: true, // 允许跨域
          rewrite: path => path.replace('/vapi/', '/'),
        },

        '/mjapi/mj/task': {
          target: viteEnv.VITE_MJ_SERVER,
          changeOrigin: true, // 允许跨域
          rewrite: path => path.replace('/mjapi/', '/'),
          headers:{
            'Authorization':`Basic ${viteEnv.VITE_MJ_API_SECRET}`
          }
        },
        '/mjapi': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true, // 允许跨域
          //rewrite: path => path.replace('/api/', '/'),
        },
         '/uploads': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true, // 允许跨域
          //rewrite: path => path.replace('/api/', '/'),
        }, 
        '/openapi': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true, // 允许跨域
          //rewrite: path => path.replace('/api/', '/'),
        },
         '/sunoapi': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true, 
        },
        '/ideogram': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true, 
        },
         '/luma': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true, 
        },
         '/runway': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true, 
        },
         '/kling': {
          target: viteEnv.VITE_APP_API_BASE_URL,
          changeOrigin: true, 
        }
        //
        
      },
    },
    build: {
      reportCompressedSize: false,
      sourcemap: false,
      commonjsOptions: {
        ignoreTryCatch: false,
      },
    },
  }
})
