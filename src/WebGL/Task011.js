import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 0, 0.1)

// Renderer
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableZoom = false // disable zooming
controls.enablePan = false  // disable panning
controls.rotateSpeed = 0.4  // optional tweak
controls.enableDamping = true
controls.dampingFactor = 0.05

// Textures
const loader = new THREE.TextureLoader()
const materials = [
  new THREE.MeshBasicMaterial({ map: loader.load('/positions/posx.jpg'), side: THREE.BackSide }), // right
  new THREE.MeshBasicMaterial({ map: loader.load('/positions/negx.jpg'), side: THREE.BackSide }), // left
  new THREE.MeshBasicMaterial({ map: loader.load('/positions/posy.jpg'), side: THREE.BackSide }), // top
  new THREE.MeshBasicMaterial({ map: loader.load('/positions/negy.jpg'), side: THREE.BackSide }), // bottom
  new THREE.MeshBasicMaterial({ map: loader.load('/positions/posz.jpg'), side: THREE.BackSide }), // front
  new THREE.MeshBasicMaterial({ map: loader.load('/positions/negz.jpg'), side: THREE.BackSide }), // back
]

// Cube geometry and material
const geometry = new THREE.BoxGeometry(500, 500, 500)

const cube = new THREE.Mesh(geometry, materials)
scene.add(cube)

// Animation loop
function animate() {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})


// import * as THREE from 'three'
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// // Scene
// const scene = new THREE.Scene()

// // Camera
// const camera = new THREE.PerspectiveCamera(
//   75,
//   window.innerWidth / window.innerHeight,
//   0.1,
//   1000
// )
// camera.position.set(0, 0, 0) // Inside the cube

// // Renderer
// const renderer = new THREE.WebGLRenderer()
// renderer.setSize(window.innerWidth, window.innerHeight)
// document.body.appendChild(renderer.domElement)

// // OrbitControls
// const controls = new OrbitControls(camera, renderer.domElement)
// controls.enableZoom = false
// controls.enablePan = false
// controls.enableDamping = true
// controls.dampingFactor = 0.05

// // Cube (500x500x500, camera inside)
// const geometry = new THREE.BoxGeometry(500, 500, 500)
// const material = new THREE.MeshBasicMaterial({
//   color: 0x00ff00,
//   wireframe: true,
//   side: THREE.BackSide
// })
// const cube = new THREE.Mesh(geometry, material)
// scene.add(cube)

// // Animation loop
// const animate = () => {
//   requestAnimationFrame(animate)
//   controls.update()
//   renderer.render(scene, camera)
// }
// animate()

// // Resize
// window.addEventListener('resize', () => {
//   camera.aspect = window.innerWidth / window.innerHeight
//   camera.updateProjectionMatrix()
//   renderer.setSize(window.innerWidth, window.innerHeight)
// })
