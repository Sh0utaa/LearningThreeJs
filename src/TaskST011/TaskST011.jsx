import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import React from 'react'

export default function TaskST011() {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(0, 0, 0.1);

    // Renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.rotateSpeed = 0.4;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Cube Textures
    const loader = new THREE.TextureLoader();
    const materials = [
      new THREE.MeshBasicMaterial({ map: loader.load("/positions/posx.jpg"), side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ map: loader.load("/positions/negx.jpg"), side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ map: loader.load("/positions/posy.jpg"), side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ map: loader.load("/positions/negy.jpg"), side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ map: loader.load("/positions/posz.jpg"), side: THREE.BackSide }),
      new THREE.MeshBasicMaterial({ map: loader.load("/positions/negz.jpg"), side: THREE.BackSide }),
    ];

    const geometry = new THREE.BoxGeometry(500, 500, 500);
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    // Animate
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}
