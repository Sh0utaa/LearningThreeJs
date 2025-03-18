import { ARButton } from "three/examples/jsm/Addons.js";
import { scene, camera, renderer } from './core/scene.js';
import { setupLights } from './core/lights.js';
import { loadModel } from './core/loader.js'
import { setupPostProcessing } from "./core/renderer.js";
import { setupOrbitControls } from './core/controls.js';
import { ARConsole } from "./core/arconsole.js";

document.getElementById("container3D").appendChild(renderer.domElement);
document.getElementById("container3D").appendChild(ARButton.createButton(renderer));

setupLights(scene);

loadModel(scene);

const composer = setupPostProcessing(renderer, scene, camera);

const controls = setupOrbitControls(camera, renderer);

const arConsole = new ARConsole(scene, camera, renderer);

renderer.setAnimationLoop(render);

function render() {
    // Update the console position to follow the camera
    arConsole.updatePosition();

    // Example debug messages
    // arConsole.log(`Camera Position: ${camera.position.toArray().join(', ')}`);

    composer.render();
    controls.update();
    renderer.render(scene, camera);
}