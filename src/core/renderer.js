import * as THREE from 'three';
import { EffectComposer, RenderPass, UnrealBloomPass } from "three/examples/jsm/Addons.js";

function setupPostProcessing(renderer, scene, camera) {
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    
    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight), 
        0.3, // Reduce intensity (was 0.5)
        0.2, // Reduce threshold (was 0.4)
        0.7  // Reduce softness (was 0.85)
    );
    composer.addPass(bloomPass);
    
    return composer;
}

export { setupPostProcessing };