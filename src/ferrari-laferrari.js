import * as THREE from 'three';
import { ARButton, EffectComposer, GLTFLoader, OrbitControls, RenderPass, UnrealBloomPass } from 'three/examples/jsm/Addons.js';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000); // Black background

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// 🔆 Soft Ambient Light (Global Illumination)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// ☀️ Directional Light (Sunlight Effect)
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(5, 10, 5);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 2048; // Reduce from 4096
directionalLight.shadow.mapSize.height = 2048;
scene.add(directionalLight);

// ☀️ Secondary Directional Light (Fill Light from the opposite side)
const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
directionalLight2.position.set(-5, -10, -5);
scene.add(directionalLight2);

// 💡 Soft Hemisphere Light (Sky + Ground Reflection)
const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x404040, 1.5); // Sky blue + dark gray
scene.add(hemiLight);

// 🔦 Spotlights (Car Showroom Look)
const spotlight1 = new THREE.SpotLight(0xffffff, 2);
spotlight1.position.set(0, 8, 5);
spotlight1.angle = Math.PI / 6;
spotlight1.penumbra = 0.5;
spotlight1.castShadow = true;

spotlight1.shadow.mapSize.width = 1024;
spotlight1.shadow.mapSize.height = 1024;

scene.add(spotlight1);

const spotlight2 = spotlight1.clone(); // Clone spotlight for symmetry
spotlight2.position.set(5, 8, -5);
scene.add(spotlight2);

// 🌟 Point Lights (Soft Fill Lights for Balanced Illumination)
const pointLight1 = new THREE.PointLight(0xffffff, 2, 10);
pointLight1.position.set(2, 3, 2);
scene.add(pointLight1);

const pointLight2 = pointLight1.clone();
pointLight2.position.set(-2, 3, -2);
scene.add(pointLight2);

const loader = new GLTFLoader();

let object; // Declare the object variable

loader.load(
    `models/ferrari_laferrari/scene.gltf`,
    function (gltf) {
        object = gltf.scene;

        object.scale.set(0.25, 0.25, 0.25);
        object.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
                child.receiveShadow = true;
                if (child.material.map) {
                    child.material.map.anisotropy = 8;
                }
            }
        })
        scene.add(object);
    },
    function (xhr) {
        console.log((xhr.loaded / xhr.total * 100) + `% loaded`);
    },
    function (error) {
        console.error(error);
    }
);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 2, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance'
});

renderer.xr.addEventListener('sessionstart', () => {
    const session = renderer.xr.getSession();

    session.requestReferenceSpace('local').then(() => {
        const viewerPose = new XRRigidTransform({ x: 0, y: -0.5, z: -1 });

        object.position.set(viewerPose.position.x, viewerPose.position.y, viewerPose.position.z);
        
        // sphere.position.set(viewerPose.position.x, viewerPose.position.y + 1, viewerPose.position.z);
    });
})

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);
renderer.xr.enabled = true


renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

document.getElementById("container3D").appendChild(renderer.domElement);
document.getElementById("container3D").appendChild(ARButton.createButton(renderer));

const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight), 
    0.3, // Reduce intensity (was 0.5)
    0.2, // Reduce threshold (was 0.4)
    0.7  // Reduce softness (was 0.85)
);
composer.addPass(bloomPass);



// Initialize OrbitControls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // Smooth movement
// controls.dampingFactor = 0.05;
// controls.rotateSpeed = 0.8;

// Animation loop
renderer.setAnimationLoop(render);

function render() {
    // controls.update();
    composer.render();
    renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.type = THREE.BasicShadowMap;
});
