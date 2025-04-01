// import * as THREE from 'three';

// let debugInfo = document.getElementById("debug-text");

// export class TouchControls {
//     constructor(renderer, scene, camera) {
//         this.renderer = renderer;
//         this.scene = scene;
//         this.camera = camera;

//         // Create a pivot group for all AR objects
//         this.pivotGroup = new THREE.Group();
//         this.scene.add(this.pivotGroup);

//         this.scene.children.forEach(child => {
//             if (child !== this.pivotGroup) {  // Avoid adding the pivot to itself
//                 this.pivotGroup.add(child);
//                 child.userData.isARObject = true;  // Mark as AR object
//             }
//         });

//         // Variables for touch movement
//         this.touchStartDistance = null;
//         this.touchX = null;
//         this.touchY = null;
//         this.wasScaling = false;
//         this.sharedScale = new THREE.Vector3(0.25, 0.25, 0.25);
//         this.arSessionActive = false;

//         // Bind event handlers
//         this.onTouchStart = this.onTouchStart.bind(this);
//         this.onTouchMove = this.onTouchMove.bind(this);
//         this.onTouchEnd = this.onTouchEnd.bind(this);

//         // Add touch event listeners
//         document.addEventListener('touchstart', this.onTouchStart);
//         document.addEventListener('touchmove', this.onTouchMove);
//         document.addEventListener('touchend', this.onTouchEnd);
//     }

//     // Add model to the pivot group
//     addARModel(model) {
//         model.userData.isARObject = true;
//         this.pivotGroup.add(model);
//         model.scale.copy(this.sharedScale || new THREE.Vector3(1, 1, 1));
//     }

//     // Enable/disable touch controls
//     setARSessionActive(active) {
//         this.arSessionActive = active;
//     }

//     // Touch Start Event
//     onTouchStart(event) {
//         if (!this.arSessionActive) return;

//         if (event.touches.length === 2) {
//             const dx = event.touches[0].clientX - event.touches[1].clientX;
//             const dy = event.touches[0].clientY - event.touches[1].clientY;
//             this.touchStartDistance = Math.sqrt(dx * dx + dy * dy);
//         }

//         const touch = event.touches[0];
//         this.touchX = touch.clientX;
//         this.touchY = touch.clientY;
//     }

//     // Touch Move Event
//     onTouchMove(event) {
//         if (!this.arSessionActive) return;
    
//         const touch = event.changedTouches[0];
//         const currentTouchX = touch.clientX;
//         const currentTouchY = touch.clientY;
//         const deltaX = currentTouchX - this.touchX;
//         const deltaY = currentTouchY - this.touchY;
    
//         if (event.touches.length === 1 && !this.wasScaling) {
//             const rotationSpeed = 0.005;
    
//             // Get camera-relative axis for rotation
//             const yAxis = new THREE.Vector3(0, 1, 0);
//             const xAxis = new THREE.Vector3(1, 0, 0).applyQuaternion(this.camera.quaternion);
    
//             // Create quaternions for smooth rotation
//             const yRotation = new THREE.Quaternion().setFromAxisAngle(yAxis, -deltaX * rotationSpeed);
//             const xRotation = new THREE.Quaternion().setFromAxisAngle(xAxis, -deltaY * rotationSpeed);
    
//             // Apply rotation to pivotGroup
//             this.pivotGroup.quaternion.premultiply(yRotation).premultiply(xRotation);
    
//             // Clamp vertical rotation to prevent flipping
//             const euler = new THREE.Euler();
//             euler.setFromQuaternion(this.pivotGroup.quaternion, 'YXZ');
//             euler.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.x)); // Limit up/down movement
//             this.pivotGroup.quaternion.setFromEuler(euler);
//         }
    
//         if (event.touches.length === 2 && this.touchStartDistance) {
//             this.wasScaling = true;
    
//             const dx = event.touches[0].clientX - event.touches[1].clientX;
//             const dy = event.touches[0].clientY - event.touches[1].clientY;
//             const touchDistance = Math.sqrt(dx * dx + dy * dy);
//             const scaleFactor = touchDistance / this.touchStartDistance;
    
//             this.sharedScale.multiplyScalar(scaleFactor);
//             this.pivotGroup.scale.copy(this.sharedScale);
    
//             this.touchStartDistance = touchDistance;
//         }
    
//         this.touchX = currentTouchX;
//         this.touchY = currentTouchY;
//     }
    
    
//     // Touch End Event
//     onTouchEnd(event) {
//         if (!this.arSessionActive) return;

//         if (event.touches.length === 0) {
//             setTimeout(() => {
//                 this.wasScaling = false;
//             }, 100);
//         }
//     }
// }