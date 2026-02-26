import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  preview: {
    allowedHosts:[
      'hp1x8advk09t0f8r8udpwjc7g.js.wpenginepowered.com'
    ]
  }
})
