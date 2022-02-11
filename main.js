import './style.css';
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

//shaders
import vertexShader from './shader/vertex.glsl'
//import fragmentShader from './shader/fragment.glsl'
//console.log(fragmentShader)

function coinFragmentShader(){
    return `
        uniform sampler2D globeTexture;
       
        varying vec2 vertexUV; 
        varying vec3 vertexNormal;

        void main(){
            float intensity = 1.05 - dot(
                vertexNormal, vec3(0.5, 0.0, 0.0));            
            vec3 atmosphere = 
                vec3(0.5, 0.2, 0.0) * pow(intensity, 1.5);

            gl_FragColor =  vec4(atmosphere + texture2D(globeTexture,vertexUV).xyz,1.0);
        }
    `;
}

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

const sun = new THREE.Mesh(
    new THREE.SphereGeometry(5,50,50),
    new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader: coinFragmentShader(),
        uniforms: {
            globeTexture:{
                value: new THREE.TextureLoader().load('./static/textures/sun.jpg')
            }
        }

    })
)
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
