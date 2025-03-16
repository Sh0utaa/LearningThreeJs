import * as THREE from 'three';

function clearScene(scene) {
    for (let i = scene.children.length - 1; i >= 0; i--) {
        const object = scene.children[i];

        if (object.isLight || object.isCamera) continue;

        scene.remove(object);

        if (object instanceof THREE.Mesh || object instanceof THREE.Group) {
            object.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    if (child.material.map) child.material.map.dispose();
                    child.material.dispose();
                }
            });
        }
    }
}

let uiTexture, uiPlane;

function setupARUI(scene) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 512;
    canvas.height = 128;

    // Initial background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)'; // Dark semi-transparent background
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Initial text
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText("Initializing...", canvas.width / 2, canvas.height / 2 + 15);

    uiTexture = new THREE.CanvasTexture(canvas);
    const planeGeometry = new THREE.PlaneGeometry(0.5, 0.125); // UI size
    const planeMaterial = new THREE.MeshBasicMaterial({ map: uiTexture, transparent: true });

    uiPlane = new THREE.Mesh(planeGeometry, planeMaterial);
    uiPlane.position.set(0, -0.3, -0.5); // Position at the bottom
    scene.add(uiPlane);
}

/**
 * Updates the AR UI text dynamically.
 * @param {string} text - Text to display on UI.
 */

function updateARUI(text) {
    if (!uiTexture || !uiTexture.image) return;

    const canvas = uiTexture.image;
    const ctx = canvas.getContext('2d');

    // Clear previous content
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Redraw background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw new text
    ctx.fillStyle = 'white';
    ctx.font = '40px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, canvas.width / 2, canvas.height / 2 + 15);

    uiTexture.needsUpdate = true; // Refresh texture
}

export { clearScene, setupARUI, updateARUI };