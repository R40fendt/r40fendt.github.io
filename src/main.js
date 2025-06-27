import * as THREE from 'three';
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// Szene, Kamera, Renderer
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x222222);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.001, 100);
camera.position.set(0, 0.02, 0); // 2 cm hoch

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lichtquelle, die der Kamera folgt
const playerLight = new THREE.PointLight(0xffffff, 1, 5);
playerLight.position.set(0, 0, 0);
camera.add(playerLight);
scene.add(camera);

// Umgebungslampen
scene.add(new THREE.DirectionalLight(0xffffff, 1).position.set(1, 1, 1));
scene.add(new THREE.AmbientLight(0x404040));

// STL-Modell laden und rotieren
const loader = new STLLoader();
loader.load('/model.stl', geometry => {
  const material = new THREE.MeshPhongMaterial({ color: 0xaaaaaa });
  const mesh = new THREE.Mesh(geometry, material);

  // Drehung z. B. um X-Achse
  mesh.rotation.x = -Math.PI / 2;

  scene.add(mesh);
});

// Controls
const controls = new PointerLockControls(camera, document.body);
document.body.addEventListener('click', () => controls.lock());

// Bewegung
const move = {
  forward: false,
  backward: false,
  left: false,
  right: false,
  up: false,
  down: false
};

const velocity = new THREE.Vector3();
const speed = 0.05;

// Tasteneingaben
document.addEventListener('keydown', e => {
  switch (e.code) {
    case 'KeyW': move.forward = true; break;
    case 'KeyS': move.backward = true; break;
    case 'KeyA': move.left = true; break;
    case 'KeyD': move.right = true; break;
    case 'KeyE': move.up = true; break;
    case 'KeyQ': move.down = true; break;

    case 'ArrowLeft':  controls.getObject().rotation.y += 0.05; break;
    case 'ArrowRight': controls.getObject().rotation.y -= 0.05; break;
    case 'ArrowUp':    camera.rotation.x -= 0.05; break;
    case 'ArrowDown':  camera.rotation.x += 0.05; break;
  }
});

document.addEventListener('keyup', e => {
  switch (e.code) {
    case 'KeyW': move.forward = false; break;
    case 'KeyS': move.backward = false; break;
    case 'KeyA': move.left = false; break;
    case 'KeyD': move.right = false; break;
    case 'KeyE': move.up = false; break;
    case 'KeyQ': move.down = false; break;
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

  if (move.up) camera.position.y += speed;
  if (move.down) camera.position.y -= speed;

  renderer.render(scene, camera);
}

animate();

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
