import * as THREE from 'three';

function setupLights(scene) {
    
    // Soft Ambient Light (Global Illumination)
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
    scene.add(ambientLight);
    
    // Directional Light (Sunlight Effect)
    const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048; // Reduce from 4096
    directionalLight.shadow.mapSize.height = 2048;
    scene.add(directionalLight);
    
    // Secondary Directional Light (Fill Light from the opposite side)
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight2.position.set(-5, -10, -5);
    scene.add(directionalLight2);
    
    // Soft Hemisphere Light (Sky + Ground Reflection)
    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x404040, 1.5); // Sky blue + dark gray
    scene.add(hemiLight);
    
    // Spotlights (Car Showroom Look)
    const spotlight1 = new THREE.SpotLight(0xffffff, 2);
    spotlight1.position.set(0, 8, 5);
    spotlight1.angle = Math.PI / 6;
    spotlight1.penumbra = 0.5;
    spotlight1.castShadow = true;
    
    spotlight1.shadow.mapSize.width = 1024;
    spotlight1.shadow.mapSize.height = 1024;
    
    scene.add(spotlight1);
    
    const spotlight2 = spotlight1.clone();
    spotlight2.position.set(5, 8, -5);
    scene.add(spotlight2);
    
    // Point Lights (Soft Fill Lights for Balanced Illumination)
    const pointLight1 = new THREE.PointLight(0xffffff, 2, 10);
    pointLight1.position.set(2, 3, 2);
    scene.add(pointLight1);
    
    const pointLight2 = pointLight1.clone();
    pointLight2.position.set(-2, 3, -2);
    scene.add(pointLight2);
}

export {setupLights};