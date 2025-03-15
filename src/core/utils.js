import * as THREE from 'three';

function clearScene(scene) {
    for (let i = scene.children.length - 1; i >= 0; i--) {
        const object = scene.children[i];

        if (object.isLight || object.isCamera) continue;

        scene.remove(object);

        if (object instanceof THREE.Mesh || object instanceof THREE.Group) {
            object.traverse((child) => {
                if (child.isMesh) {
                    child.geometry.dispose();
                    if (child.material.map) child.material.map.dispose();
                    child.material.dispose();
                }
            });
        }
    }
}

export { clearScene };
