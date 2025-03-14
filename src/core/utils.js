import * as THREE from 'three';

function clearScene(scene) {
    // Traverse all objects in the scene and remove them
    while (scene.children.length > 0) {
        const object = scene.children[0];
        scene.remove(object);

        // If the object has children, remove them too (deep remove)
        if (object instanceof THREE.Mesh || object instanceof THREE.Group) {
            object.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();  // Free up the geometry memory
                    if (child.material.map) child.material.map.dispose();  // Free up the texture memory
                    child.material.dispose();  // Free up material memory
                }
            });
        }
    }
}

export { clearScene }
