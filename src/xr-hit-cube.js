import * as THREE from 'three';
import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';

let hitTestSource = null;
let hitTestSourceRequested = false;

// Scene
const scene = new THREE.Scene();

// Camera
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
};
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.z = 5;
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
});

renderer.setSize(sizes.width, sizes.height);

document.body.appendChild(renderer.domElement);
document.body.appendChild(ARButton.createButton(renderer, { requiredFeatures: ['hit-test']}));

const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff * Math.random() });

let controller = renderer.xr.getController(0);
controller.addEventListener('select', onSelect);
scene.add(controller);

function onSelect() {
    if(reticle.visible) {
        const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
        sphere.position.setFromMatrixPosition(reticle.matrix);
        sphere.name="sphere"
        scene.add(sphere)
    }
}

// Light
const light = new THREE.DirectionalLight(0xffffff, 1.0);
light.position.set(2, 1, 1);
scene.add(light);

// Sphere
// const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
// const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x44aa88 });
// const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
// sphere.position.set(-2, 0, 0);
// scene.add(sphere);

// Cube
// const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x8844aa });
// const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
// cube.position.set(2, 0, 0);
// scene.add(cube);

let reticle = new THREE.Mesh(
    new THREE.RingGeometry(0.15, .2, 32).rotateX(- 1.00 ),
    new THREE.MeshStandardMaterial({ color: 0xffffff }),
);
reticle.visible = false;
reticle.matrixAutoUpdate = false;
scene.add(reticle);

renderer.setAnimationLoop(render)

function render(timestamp, frame) {
    if(frame) {
        const referenceSpace = renderer.xr.getReferenceSpace();
        const session = renderer.xr.getSession();
        if(hitTestSourceRequested === false) {
            session.requestReferenceSpace('viewer').then(referenceSpace=> {
                session.requestHitTestSource({ space: referenceSpace }).then(source =>
                    hitTestSource=source)
            })

            hitTestSourceRequested = true;

            session.addEventListener("end", ()=> {
                hitTestSourceRequested=false;
                hitTestSource=null;
            })
        }

        if(hitTestSource) {
            const hitTestResults = frame.getHitTestResults(hitTestSource);
            if(hitTestResults.length>0) {
                const hit = hitTestResults[0];
                reticle.visible = true;
                reticle.matrix.fromArray(hit.getPose())
            }
        }
    }
    renderer.render(scene, camera)
}

// Resize Handling
window.addEventListener('resize', () => {
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;
    
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
    renderer.setSize(sizes.width, sizes.height);
});
