import { defineConfig } from "vite";

export default defineConfig({
	root: ".",
	build: {
		outDir: "dist",
		sourcemap: true,
	},
	server: {
		port: 5173,
		host: true,
		open: false,
	},
	resolve: {
		extensions: [".js", ".ts", ".jsx", ".tsx", ".json"],
	},
});