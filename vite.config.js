import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import frappeui from "frappe-ui/vite";

function customFrappeUIPlugin() {
  const port = 8080; // You can change this if needed
  const webserver_port = 8000; // Default port for Frappe server
  const source = '^/(app|login|api|assets|files)';

  // Since we're running the Frappe server in Docker and frontend locally,
  // we can set the proxy target to the Docker container's exposed port.
  const proxy = {};
  proxy[source] = {
    target: `http://localhost:${webserver_port}`, // Use localhost and the port mapped from Docker
    ws: true,
    // Optionally, you can adjust or remove the router function
    router: function (req) {
      const site_name = req.headers.host.split(':')[0];
      return `http://${site_name}:${webserver_port}`;
    },
    changeOrigin: true,
  };

  return {
    name: 'custom-frappeui-vite-plugin',
    config: () => ({
      server: {
        port: port,
        proxy: proxy,
      },
    }),
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    customFrappeUIPlugin(),
  ],
  server: {
    sourcemap: false, // Disable source map for dev mode as well
  },
  cacheDir: false,
  build: {
    outDir: 'dist', // Output directory for the build
    emptyOutDir: true, // Clear the output directory before building
    sourcemap: false, // Disable sourcemap generation
    cssCodeSplit: true, // Enable CSS code splitting
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Create separate chunks for libraries or large modules
          if (id.includes('node_modules')) {
            return 'vendor';
          } else if (id.includes('/pages/')) {
            return 'pages';
          }
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  optimizeDeps: {
    include: ["frappe-ui > feather-icons", "showdown", "engine.io-client"],
  },
})
