import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // Listen on all network interfaces
    port: 3000, // Optional: Specify a port
    
    allowedHosts: [
      "8c0e-31-146-31-202.ngrok-free.app",
    ]
  },
});