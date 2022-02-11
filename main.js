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
