import './style.css';

import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000)

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const geometry = new THREE.SphereBufferGeometry(.5,64,64);
const material = new THREE.MeshBasicMaterial({color: 0xff0000});
const sphere = new THREE.Mesh(geometry,material);

scene.add(sphere);
camera.position.z = 5;

function animate(){
    requestAnimationFrame(animate);
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
    renderer.render(scene, camera);
}

animate();
