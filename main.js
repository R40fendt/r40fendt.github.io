import * as THREE from 'three';
import { PointerLockControls } from 'three';
import { STLLoader } from 'three';

// Szene & Kamera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 100);
camera.position.set(0, 0.02, 0); // 2 cm hoch

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Licht
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1);
scene.add(light);

scene.add(new THREE.AmbientLight(0x404040));

// STL laden
const loader = new STLLoader();
loader.load('model.stl', geometry => {
  const material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);
});

// Pointer Lock Controls
const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());

const move = { forward: false, backward: false, left: false, right: false };
let velocity = new THREE.Vector3();
const speed = 0.005;

document.addEventListener('keydown', e => {
  switch (e.code) {
    case 'KeyW': move.forward = true; break;
    case 'KeyS': move.backward = true; break;
    case 'KeyA': move.left = true; break;
    case 'KeyD': move.right = true; break;
    case 'ArrowLeft': controls.getObject().rotation.y += 0.05; break;
    case 'ArrowRight': controls.getObject().rotation.y -= 0.05; break;
    case 'ArrowUp': camera.rotation.x -= 0.05; break;
    case 'ArrowDown': camera.rotation.x += 0.05; break;
  }
});

document.addEventListener('keyup', e => {
  switch (e.code) {
    case 'KeyW': move.forward = false; break;
    case 'KeyS': move.backward = false; break;
    case 'KeyA': move.left = false; break;
    case 'KeyD': move.right = false; break;
  }
});

// Animation
function animate() {
  requestAnimationFrame(animate);

  velocity.set(0, 0, 0);
  if (move.forward) velocity.z -= speed;
  if (move.backward) velocity.z += speed;
  if (move.left) velocity.x -= speed;
  if (move.right) velocity.x += speed;

  controls.moveRight(velocity.x);
  controls.moveForward(velocity.z);

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
