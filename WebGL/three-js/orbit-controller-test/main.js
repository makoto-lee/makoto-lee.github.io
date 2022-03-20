import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";
import { OrbitCamera } from "./OrbitCamera.js"

/**
 * set up scene, camera, renderer
 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


const canvas = document.getElementById("myCanvas");
if (!window.WebGLRenderingContext) {
    alert("Sorry, your browser doesn`t support WebGL");
}
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

/**
 * set up background
 */
const background = new THREE.TextureLoader().load("./peko.jpg");
scene.background = background;

/**
 * load WetFloorSign
 */

const signTexture = new THREE.TextureLoader().load("./WetFloorSign/textures/WetFloorSign_01_diff_1k.jpg");

const signMaterial = new THREE.MeshBasicMaterial({ map: signTexture });

const loader = new GLTFLoader();
loader.load("./WetFloorSign/WetFloorSign_01_1k.gltf",
    (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                const m = child;
                m.receiveShadow = true;
                m.castShadow = true;
                m.material = signMaterial;
                m.scale.set(3, 3, 3);
                scene.add(m);
            }
        });
    },
    (xhr) => {
        console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log("Error happend when loading GLTF");
    });

//const sign = new THREE.Mesh(geometry, material);

//scene.add(sign);
//camera.position.z = 5;
//camera.position.y = 0;

let oc = new OrbitCamera(camera, new THREE.Vector3(0, 0, 0), 3, canvas);
oc.auto_move = false;


/**
 * start rendering
 */
function animate() {
    requestAnimationFrame(animate);

    //signMesh.rotation.y += 0.01;
    //camera.position.y += 0.01;
    //camera.lookAt(0, 0, 0);
    oc.update();

    renderer.render(scene, camera);
};

animate();