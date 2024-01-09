import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import {fileURLToPath} from "url";

// https://vitejs.dev/config/
export default defineConfig({
    server: {
        port: 8080
    },
    preview: {
        port: 8080
    },
    plugins: [vue()],
    resolve: {
        alias: {
            '@': fileURLToPath(new URL('./src', import.meta.url))
        }
    },
    css: {
        preprocessorOptions: {
            scss: {
                additionalData: '@import "@/styles/components/variables.scss";'
            }
        }
    }
})
