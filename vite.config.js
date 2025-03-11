import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    host: true, // Listen on all network interfaces
    port: 3000, // Optional: Specify a port
    
    allowedHosts: [
      "b32e-149-3-101-219.ngrok-free.app",
      "618a-149-3-101-219.ngrok-free.app "
    ]
  },
});