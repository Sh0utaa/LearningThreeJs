import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 2;

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);


const box = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshNormalMaterial());
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), new THREE.MeshNormalMaterial());
const cone = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 32), new THREE.MeshNormalMaterial());

scene.add(box, sphere, cone);

const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
const linePoints1 = [new THREE.Vector3(-2, 0, 0), new THREE.Vector3(2, 0, 0)];
const line1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(linePoints1), lineMaterial);
scene.add(line1);

const circlePoints = [];
const radius = 2;
for (let i = 0; i <= 64; i++) {
  const angle = (i / 64) * Math.PI * 2;
  circlePoints.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
}
const line2 = new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(circlePoints), lineMaterial);
scene.add(line2);

const spiralPoints = [];
for (let i = 0; i <= 100; i++) {
  const angle = i * 0.1;
  const y = Math.sin(angle * 2);
  spiralPoints.push(new THREE.Vector3(Math.cos(angle) * 1.5, y, Math.sin(angle) * 1.5));
}
const line3 = new THREE.Line(new THREE.BufferGeometry().setFromPoints(spiralPoints), lineMaterial);
scene.add(line3);

let t = 0;

function animate() {
  requestAnimationFrame(animate);
  t += 0.01;

  // 1. Box: move back and forth on X axis
  box.position.x = Math.sin(t) * 2;

  // 2. Sphere: move in a circular path (around origin)
  sphere.position.x = Math.cos(t) * 2;
  sphere.position.z = Math.sin(t) * 2;

  // 3. Cone: move in a spiral (circle + up/down)
  cone.position.x = Math.cos(t) * 1.5;
  cone.position.z = Math.sin(t) * 1.5;
  cone.position.y = Math.sin(t * 2) * 1;

  controls.update();
  renderer.render(scene, camera);
}
animate();


// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

