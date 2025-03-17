import * as THREE from 'three';

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
        this.sharedScale = new THREE.Vector3(1, 1, 1);
        this.arSessionActive = false; // Track if AR session is active

        // Bind event handlers
        this.onTouchStart = this.onTouchStart.bind(this);
        this.onTouchMove = this.onTouchMove.bind(this);
        this.onTouchEnd = this.onTouchEnd.bind(this);

        // Add touch event listeners
        this.renderer.domElement.addEventListener('touchstart', this.onTouchStart);
        this.renderer.domElement.addEventListener('touchmove', this.onTouchMove);
        this.renderer.domElement.addEventListener('touchend', this.onTouchEnd);
    }

    // Enable/disable touch controls based on AR session state
    setARSessionActive(active) {
        this.arSessionActive = active;
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
            // Rotate models based on touch movement
            spawnedModels.forEach(model => {
                const euler = new THREE.Euler().setFromQuaternion(model.quaternion, "YXZ");
                euler.y += deltaX * 0.01; // Rotate around Y axis
                euler.x += deltaY * 0.01; // Rotate around X axis
                model.quaternion.setFromEuler(euler);
            });

            if (spawnedModels.length > 0) {
                this.sharedRotation.copy(spawnedModels[0].rotation);
            }
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
    }
}