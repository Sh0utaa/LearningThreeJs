import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function TaskST013() {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Scene
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 2;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Shapes
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.4, 0.4, 0.4),
      new THREE.MeshNormalMaterial()
    );
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.3, 32, 32),
      new THREE.MeshNormalMaterial()
    );
    const cone = new THREE.Mesh(
      new THREE.ConeGeometry(0.3, 0.8, 32),
      new THREE.MeshNormalMaterial()
    );

    scene.add(box, sphere, cone);

    // Lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });

    const line1 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2, 0, 0),
        new THREE.Vector3(2, 0, 0)
      ]),
      lineMaterial
    );
    scene.add(line1);

    const circlePoints = [];
    const radius = 2;
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      circlePoints.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
    }
    const line2 = new THREE.LineLoop(
      new THREE.BufferGeometry().setFromPoints(circlePoints),
      lineMaterial
    );
    scene.add(line2);

    const spiralPoints = [];
    for (let i = 0; i <= 100; i++) {
      const angle = i * 0.1;
      const y = Math.sin(angle * 2);
      spiralPoints.push(new THREE.Vector3(Math.cos(angle) * 1.5, y, Math.sin(angle) * 1.5));
    }
    const line3 = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(spiralPoints),
      lineMaterial
    );
    scene.add(line3);

    // Animation
    let t = 0;
    let animationId;

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      t += 0.01;

      box.position.x = Math.sin(t) * 2;

      sphere.position.x = Math.cos(t) * 2;
      sphere.position.z = Math.sin(t) * 2;

      cone.position.x = Math.cos(t) * 1.5;
      cone.position.z = Math.sin(t) * 1.5;
      cone.position.y = Math.sin(t * 2) * 1;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100vw', height: '100vh' }} />;
}
