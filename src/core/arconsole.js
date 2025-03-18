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

        this.initConsole();
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
        const geometry = new THREE.PlaneGeometry(2, 1); // Adjust size as needed
        const material = new THREE.MeshBasicMaterial({
            map: this.textTexture,
            transparent: true,
            side: THREE.DoubleSide,
        });

        // Create a mesh for the console
        this.textMesh = new THREE.Mesh(geometry, material);
        this.textMesh.position.set(0, 1.5, -2); // Position in front of the camera
        this.textMesh.rotation.set(-Math.PI / 4, 0, 0); // Tilt for better visibility
        this.scene.add(this.textMesh);
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

    // Position the console relative to the camera
    updatePosition() {
        if (this.textMesh) {
            const cameraPosition = this.camera.position.clone();
            const cameraDirection = new THREE.Vector3();
            this.camera.getWorldDirection(cameraDirection);

            // Position the console slightly in front of the camera
            this.textMesh.position.copy(cameraPosition).add(cameraDirection.multiplyScalar(2));
            this.textMesh.lookAt(this.camera.position); // Make it face the camera
        }
    }
}