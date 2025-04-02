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

    getTouchedObject(event) {
        const touch = event.touches[0]; // Get first touch
        const touchX = (touch.clientX / window.innerWidth) * 2 - 1;
        const touchY = -(touch.clientY / window.innerHeight) * 2 + 1;
    
        // Raycaster setup
        const raycaster = new THREE.Raycaster();
        const touchPoint = new THREE.Vector2(touchX, touchY);
        raycaster.setFromCamera(touchPoint, this.camera);
    
        // Check all objects in the scene
        const intersects = raycaster.intersectObjects(this.scene.children, true);
    
        if (intersects.length > 0) {
            return intersects[0].object;
        }
        return null;
    }

    // Touch Start Event
    onTouchStart(event) {
        if (!this.arSessionActive) return;

        const touchedObject = this.getTouchedObject(event);

        if (touchedObject) {
            this.scene.children.forEach(object => {
                if (object.isMesh) {
                    object.material.transparent = true;
                    object.material.opacity = (object === touchedObject) ? 1.0 : 0.3;
                }
            });
    
            this.logDebugInfo(`Touching: ${touchedObject.name}`);
        } else {
            this.scene.children.forEach(object => {
                if (object.isMesh) {
                    object.material.transparent = false;
                    object.material.opacity = 1.0;
                }
            });
    
            this.logDebugInfo(`Touching: Nothing`);
        }

        if (event.touches.length === 2) {
            const dx = event.touches[0].clientX - event.touches[1].clientX;
            const dy = event.touches[0].clientY - event.touches[1].clientY;
            this.touchStartDistance = Math.sqrt(dx * dx + dy * dy);
        }

        const touch = event.touches[0];
        this.touchX = touch.clientX;
        this.touchY = touch.clientY;

        // Log touch start event
        // this.logDebugInfo(`Touch Start: ${event.touches.length} touches`);
    }

    // Touch Move Event
    onTouchMove(event) {
        if (!this.arSessionActive) return;

        const spawnedModels = this.scene.children.filter(child => 
            child.isObject3D && child.userData.isARObject
        );
    
        if (spawnedModels.length === 0) return;
    
        const touch = event.changedTouches[0];
        const currentTouchX = touch.clientX;
        const currentTouchY = touch.clientY;
        
        // Always use current touch position (no delta accumulation)
        const deltaX = currentTouchX - this.touchX;
        const deltaY = currentTouchY - this.touchY;
    
        if (event.touches.length === 1 && !this.wasScaling) {
            // Fixed rotation speed (adjust this number)
            const rotationSpeed = 0.01;

            // Calculate center point
            const center = new THREE.Vector3();
            spawnedModels.forEach(model => center.add(model.position));
            center.divideScalar(spawnedModels.length);
            
            // Use more natural axes: Y for horizontal drags, X for vertical drags
            const xAxis = new THREE.Vector3(1, 0, 0);  // Rotate around X (vertical drags)
            const yAxis = new THREE.Vector3(0, 1, 0);  // Rotate around Y (horizontal drags)
            
            const xRotation = new THREE.Quaternion().setFromAxisAngle(xAxis, deltaY * rotationSpeed);
            const yRotation = new THREE.Quaternion().setFromAxisAngle(yAxis, deltaX * rotationSpeed);
            
            const totalRotation = new THREE.Quaternion();
            totalRotation.multiplyQuaternions(yRotation, xRotation);
            
            spawnedModels.forEach(model => {
                model.position.sub(center);
                
                // Apply the correct rotation order
                model.position.applyQuaternion(totalRotation);
                
                model.position.add(center);
            
                // Rotate the model itself to match the orbiting motion
                model.quaternion.multiplyQuaternions(totalRotation, model.quaternion);
            });
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