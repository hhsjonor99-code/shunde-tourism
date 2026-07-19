import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// GitHub Pages: 仓库名 shunde-tourism
// 部署地址：https://hhsjonor99-code.github.io/shunde-tourism/
export default defineConfig({
  plugins: [react()],
  base: '/shunde-tourism/',
})