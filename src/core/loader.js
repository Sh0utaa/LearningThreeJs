import * as THREE from 'three';
// import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { clearScene } from "./utils.js"

function loadModel(scene, onModelLoaded) {
    // Clear previous objects
    clearScene(scene);

    const tetrahedronGeometry = new THREE.TetrahedronGeometry(1, 0, 0)
    const tetrahedonMesh = new THREE.MeshStandardMaterial({ color: 0x800080})
    const tetrahedron = new THREE.Mesh(tetrahedronGeometry, tetrahedonMesh);
    tetrahedron.position.set(0, 0.5, 0);
    scene.add(tetrahedron);

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
        model: tetrahedron,
        cube: cube,
        sphere: sphere
    };

    // Call the callback with the loaded object
    if (onModelLoaded) onModelLoaded(objects);
}

export { loadModel }