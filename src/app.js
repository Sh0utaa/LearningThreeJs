import { ARButton } from "three/examples/jsm/Addons.js";
import { scene, camera, renderer } from './core/scene.js';
import { setupLights } from './core/lights.js';
import { loadModel } from './core/loader.js'
import { setupPostProcessing } from "./core/renderer.js";
import { setupOrbitControls } from './core/controls.js';

let overlayContent = document.getElementById("debug-info");

document.getElementById("container3D").appendChild(renderer.domElement);
document.getElementById("container3D").appendChild(ARButton.createButton(renderer, {
    requiredFeatures: ['hit-test'],
    optionalFeatures: ['dom-overlay'],
    domOverlay: { root: overlayContent }
}));

setupLights(scene);

loadModel(scene);

const composer = setupPostProcessing(renderer, scene, camera);

const controls = setupOrbitControls(camera, renderer);

renderer.setAnimationLoop(render);

function render() {
    composer.render();
    controls.update();
    renderer.render(scene, camera);
}