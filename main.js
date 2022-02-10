import './style.css';
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

//shaders
import vertexShader from './shader/vertex.glsl';

//loading textures
const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('static/textures/sun.jpg');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth/window.innerHeight,
    0.1,
    1000)

const renderer = new THREE.WebGLRenderer({
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

//create Sun
const sunGeometry = new THREE.SphereGeometry(5,50,50);
const sunMaterial = new THREE.ShaderMaterial({
    vertexShader: ,
    fragmentSahder: , 
});
const sun = new THREE.Mesh(sunGeometry,sunMaterial);

scene.add(sun);
camera.position.z = 10;

//create atmosphere

function animate(){
    requestAnimationFrame(animate);
    sun.rotation.x += 0.001;
    sun.rotation.y += 0.001;
    renderer.render(scene, camera);
}

animate();
