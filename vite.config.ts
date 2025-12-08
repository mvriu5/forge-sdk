import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import dts from "vite-plugin-dts"
import path from "node:path"

export default defineConfig({
    plugins: [
        react(),
        dts({
            insertTypesEntry: true,
            include: ["src"],
        }),
    ],
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/index.ts"),
            name: "WidgetSDK",
            fileName: (format) =>
                format === "es" ? "widget-sdk.es.js" : "widget-sdk.cjs",
            formats: ["es", "cjs"],
        },
        rollupOptions: {
            external: ["react", "react-dom"],
            output: {
                globals: {
                    react: "React",
                    "react-dom": "ReactDOM",
                },
            },
        },
        sourcemap: true,
    },
})