import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import React from 'react'
import './styles.css';

export default function TaskST014() {
  const mountRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [t, setT] = useState(0);
  const maxT = 1000;
  const sliderRef = useRef(null);
  
  // Store Three.js objects in refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const boxRef = useRef(null);
  const sphereRef = useRef(null);
  const coneRef = useRef(null);

  const updateScene = (t) => {
    if (!boxRef.current || !sphereRef.current || !coneRef.current) return;
    
    boxRef.current.position.x = Math.cos(t) * 2;
    sphereRef.current.position.set(Math.cos(t) * 2, 0, Math.sin(t) * 2);
    coneRef.current.position.set(Math.cos(t) * 1.5, Math.sin(t * 2), Math.sin(t) * 1.5);
    
    // Check collisions
    const checkCollisions = () => {
      const dist = boxRef.current.position.distanceTo(sphereRef.current.position);
      const isBoxSphere = dist < sphereRef.current.userData.radius + 0.2;
      const isBoxCone = boxRef.current.position.distanceTo(coneRef.current.position) < 0.5;
      const isSphereCone = sphereRef.current.position.distanceTo(coneRef.current.position) < 0.6;

      const setColor = (obj, collided) => {
        obj.material.color.setHex(collided ? 0xff0000 : obj.userData.originalColor);
      };

      setColor(boxRef.current, isBoxSphere || isBoxCone);
      setColor(sphereRef.current, isBoxSphere || isSphereCone);
      setColor(coneRef.current, isBoxCone || isSphereCone);
    };
    
    checkCollisions();
  };

  useEffect(() => {
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 10, 5);
    scene.add(new THREE.AmbientLight(0xffffff, 0.3), light);

    const box = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 0.4), new THREE.MeshStandardMaterial({ color: 0x00ff00 }));
    const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), new THREE.MeshStandardMaterial({ color: 0x0000ff }));
    const cone = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 32), new THREE.MeshStandardMaterial({ color: 0xffff00 }));

    boxRef.current = box;
    sphereRef.current = sphere;
    coneRef.current = cone;

    [box, sphere, cone].forEach(obj => {
      obj.userData.originalColor = obj.material.color.getHex();
    });

    sphere.userData.radius = 0.3;
    cone.userData.radius = 0.3;
    cone.userData.height = 0.8;

    scene.add(box, sphere, cone);

    // Line paths
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    scene.add(new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(-2, 0, 0), new THREE.Vector3(2, 0, 0)]),
      lineMaterial
    ));

    const circlePoints = Array.from({ length: 65 }, (_, i) => {
      const angle = (i / 64) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(angle) * 2, 0, Math.sin(angle) * 2);
    });
    scene.add(new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(circlePoints), lineMaterial));

    const spiralPoints = Array.from({ length: 101 }, (_, i) => {
      const angle = i * 0.1;
      return new THREE.Vector3(Math.cos(angle) * 1.5, Math.sin(angle * 2), Math.sin(angle) * 1.5);
    });
    scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(spiralPoints), lineMaterial));

    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      if (!paused) {
        setT(prev => {
          const newT = prev + 0.01;
          if (sliderRef.current) sliderRef.current.value = newT * 100;
          return newT;
        }) 
      }
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    });

    return () => {
      cancelAnimationFrame(frameId);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [paused]);

  // Update scene whenever t changes
  useEffect(() => {
    updateScene(t);
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [t]);

  return (
    <div className="canvas-wrapper">
      <div className="controls">
        <button onClick={() => setPaused(p => !p)} id="toggleBtn">
          {paused ? 'Play' : 'Pause'}
        </button>
        <input
          id="timeline"
          type="range"
          ref={sliderRef}
          min={0}
          max={maxT}
          step={1}
          defaultValue={0}
          onChange={e => {
            const newT = e.target.value / 100;
            setT(newT);
          }}
        />
      </div>
      <div ref={mountRef} className="canvas-container" />
    </div>
  );
}