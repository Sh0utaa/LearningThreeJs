import * as THREE from "three"
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js';

function createConsolePlane() {
    // Create a plane geometry for the console
    const planeGeometry = new THREE.PlaneGeometry(2, 1); // Width and height of the console
    const planeMaterial = new THREE.MeshBasicMaterial({
        color: 0x000000,
        opacity: 0.8,
        transparent: true,
    });
    const consolePlane = new THREE.Mesh(planeGeometry, planeMaterial);

    // Position the console at the bottom of the AR scene
    consolePlane.position.set(0, -1, -2); // Adjust position as needed
    consolePlane.rotation.x = -Math.PI / 8; // Tilt the console slightly for better visibility

    return consolePlane;
}

function createConsoleLabel() {
    // Create a div element for the console text
    const consoleDiv = document.createElement('div');
    consoleDiv.style.color = 'white';
    consoleDiv.style.fontFamily = 'monospace';
    consoleDiv.style.fontSize = '14px';
    consoleDiv.style.whiteSpace = 'pre-wrap'; // Preserve line breaks
    consoleDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    consoleDiv.style.padding = '10px';
    consoleDiv.style.width = '400px'; // Adjust width as needed
    consoleDiv.style.height = '150px'; // Adjust height as needed
    consoleDiv.style.overflowY = 'auto'; // Enable scrolling

    // Create a CSS2DObject to attach the div to the AR scene
    const consoleLabel = new CSS2DObject(consoleDiv);
    consoleLabel.position.set(0, -1, -2); // Match the position of the console plane

    return consoleLabel;
}

export { createConsolePlane, createConsoleLabel}