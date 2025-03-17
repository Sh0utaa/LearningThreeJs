import * as THREE from 'three';
import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { clearScene } from "./utils.js"

function loadModel(scene, onModelLoaded) {
    const loader = new GLTFLoader();
    let object;

    // Clear previous objects
    clearScene(scene);

    loader.load(
        `/models/ferrari_laferrari/scene.gltf`,
        function (gltf) {
            object = gltf.scene;

            object.rotation.set(0, 0, 0);
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

            // Create cube and sphere
            const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
            const cubeMesh = new THREE.MeshStandardMaterial({ color: 0x2bff55 });
            const cube = new THREE.Mesh(cubeGeometry, cubeMesh);
            cube.position.set(-2, 0.5, 0);
            scene.add(cube);

            const sphereGeometry = new THREE.SphereGeometry(0.7, 32, 32);
            const sphereMaterial = new THREE.MeshStandardMaterial({ color: 0x0000ff });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(2, 0.5, 0);
            scene.add(sphere);
            
            const objects = {
                model: object,
                cube: cube,
                sphere: sphere
            };

            // Call the callback with the loaded object
            if (onModelLoaded) onModelLoaded(objects);
        },
        function (xhr) {
        },
        function (error) {
            console.error(error);
        }
    );
}

export { loadModel }