import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 3000, // Optional: Specify a port
    
    allowedHosts: [
      '879a-149-3-101-219.ngrok-free.app',
      "f099-149-3-101-219.ngrok-free.app",
      "b18e-149-3-101-219.ngrok-free.app",
      "8a5f-149-3-101-219.ngrok-free.app"
    ],
  },
});