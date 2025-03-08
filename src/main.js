import * as THREE from 'three';
import './style.css';

// Scene
const scene = new THREE.Scene();

// Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.set(2, 2, 5);

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(sizes.width, sizes.height);
document.body.appendChild(renderer.domElement);

// Enable shadows in the renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Cube Geometry and Material
const cubeGeometry = new THREE.BoxGeometry();
const cubeMaterial = new THREE.MeshStandardMaterial({ color: "#FF0000" });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(-1.5, 0.5, 0); // Move the cube left
cube.castShadow = true;
scene.add(cube);

const sphereGeometry = new THREE.SphereGeometry(0.75, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: "#ef8354" });
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.position.set(1, 0.5, 0); // Move the sphere right
sphere.castShadow = true;
scene.add(sphere);

const coneGeometry = new THREE.ConeGeometry();
const coneMaterial = new THREE.MeshStandardMaterial({ color: "#fffe50" });
const cone = new THREE.Mesh(coneGeometry, coneMaterial);
cone.position.set(4, 0.5, 0); // Move the cone right
cone.castShadow = true;
scene.add(cone);

// Lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional Light (for shadows)
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

// Directional Light Shadow Settings
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 20;

// Gyroscopic Controls
let alpha = 0, beta = 0, gamma = 0;

window.addEventListener('deviceorientation', (event) => {
  alpha = event.alpha; // Rotation around the Z-axis (0 to 360 degrees)
  beta = event.beta;   // Rotation around the X-axis (-180 to 180 degrees)
  gamma = event.gamma; // Rotation around the Y-axis (-90 to 90 degrees)

  // Update camera position based on device orientation
  camera.position.x = gamma * 0.1; // Adjust sensitivity as needed
  camera.position.y = beta * 0.1;  // Adjust sensitivity as needed
  camera.lookAt(scene.position);    // Make the camera look at the scene center
});

// Zoom Controls (DeviceMotionEvent)
let initialZ = null;

window.addEventListener('devicemotion', (event) => {
  const acceleration = event.accelerationIncludingGravity;

  if (!initialZ) {
    // Set the initial Z value on first motion event
    initialZ = acceleration.z;
  }

  // Calculate the change in Z (zoom factor)
  const deltaZ = acceleration.z - initialZ;

  // Adjust camera position.z based on deltaZ
  camera.position.z = 5 + deltaZ * 0.1; // Adjust sensitivity as needed
  camera.lookAt(scene.position); // Ensure the camera keeps looking at the scene center
});

// Access the device camera (back-facing)
const video = document.createElement('video');
video.autoplay = true;

navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
  .then((stream) => {
    video.srcObject = stream;
  })
  .catch((error) => {
    console.error('Error accessing the camera:', error);
  });

// Create a video texture
const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;

scene.background = videoTexture;

// Animation Loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  renderer.setSize(sizes.width, sizes.height);
});