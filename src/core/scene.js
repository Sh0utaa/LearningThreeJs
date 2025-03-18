import * as THREE from 'three';
import { loadModel } from './loader.js';
import { clearScene } from "./utils.js"
import { setupLights } from './lights.js'
import { TouchControls } from './touchcontrols.js';

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 2, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0));
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    powerPreference: 'high-performance'
});

// TouchControls
const touchControl = new TouchControls(renderer, scene, camera);

renderer.xr.addEventListener('sessionstart', () => {
    const session = renderer.xr.getSession();

    // Enable Touch Controls when AR session starts
    touchControl.setARSessionActive(true);

    // Clear previous objects
    clearScene(scene);

    loadModel(scene, (objects) => {

        objects.model.userData.isARObject = true;
        objects.cube.userData.isARObject = true;
        objects.sphere.userData.isARObject = true;
        
        // Ensure we scale and position the object after the model is loaded
        objects.model.scale.set(0.25, 0.25, 0.25); // Set the scale
        objects.cube.scale.set(0.25, 0.25, 0.25)
        objects.sphere.scale.set(0.25, 0.25, 0.25)

        // Request the XR session's reference space
        session.requestReferenceSpace('local').then(() => {
            const viewerPose = new XRRigidTransform({ x: 0, y: -0.5, z: -1 });

            // Set the position of the object based on the viewer's position
            objects.model.position.set(viewerPose.position.x, viewerPose.position.y, viewerPose.position.z);
            objects.cube.position.set(viewerPose.position.x - 0.5, viewerPose.position.y, viewerPose.position.z);
            objects.sphere.position.set(viewerPose.position.x + 0.5, viewerPose.position.y, viewerPose.position.z);
        });
    });
});

renderer.xr.addEventListener('sessionend', () => {
    scene.clear();
    setupLights(scene);
    
    // Disable Touch Controls when AR session starts
    touchControl.setARSessionActive(false);
    camera.position.set(0, 2, 5);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    
    loadModel(scene)
})


renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);
renderer.xr.enabled = true

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

// Handle Resize
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.type = THREE.BasicShadowMap;
});

export { scene, camera, renderer };