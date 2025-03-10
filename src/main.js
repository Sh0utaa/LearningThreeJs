import * as THREE from "three";
import { XRButton } from "three/examples/jsm/webxr/XRButton.js";

// Create scene
const scene = new THREE.Scene();

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(XRButton.createButton(renderer)); // Adds "Enter AR" button

// Listen for WebXR session start
renderer.xr.addEventListener("sessionstart", () => {
    const referenceSpace = renderer.xr.getReferenceSpace(); // Gets the AR reference space

    // Create a fixed anchor (Group)
    const fixedAnchor = new THREE.Group();
    fixedAnchor.position.set(0, 0, -2); // Set anchor 2 meters in front of the user
    scene.add(fixedAnchor);

    // Create cube
    const cubeGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
    const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(-0.3, 0, 0); // Slightly to the left
    fixedAnchor.add(cube);

    // Create sphere
    const sphereGeometry = new THREE.SphereGeometry(0.15, 32, 32);
    const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(0.3, 0, 0); // Slightly to the right
    fixedAnchor.add(sphere);
});

// Animate and render loop
function animate() {
    renderer.setAnimationLoop(() => {
        renderer.render(scene, renderer.xr.getCamera());
    });
}

animate();
