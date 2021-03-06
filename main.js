import './style.css';
import gsap  from 'gsap';
import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';

//shaders
import vertexShader from './shader/vertex.glsl'
import atmosphereVertexShader from './shader/atmosphereVertex.glsl'

/*
 Fragment shader
 */
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

            gl_FragColor =  vec4(atmosphere + texture2D
                (globeTexture,vertexUV).xyz,1.0);
        }
    `;
}

function atmosphereFragmentShader(){
    return `
        varying vec3 vertexNormal;
        
        void main(){
            float intensity = pow(0.6 - dot(vertexNormal, vec3(0, 0, 1.0)),2.0);

            gl_FragColor = vec4(1.0, 1.0, 0.0, 1.0) * intensity;
        }
    `;
}

const canvasContainer = document.querySelector('#canvasContainer');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    75,
    canvasContainer.offsetWidth/canvasContainer.offsetHeight,
    0.1,
    1000)

const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: document.querySelector('canvas')
});


renderer.setSize(canvasContainer.offsetWidth, canvasContainer.offsetHeight);
renderer.setPixelRatio(window.devicePixelRatio);

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

//create atmosphere

const atmosphere = new THREE.Mesh(
    new THREE.SphereGeometry(5,50,50),
    new THREE.ShaderMaterial({
        vertexShader: atmosphereVertexShader,
        fragmentShader: 
            atmosphereFragmentShader(),
            blending: THREE.AddActiveBlending,
            side: THREE.BackSide
    })
)

//scale of atmosphere/glowing

atmosphere.scale.set(1.1, 1.1, 1.1)

scene.add(atmosphere);

const group = new THREE.Group()
group.add(sun)
scene.add(group)

//background stars

const starGeometry = new THREE.BufferGeometry()
const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff
})

const starVertices = []

for(let i = 0; i <10000; i++){
    const x = (Math.random()-0.5) * 2000
    const y = (Math.random()-0.5) * 2000
    const z = -Math.random() * 2000
    starVertices.push(x,y,z)
}

starGeometry.setAttribute('position', 
    new THREE.Float32BufferAttribute(starVertices, 3))

const stars = new THREE.Points(starGeometry, starMaterial)
scene.add(stars)

camera.position.z = 10;

const mouse = {
    x: undefined,
    y: undefined
}

function animate(){
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    sun.rotation.y += 0.001;
    gsap.to(group.rotation, {
        x: -mouse.y * 0.3,
        y: mouse.x * 0.5,
        duration: 2
    })
}

animate();

//movement interaction

addEventListener('mousemove', ()=>{
    mouse.x = (event.clientX / innerWidth) * 2 -1
    mouse.y = -(event.clientY / innerHeight) * 2 +1
})
