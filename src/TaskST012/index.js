import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.set(0, 0, 10)

// Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true

// Ambient light - soft overall brightness
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
scene.add(ambientLight)

// Directional light - like sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 10, 7.5)
scene.add(directionalLight)

// Point light - adds extra contrast and depth
const pointLight = new THREE.PointLight(0xffffff, 0.8)
pointLight.position.set(-5, -5, 5)
scene.add(pointLight)

function getRandomGeometry() {
    const geometries = [
      new THREE.BoxGeometry(2, 2, 2),
      new THREE.SphereGeometry(1.5, 32, 32),
      new THREE.ConeGeometry(1.5, 3, 32),
      new THREE.CylinderGeometry(1, 1, 2, 32),
      new THREE.TorusGeometry(1, 0.4, 16, 100),
      new THREE.TetrahedronGeometry(2)
    ]
    const index = Math.floor(Math.random() * geometries.length)
    return geometries[index]
  }

// Create one basic shape (cube for now)
const geometry = new THREE.BoxGeometry(2, 2, 2)
const material = new THREE.MeshStandardMaterial({ color: 0x0077ff })
const shape = new THREE.Mesh(geometry, material)
scene.add(shape)

// RAYCASTING
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// Click event
window.addEventListener('click', (event) => {
  // Convert mouse position to normalized device coordinates (-1 to +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  raycaster.setFromCamera(mouse, camera)

  const intersects = raycaster.intersectObject(shape)

  if (intersects.length > 0) {
    // Save current position
    const oldPosition = shape.position.clone()

    // Remove old mesh from scene
    scene.remove(shape)

    // Create new random shape
    const newGeometry = getRandomGeometry()
    const newMaterial = new THREE.MeshStandardMaterial({ color: new THREE.Color(Math.random(), Math.random(), Math.random()) })
    shape.geometry.dispose()
    shape.material.dispose()
    shape.geometry = newGeometry
    shape.material = newMaterial
    shape.position.copy(oldPosition)

    // Re-add to scene (in case it's not automatically added)
    scene.add(shape)

    // 1. Change position randomly
    shape.position.set(
      THREE.MathUtils.randFloatSpread(9), // x between -5 and +5
      THREE.MathUtils.randFloatSpread(9),
      THREE.MathUtils.randFloatSpread(9)
    )

    // 2. Change color randomly
    const newColor = new THREE.Color(Math.random(), Math.random(), Math.random())
    shape.material.color = newColor
    }
})

// Animation loop
const animate = () => {
  requestAnimationFrame(animate)
  controls.update()
  renderer.render(scene, camera)
}
animate()

// Resize handling
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
