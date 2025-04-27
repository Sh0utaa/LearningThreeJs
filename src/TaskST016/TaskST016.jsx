import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import React from 'react';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function TaskST016() {
  const mountRef = useRef(null);
  const [lightType, setLightType] = useState('ambient'); // 'ambient', 'hemisphere', 'point'
  const lightRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const earthTexture = new THREE.TextureLoader().load('/assets/earth.jpg');
    const moonTexture = new THREE.TextureLoader().load('/assets/moon.jfif');

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    // Earth
    const earthGeometry = new THREE.SphereGeometry(1, 48, 48);
    const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    const axesHelper = new THREE.AxesHelper(3.5);
    earth.add(axesHelper);

    // Moon
    const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32);
    const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    let moonOrbitRadius = 3.5;
    let moonOrbitSpeed = 0.01;
    let moonAngle = 0;

    // Default Light (AmbientLight to start)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    lightRef.current = ambientLight; // Save reference

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);

      earth.rotation.y += 0.001;
      moonAngle += moonOrbitSpeed;
      moon.position.x = Math.cos(moonAngle) * moonOrbitRadius;
      moon.position.z = Math.sin(moonAngle) * moonOrbitRadius;

      renderer.render(scene, camera);
    };
    animate();

    // Clean up
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  // Handle light switching
  useEffect(() => {
    const scene = lightRef.current.parent; // get the scene
    if (!scene) return;

    // Remove old light
    scene.remove(lightRef.current);

    let newLight;
    if (lightType === 'ambient') {
      newLight = new THREE.AmbientLight(0xffffff, 0.5);
    } else if (lightType === 'hemisphere') {
      newLight = new THREE.HemisphereLight(0xffffbb, 0x080820, 1);
    } else if (lightType === 'point') {
      newLight = new THREE.PointLight(0xffffff, 10, 10000);
      newLight.position.set(5, 5, 5);
    }

    scene.add(newLight);
    lightRef.current = newLight;
  }, [lightType]);

  // Function to rotate through light types
  const handleToggleLight = () => {
    setLightType(prev => {
      if (prev === 'ambient') return 'hemisphere';
      if (prev === 'hemisphere') return 'point';
      return 'ambient';
    });
  };

  return (
    <div style={{ position: "relative", width: "100vw", height: "100vh" }}>
      <div ref={mountRef} style={{ width: "100%", height: "100%" }} />
      <button
        onClick={handleToggleLight}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          padding: "10px 20px",
          backgroundColor: "#333",
          color: "#fff",
          border: "none",
          borderRadius: "8px",
          cursor: "pointer",
          fontSize: "16px"
        }}
      >
        Toggle Light ({lightType})
      </button>
    </div>
  );
}
