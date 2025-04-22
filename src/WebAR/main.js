import { ARButton } from "three/examples/jsm/Addons.js";
import { scene, camera, renderer } from './scene.js';
import { setupLights } from './lights.js';
import { loadModel } from './loader.js'
import { setupPostProcessing } from "./renderer.js";
import { setupOrbitControls } from './controls.js';

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