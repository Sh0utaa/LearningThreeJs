import * as THREE from "three";
import { XRButton } from "three/examples/jsm/webxr/XRButton.js";

// Create scene
const scene = new THREE.Scene();

// Create renderer
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;
document.body.appendChild(renderer.domElement);
document.body.appendChild(XRButton.createButton(renderer)); // Adds "Enter AR" button

renderer.xr.addEventListener("sessionstart", async () => {
    const session = renderer.xr.getSession();
    const referenceSpace = await session.requestReferenceSpace("local-floor");

    // Get a frame of reference for anchoring
    session.requestAnimationFrame((time, frame) => {
        const viewerPose = frame.getViewerPose(referenceSpace);
        if (!viewerPose) return;

        // Choose a position 2 meters in front of the user
        const position = viewerPose.transform.position;
        const fixedPosition = new XRRigidTransform(
            { x: position.x, y: position.y, z: position.z - 2 },
            {}
        );

        // Create a real AR anchor
        const anchor = frame.session.addAnchor(fixedPosition);
        anchor.then((xrAnchor) => {
            const fixedAnchor = new THREE.Group();
            scene.add(fixedAnchor);

            // Attach objects to the anchor
            const cubeGeometry = new THREE.BoxGeometry(0.2, 0.2, 0.2);
            const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.position.set(-0.3, 0, 0); // Slightly to the left
            fixedAnchor.add(cube);

            const sphereGeometry = new THREE.SphereGeometry(0.15, 32, 32);
            const sphereMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
            const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
            sphere.position.set(0.3, 0, 0); // Slightly to the right
            fixedAnchor.add(sphere);

            // Keep anchor updated
            function updateAnchor() {
                const pose = frame.getPose(xrAnchor.anchorSpace, referenceSpace);
                if (pose) {
                    fixedAnchor.position.set(pose.transform.position.x, pose.transform.position.y, pose.transform.position.z);
                }
                requestAnimationFrame(updateAnchor);
            }
            updateAnchor();
        });
    });
});

// Animate and render loop
function animate() {
    renderer.setAnimationLoop(() => {
        renderer.render(scene, renderer.xr.getCamera());
    });
}

animate();
