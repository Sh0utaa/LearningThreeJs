import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    host: true, // Listen on all network interfaces
    port: 3000, // Optional: Specify a port
    
    allowedHosts: [
      "6b06-149-3-101-219.ngrok-free.app",
    ],
    
    plugins: [react()],
    server: {
      open: true,
    },
    base: "/", // or your custom subpath if you're using one
  },
});