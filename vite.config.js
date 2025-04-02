import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // Listen on all network interfaces
    port: 3000, // Optional: Specify a port
    
    allowedHosts: [
      "42d3-149-3-101-219.ngrok-free.app",
    ]
  },
});