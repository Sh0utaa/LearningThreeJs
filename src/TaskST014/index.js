import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls(camera, renderer.domElement);

// Objects with original colors
const box = new THREE.Mesh(
  new THREE.BoxGeometry(0.4, 0.4, 0.4),
  new THREE.MeshStandardMaterial({ color: 0x00ff00 })
);
box.userData.originalColor = 0x00ff00;

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 32, 32),
  new THREE.MeshStandardMaterial({ color: 0x0000ff })
);
sphere.userData.originalColor = 0x0000ff;
sphere.userData.radius = 0.3;

const cone = new THREE.Mesh(
  new THREE.ConeGeometry(0.3, 0.8, 32),
  new THREE.MeshStandardMaterial({ color: 0xffff00 })
);
cone.userData.originalColor = 0xffff00;
cone.userData.radius = 0.3;
cone.userData.height = 0.8;

scene.add(box, sphere, cone);

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.3));
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5);
scene.add(directionalLight);
scene.add(new THREE.PointLight(0xffffff, 1, 50).position.set(-5, 5, 5));

// Path visuals (same as before)
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
scene.add(new THREE.Line(
  new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2, 0, 0), new THREE.Vector3(2, 0, 0)]),
  lineMaterial
));

const circlePoints = [];
for (let i = 0; i <= 64; i++) {
  const angle = (i / 64) * Math.PI * 2;
  circlePoints.push(new THREE.Vector3(Math.cos(angle) * 2, 0, Math.sin(angle) * 2));
}
scene.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(circlePoints), lineMaterial));

const spiralPoints = [];
for (let i = 0; i <= 100; i++) {
  const angle = i * 0.1;
  spiralPoints.push(new THREE.Vector3(Math.cos(angle) * 1.5, Math.sin(angle * 2) * 1, Math.sin(angle) * 1.5));
}
scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(spiralPoints), lineMaterial));

// Collision detection functions
function boxToSphereCollision(box, sphere) {
  // Get box dimensions and position
  const boxSize = new THREE.Vector3();
  box.geometry.computeBoundingBox();
  box.geometry.boundingBox.getSize(boxSize);
  boxSize.multiplyScalar(0.5); // Half extents
  
  const boxPos = box.position.clone();
  const spherePos = sphere.position.clone();
  const sphereRadius = sphere.userData.radius;
  
  // Find closest point on box to sphere
  const closest = new THREE.Vector3();
  closest.x = Math.max(boxPos.x - boxSize.x, Math.min(spherePos.x, boxPos.x + boxSize.x));
  closest.y = Math.max(boxPos.y - boxSize.y, Math.min(spherePos.y, boxPos.y + boxSize.y));
  closest.z = Math.max(boxPos.z - boxSize.z, Math.min(spherePos.z, boxPos.z + boxSize.z));
  
  // Check if closest point is inside sphere
  const distance = closest.distanceTo(spherePos);
  return distance < sphereRadius;
}

const toggleBtn = document.getElementById('toggleBtn');
toggleBtn.addEventListener('click', () => {
  paused = !paused;
  toggleBtn.textContent = paused ? 'Play' : 'Pause';
});


function sphereToSphereCollision(sphere1, sphere2) {
  const distance = sphere1.position.distanceTo(sphere2.position);
  return distance < (sphere1.userData.radius + sphere2.userData.radius);
}

