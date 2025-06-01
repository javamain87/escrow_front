import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  base: '/',
  plugins: [vue()],
  server: {
    // ✅ Vite에서는 아래처럼 직접 사용하는 것이 아님 ❌
    // historyApiFallback: true ← 이건 Webpack 용임

    // 대신 기본 SPA 모드는 자동으로 history fallback이 동작함
    // 만약 문제 있으면 다음처럼 rewrite 해줘야 함
    fs: {
      strict: false
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ''
      }
    }
  },
  build: {
    ssr: false // ✅ 렌더 서버 사이드 렌더링이 아니라는 점 명시
  }
})
