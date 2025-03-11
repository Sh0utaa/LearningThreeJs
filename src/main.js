import * as THREE from 'three';

const scene = new THREE.Scene();

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

const light = new THREE.AmbientLight(0xffffff, 1.0);  // Ambient light for the scene
scene.add(light);

// Cube (works fine, no changes needed)
const cubeGeometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0xff0000 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 0, -1);
scene.add(cube);

// Second Cube (uncommented for testing)
const cubeGeometry2 = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const cubeMaterial2 = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const cube2 = new THREE.Mesh(cubeGeometry2, cubeMaterial2);
cube2.position.set(0, 0, 1);  // Position adjusted for visibility
scene.add(cube2);

// Sphere (fixed to smaller size for visibility)
// const sphereGeometry = new THREE.SphereGeometry(1, 32, 16);  // Reduced size for better view
// const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// sphere.position.set(0, 0, 2);  // Adjusted to ensure it's within camera's view
// scene.add(sphere);

// Camera setup
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 2, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));  // Ensure the camera is looking at the center
scene.add(camera);

// Renderer setup
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

// Rendering loop
function animate() {
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

// Window resize listener
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
});