function coneToSphereCollision(cone, sphere) {
  // Approximate cone with a sphere at base and a cylinder
  const spherePos = sphere.position.clone();
  const conePos = cone.position.clone();
  const coneHeight = cone.userData.height;
  const coneRadius = cone.userData.radius;
  const sphereRadius = sphere.userData.radius;
  
  // Cone's tip is at position.y + height/2, base at position.y - height/2
  const coneTip = new THREE.Vector3(conePos.x, conePos.y + coneHeight/2, conePos.z);
  const coneBaseCenter = new THREE.Vector3(conePos.x, conePos.y - coneHeight/2, conePos.z);
  
  // Check collision with base sphere
  if (spherePos.distanceTo(coneBaseCenter) < (coneRadius + sphereRadius)) {
    return true;
  }
  
  // Check collision with conical part (simplified)
  const axis = new THREE.Vector3().subVectors(coneTip, coneBaseCenter).normalize();
  const toSphere = new THREE.Vector3().subVectors(spherePos, coneBaseCenter);
  const parallel = toSphere.clone().projectOnVector(axis);
  const perpendicular = new THREE.Vector3().subVectors(toSphere, parallel);
  
  const distanceAlongAxis = parallel.length();
  const currentRadius = coneRadius * (1 - distanceAlongAxis / coneHeight);
  
  if (distanceAlongAxis >= 0 && distanceAlongAxis <= coneHeight) {
    return perpendicular.length() < (currentRadius + sphereRadius);
  }
  
  return false;
}

function boxToBoxCollision(box1, box2) {
  box1.geometry.computeBoundingBox();
  box2.geometry.computeBoundingBox();
  
  const box1Min = box1.geometry.boundingBox.min.clone().add(box1.position);
  const box1Max = box1.geometry.boundingBox.max.clone().add(box1.position);
  const box2Min = box2.geometry.boundingBox.min.clone().add(box2.position);
  const box2Max = box2.geometry.boundingBox.max.clone().add(box2.position);
  
  return (
    box1Min.x <= box2Max.x && box1Max.x >= box2Min.x &&
    box1Min.y <= box2Max.y && box1Max.y >= box2Min.y &&
    box1Min.z <= box2Max.z && box1Max.z >= box2Min.z
  );
}


// Collision state tracking
let isBoxSphereColliding = false;
let isBoxConeColliding = false;
let isSphereConeColliding = false;

function checkCollisions() {
  const boxSphereCollision = boxToSphereCollision(box, sphere);
  const boxConeCollision = boxToBoxCollision(box, cone);
  const sphereConeCollision = coneToSphereCollision(cone, sphere);

  if (boxSphereCollision !== isBoxSphereColliding) {
    isBoxSphereColliding = boxSphereCollision;
    box.material.color.setHex(isBoxSphereColliding ? 0xff0000 : box.userData.originalColor);
    sphere.material.color.setHex(isBoxSphereColliding ? 0xff0000 : sphere.userData.originalColor);
    if (isBoxSphereColliding) console.log("Box and Sphere collided!");
  }

  if (boxConeCollision !== isBoxConeColliding) {
    isBoxConeColliding = boxConeCollision;
    box.material.color.setHex(isBoxConeColliding ? 0xff0000 : box.userData.originalColor);
    cone.material.color.setHex(isBoxConeColliding ? 0xff0000 : cone.userData.originalColor);
    if (isBoxConeColliding) console.log("Box and Cone collided!");
  }

  if (sphereConeCollision !== isSphereConeColliding) {
    isSphereConeColliding = sphereConeCollision;
    sphere.material.color.setHex(isSphereConeColliding ? 0xff0000 : sphere.userData.originalColor);
    cone.material.color.setHex(isSphereConeColliding ? 0xff0000 : cone.userData.originalColor);
    if (isSphereConeColliding) console.log("Sphere and Cone collided!");
  }
}

let paused = false;
let t = 0;
const maxT = 1000; // Range max
const slider = document.getElementById('timeline');

slider.addEventListener('input', () => {
  t = slider.value / 100;
  updateScene(t);
  checkCollisions();
});

function updateScene(t) {
  box.position.x = Math.cos(t) * 2;
  sphere.position.set(Math.cos(t) * 2, 0, Math.sin(t) * 2);
  cone.position.set(Math.cos(t) * 1.5, Math.sin(t * 2) * 1, Math.sin(t) * 1.5);
}

function animate() {
  requestAnimationFrame(animate);

  if (!paused) {
    t += 0.01;
    slider.value = t * 100;
    updateScene(t);
    checkCollisions();
  }

  controls.update();
  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});