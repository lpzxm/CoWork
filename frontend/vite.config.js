import { createRequire } from 'node:module'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import reactJsSupport from 'vite-plugin-react-js-support'
import { visualizer } from 'rollup-plugin-visualizer'
import resolveConfig from 'tailwindcss/resolveConfig'

const require = createRequire(import.meta.url)
const { theme } = resolveConfig(require('./tailwind.config.js'))

export default defineConfig(({ mode }) => ({
    define: {
        __TW_COLORS__: JSON.stringify(theme.colors),
        __TW_HEIGHT__: JSON.stringify(theme.height),
        __TW_SCREENS__: JSON.stringify(theme.screens),
    },
    plugins: [
        reactJsSupport(),
        tsconfigPaths(),
        react({
            include: '**/*.{js,jsx,ts,tsx}',
        }),
        mode === 'analyze' &&
            visualizer({
                open: true,
                gzipSize: true,
                filename: 'dist/stats.html',
            }),
    ].filter(Boolean),
    esbuild: {
        loader: 'jsx',
        include: /src[\\/].*\.[jt]sx?$/,
    },
    optimizeDeps: {
        esbuildOptions: {
            loader: {
                '.js': 'jsx',
            },
        },
    },
    build: {
        // ApexCharts + vendor libs exceed 500 kB; chunks are already split by domain.
        chunkSizeWarningLimit: 600,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (!id.includes('node_modules')) {
                        return
                    }

                    if (id.includes('@mui') || id.includes('@emotion')) {
                        return 'vendor-mui'
                    }

                    if (
                        id.includes('apexcharts') ||
                        id.includes('react-apexcharts')
                    ) {
                        return 'vendor-charts'
                    }

                    if (id.includes('framer-motion')) {
                        return 'vendor-motion'
                    }

                    if (id.includes('@fullcalendar')) {
                        return 'vendor-calendar'
                    }

                    if (
                        id.includes('react-dom') ||
                        id.includes('react-router') ||
                        id.includes('react-redux') ||
                        id.includes('@reduxjs') ||
                        id.includes('redux')
                    ) {
                        return 'vendor-react'
                    }

                    return 'vendor'
                },
            },
        },
    },
}))
