import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { scene, camera, renderer } from './scene';

function setupOrbitControls(camera, renderer) {
    const controls = new OrbitControls(camera, renderer.domElement);

    // Enable damping (inertia)
    controls.enableDamping = true;
    controls.dampingFactor = 0.05; // Lower values make it smoother

    // Adjust rotation, zoom, and pan speed
    controls.rotateSpeed = 1.5; // Faster rotation
    controls.zoomSpeed = 1.2; // Smoother zoom
    controls.panSpeed = 1.0; // Smoother pan

    // Enable smooth zoom and pan
    controls.smoothZoom = true;
    controls.smoothPan = true;

    // Optional: Limit zoom distance
    controls.minDistance = 5; // Minimum zoom distance
    controls.maxDistance = 50; // Maximum zoom distance

    // Optional: Limit vertical rotation (polar angle)
    controls.minPolarAngle = 0; // Minimum vertical angle (0 = top-down)
    controls.maxPolarAngle = Math.PI; // Maximum vertical angle (Math.PI = bottom-up)

    return controls;
}

export { setupOrbitControls };
