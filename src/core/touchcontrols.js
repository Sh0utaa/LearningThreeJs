import * as THREE from 'three';

let debugInfo = document.getElementById("debug-text");

export class TouchControls {
    constructor(renderer, scene, camera) {
        this.renderer = renderer;
        this.scene = scene;
        this.camera = camera;

        // Variables for touch movement
        this.touchStartDistance = null;
        this.touchX = null;
        this.touchY = null;
        this.wasScaling = false;
        this.sharedRotation = new THREE.Euler();
        this.sharedScale = new THREE.Vector3(0.25, 0.25, 0.25);
        this.arSessionActive = false;

        // Bind event handlers
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);

        // Add touch event listeners
        document.addEventListener('touchstart', this.onTouchStart);
        document.addEventListener('touchmove', this.onTouchMove);
        document.addEventListener('touchend', this.onTouchEnd);
    }

    // Enable/disable touch controls based on AR session state
    setARSessionActive(active) {
        this.arSessionActive = active;
    }

    // Log debug information to the overlay
    logDebugInfo(message) {
        if (debugInfo) {
            debugInfo.innerHTML = message;
        }
    }

    // Touch Start Event
    onTouchStart(event) {
        if (!this.arSessionActive) return; // Only work during AR session

        if (event.touches.length === 2) {
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            this.touchStartDistance = Math.sqrt(dx * dx + dy * dy);
        }

        const touch = event.touches[0];
        this.touchX = touch.clientX;
        this.touchY = touch.clientY;

        // Log touch start event
        this.logDebugInfo(`Touch Start: ${event.touches.length} touches`);
    }

    // Touch Move Event
    onTouchMove(event) {
        if (!this.arSessionActive) return; // Only work during AR session

        const spawnedModels = this.scene.children.filter(child => child.isObject3D && child.userData.isARObject); // Only interact with AR objects

        if (spawnedModels.length === 0) return;

        const touch = event.changedTouches[0];
        const currentTouchX = touch.clientX;
        const currentTouchY = touch.clientY;
        const deltaX = currentTouchX - (this.touchX || currentTouchX);
        const deltaY = currentTouchY - (this.touchY || currentTouchY);

        if (event.touches.length === 1 && !this.wasScaling) {
            // Rotate models based on touch movement (relative to the camera)
            spawnedModels.forEach(model => {
                // Create a quaternion for the rotation
                const quaternion = new THREE.Quaternion();

                // Rotate around the camera's Y axis (horizontal movement)
                const yAxis = new THREE.Vector3(0, 1, 0).applyQuaternion(this.camera.quaternion);
                quaternion.setFromAxisAngle(yAxis, deltaX * 0.01);

                // Rotate around the camera's X axis (vertical movement)
                const xAxis = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
                quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(xAxis, deltaY * 0.01));

                // Apply the rotation to the model
                model.quaternion.multiply(quaternion);
            });

            if (spawnedModels.length > 0) {
                this.sharedRotation.copy(spawnedModels[0].rotation);
            }

            // Log rotation
            this.logDebugInfo(`Rotation: Y=${this.sharedRotation.y.toFixed(2)}, X=${this.sharedRotation.x.toFixed(2)}`);
        }

        if (event.touches.length === 2 && this.touchStartDistance) {
            this.wasScaling = true;

            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            const touchDistance = Math.sqrt(dx * dx + dy * dy);
            const scaleFactor = touchDistance / this.touchStartDistance;

            this.sharedScale.multiplyScalar(scaleFactor);

            spawnedModels.forEach(model => {
                model.scale.copy(this.sharedScale);
            });

            this.touchStartDistance = touchDistance;

            // Log scaling
            this.logDebugInfo(`Scaling: ${this.sharedScale.toArray().map(v => v.toFixed(2)).join(', ')}`);
        }

        this.touchX = currentTouchX;
        this.touchY = currentTouchY;
    }

    // Touch End Event
    onTouchEnd(event) {
        if (!this.arSessionActive) return; // Only work during AR session

        if (event.touches.length === 0) {
            setTimeout(() => {
                this.wasScaling = false;
            }, 100);
        }

        // Log touch end event
        this.logDebugInfo(`Touch End: ${event.touches.length} touches`);
    }
}