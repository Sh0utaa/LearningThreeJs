import * as THREE from 'three';

export class ARConsole {
    constructor(scene, camera, renderer) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.consoleElement = null; // The 2D plane for the console
        this.textTexture = null; // Texture for rendering text
        this.textMesh = null; // Mesh to display the texture
        this.messages = []; // Array to store console messages
        this.isARSessionActive = false; // Track AR session state

        this.initConsole();

        // Listen for AR session start/end events
        renderer.xr.addEventListener('sessionstart', () => {
            this.isARSessionActive = true;
            this.showConsole();
        });

        renderer.xr.addEventListener('sessionend', () => {
            this.isARSessionActive = false;
            this.hideConsole();
        });
    }

    // Initialize the console
    initConsole() {
        // Create a canvas for rendering text
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 256;
        const context = canvas.getContext('2d');

        // Create a texture from the canvas
        this.textTexture = new THREE.CanvasTexture(canvas);
        this.textTexture.needsUpdate = true;

        // Create a plane geometry for the console
        const geometry = new THREE.PlaneGeometry(1, 0.5); // Adjust size as needed
        const material = new THREE.MeshBasicMaterial({
            map: this.textTexture,
            transparent: true,
            side: THREE.DoubleSide,
        });

        // Create a mesh for the console
        this.textMesh = new THREE.Mesh(geometry, material);
        this.textMesh.position.set(0, 1.5, -2); // Initial position (will be updated in AR)
        this.textMesh.rotation.set(-Math.PI / 4, 0, 0); // Tilt for better visibility
        this.textMesh.visible = false; // Hide by default
        this.scene.add(this.textMesh);
    }

    // Show the console
    showConsole() {
        if (this.textMesh) {
            this.textMesh.visible = true;
        }
    }

    // Hide the console
    hideConsole() {
        if (this.textMesh) {
            this.textMesh.visible = false;
        }
    }

    // Add a message to the console
    log(message) {
        this.messages.push(message);
        if (this.messages.length > 10) {
            this.messages.shift(); // Keep only the last 10 messages
        }
        this.updateConsole();
    }

    // Update the console texture with new messages
    updateConsole() {
        const canvas = this.textTexture.image;
        const context = canvas.getContext('2d');

        // Clear the canvas
        context.clearRect(0, 0, canvas.width, canvas.height);

        // Set background and text styles
        context.fillStyle = 'rgba(0, 0, 0, 0.8)';
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.font = '20px Arial';
        context.fillStyle = 'white';

        // Render each message
        this.messages.forEach((msg, index) => {
            context.fillText(msg, 10, 30 + index * 25); // Adjust spacing as needed
        });

        // Update the texture
        this.textTexture.needsUpdate = true;
    }

    // Update the console position relative to the AR camera
    updatePosition() {
        if (this.textMesh && this.isARSessionActive) {
            // Position the console slightly in front of the AR camera
            const cameraPosition = this.camera.position.clone();
            const cameraDirection = new THREE.Vector3();
            this.camera.getWorldDirection(cameraDirection);

            this.textMesh.position.copy(cameraPosition).add(cameraDirection.multiplyScalar(1.5));
            this.textMesh.lookAt(this.camera.position); // Make it face the camera
        }
    }
}