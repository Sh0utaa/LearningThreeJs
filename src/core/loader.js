import { GLTFLoader } from "three/examples/jsm/Addons.js";

function loadModel(scene) {
    const loader = new GLTFLoader();
    let object;

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
}

export { loadModel }