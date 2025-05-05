import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import './styles.css'; // You can style your timeline and button here

export default function CollisionScene() {
  const mountRef = useRef(null);
  const sliderRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [t, setT] = useState(0);

  const boxRef = useRef();
  const sphereRef = useRef();
  const coneRef = useRef();

  const sceneRef = useRef();
  const cameraRef = useRef();
  const rendererRef = useRef();
  const controlsRef = useRef();

  const updateScene = (time) => {
    if (!boxRef.current || !sphereRef.current || !coneRef.current) return;

    boxRef.current.position.x = Math.cos(time) * 2;
    sphereRef.current.position.set(Math.cos(time) * 2, 0, Math.sin(time) * 2);
    coneRef.current.position.set(Math.cos(time) * 1.5, Math.sin(time * 2), Math.sin(time) * 1.5);
  };

  const checkCollisions = () => {
    const box = boxRef.current;
    const sphere = sphereRef.current;
    const cone = coneRef.current;

    if (!box || !sphere || !cone) return;

    const distBoxSphere = box.position.distanceTo(sphere.position);
    const distBoxCone = box.position.distanceTo(cone.position);
    const distSphereCone = sphere.position.distanceTo(cone.position);

    const boxSphere = distBoxSphere < sphere.userData.radius + 0.2;
    const boxCone = distBoxCone < 0.5;
    const sphereCone = distSphereCone < 0.6;

    const setColor = (obj, collided) =>
      obj.material.color.setHex(collided ? 0xff0000 : obj.userData.originalColor);

    setColor(box, boxSphere || boxCone);
    setColor(sphere, boxSphere || sphereCone);
    setColor(cone, boxCone || sphereCone);
  };

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(ambientLight, directionalLight);

    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.4, 0.4),
      new THREE.MeshStandardMaterial({ color: 0x00ff00 })
    );
    box.userData.originalColor = 0x00ff00;

    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.MeshStandardMaterial({ color: 0x0000ff })
    );
    sphere.userData.originalColor = 0x0000ff;
    sphere.userData.radius = 0.3;

    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.8, 32),
      new THREE.MeshStandardMaterial({ color: 0xffff00 })
    );
    cone.userData.originalColor = 0xffff00;
    cone.userData.radius = 0.3;
    cone.userData.height = 0.8;

    boxRef.current = box;
    sphereRef.current = sphere;
    coneRef.current = cone;
    scene.add(box, sphere, cone);

    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

    const line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2, 0, 0),
        new THREE.Vector3(2, 0, 0),
      ]),
      lineMaterial
    );
    scene.add(line);

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
        setT((prev) => {
          const next = prev + 0.01;
          if (sliderRef.current) sliderRef.current.value = next * 100;
          return next;
        });
      }

      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    window.addEventListener('resize', () => {
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      mountRef.current.removeChild(renderer.domElement);
    };
  }, [paused]);

  useEffect(() => {
    updateScene(t);
    checkCollisions();
    if (rendererRef.current && sceneRef.current && cameraRef.current) {
      rendererRef.current.render(sceneRef.current, cameraRef.current);
    }
  }, [t]);

  return (
    <div className="canvas-wrapper">
      <div className="controls">
        <button onClick={() => setPaused((p) => !p)}>{paused ? 'Play' : 'Pause'}</button>
        <input
          type="range"
          ref={sliderRef}
          min={0}
          max={1000}
          step={1}
          defaultValue={0}
          onChange={(e) => {
            const newT = e.target.value / 100;
            setT(newT);
          }}
        />
      </div>
      <div ref={mountRef} className="canvas-container" />
    </div>
  );
}
