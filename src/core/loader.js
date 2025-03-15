import { GLTFLoader } from "three/examples/jsm/Addons.js";
import { clearScene } from "./utils.js"

function loadModel(scene, onModelLoaded) {
    const loader = new GLTFLoader();
    let object;

    loader.load(
        `/models/ferrari_laferrari/scene.gltf`,
        function (gltf) {
            object = gltf.scene;

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

            // Call the callback with the loaded object
            if (onModelLoaded) onModelLoaded(object);
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