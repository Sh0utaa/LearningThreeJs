import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton'

const scene = new THREE.Scene()

const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const light = new THREE.AmbientLight(0xffffff, 1);
// light.position.set(1, 1, 1);
scene.add(light);

const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff * Math.random() });
const cube = new THREE.Mesh(geometry, material);
// cube.position.set(0, 0, 2)
scene.add(cube)

// const sphereGeometry = new THREE.SphereGeometry(0.35, 64, 64);
// const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff * Math.random() });
// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// sphere.position.set(2, 0, 2)
// scene.add(sphere);

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
camera.position.set(0, 2, 5);
camera.lookAt(new THREE.Vector3(0, 0, 0))
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true

});

renderer.xr.addEventListener('sessionstart', () => {
    const session = renderer.xr.getSession();

    session.requestReferenceSpace('local').then(() => {
        const viewerPose = new XRRigidTransform({ x: 0, y: 0, z: -1 });

        cube.position.set(viewerPose.position.x, viewerPose.position.y, viewerPose.position.z);
        
        // sphere.position.set(viewerPose.position.x, viewerPose.position.y + 1, viewerPose.position.z);
    });
})

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.xr.enabled = true

document.body.appendChild(renderer.domElement);
document.body.appendChild(ARButton.createButton(renderer));

renderer.setAnimationLoop(render)

function render() {
    // cube.rotation.y += 0.01;
    renderer.render(scene, camera)
}

window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(window.devicePixelRatio)

})
