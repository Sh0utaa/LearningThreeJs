import * as THREE from 'three';

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

renderer.xr.addEventListener('sessionstart', () => {
    const session = renderer.xr.getSession();
    object.scale.set(0.25, 0.25, 0.25);

    session.requestReferenceSpace('local').then(() => {
        const viewerPose = new XRRigidTransform({ x: 0, y: -0.5, z: -1 });

        object.position.set(viewerPose.position.x, viewerPose.position.y, viewerPose.position.z);
    });
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