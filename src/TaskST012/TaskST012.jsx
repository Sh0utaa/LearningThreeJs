import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function TaskST012() {
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
    camera.position.set(0, 0, 10);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.4));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 7.5);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0xffffff, 0.8);
    pointLight.position.set(-5, -5, 5);
    scene.add(pointLight);

    // Random geometry generator
    const getRandomGeometry = () => {
      const geometries = [
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.SphereGeometry(1.5, 32, 32),
        new THREE.ConeGeometry(1.5, 3, 32),
        new THREE.CylinderGeometry(1, 1, 2, 32),
        new THREE.TorusGeometry(1, 0.4, 16, 100),
        new THREE.TetrahedronGeometry(2),
      ];
      return geometries[Math.floor(Math.random() * geometries.length)];
    };

    // Initial shape
    const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
    const shape = new THREE.Mesh(new THREE.BoxGeometry(2, 2, 2), material);
    scene.add(shape);

    // Raycaster
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleClick = (event) => {
      const rect = mount.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObject(shape);

      if (intersects.length > 0) {
        const oldPosition = shape.position.clone();

        scene.remove(shape);

        const newGeometry = getRandomGeometry();
        const newMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(Math.random(), Math.random(), Math.random()),
        });

        shape.geometry.dispose();
        shape.material.dispose();
        shape.geometry = newGeometry;
        shape.material = newMaterial;
        shape.position.copy(oldPosition);

        shape.position.set(
          THREE.MathUtils.randFloatSpread(9),
          THREE.MathUtils.randFloatSpread(9),
          THREE.MathUtils.randFloatSpread(9)
        );

        scene.add(shape);
      }
    };

    mount.addEventListener("click", handleClick);

    // Animate loop
    let frameId;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
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
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      mount.removeEventListener("click", handleClick);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />;
}
