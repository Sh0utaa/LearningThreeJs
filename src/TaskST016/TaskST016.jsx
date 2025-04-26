import { useEffect, useRef } from "react";
import * as THREE from "three";
import React from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default function TaskST016() {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const earthTexture = new THREE.TextureLoader().load('/assets/earth.jpg')
    const moonTexture = new THREE.TextureLoader().load('/assets/moon.jfif')

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement)

    // Earth (already exists)
    const earthGeometry = new THREE.SphereGeometry(1, 48, 48);
    const earthMaterial = new THREE.MeshStandardMaterial({ map: earthTexture });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);
    scene.add(earth);

    const axesHelper = new THREE.AxesHelper(3.5); // 2 is the length of each axis line
    earth.add(axesHelper);

    // Moon
    const moonGeometry = new THREE.SphereGeometry(0.27, 32, 32); // Make moon smaller
    const moonMaterial = new THREE.MeshStandardMaterial({ map: moonTexture });
    const moon = new THREE.Mesh(moonGeometry, moonMaterial);
    scene.add(moon);

    let moonOrbitRadius = 3.5; // Distance from earth
    let moonOrbitSpeed = 0.01; // Orbit speed
    let moonAngle = 0;         // Current orbit angle

    // Light
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3), light);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      earth.rotation.y += 0.001; // Earth slow rotation

      // Moon orbit calculation
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

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}
