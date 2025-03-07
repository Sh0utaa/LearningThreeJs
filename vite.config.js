import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: '0.0.0.0', // Listen on all network interfaces
    port: 3000, // Optional: Specify a port
    
    allowedHosts: [
      '879a-149-3-101-219.ngrok-free.app', // Add your ngrok host here
    ],
  },
});