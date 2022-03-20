import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";
import { FirstPersonViewer } from "./FirstPersonViewer.js"

/**
 * set up scene, camera, renderer
 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);

const canvas = document.getElementById("myCanvas");
if (!window.WebGLRenderingContext) {
    alert("Sorry, your browser doesn`t support WebGL");
}
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

/**
 * set up skybox
 */

function setupSkybox() {

    let material_array = [];
    let texture_ft = new THREE.TextureLoader().load('./Daylight_skybox/Front.jpg');
    let texture_bk = new THREE.TextureLoader().load('./Daylight_skybox/Back.jpg');
    let texture_tp = new THREE.TextureLoader().load('./Daylight_skybox/Top.jpg');
    let texture_bm = new THREE.TextureLoader().load('./Daylight_skybox/Bottom.jpg');
    let texture_rt = new THREE.TextureLoader().load('./Daylight_skybox/Right.jpg');
    let texture_lf = new THREE.TextureLoader().load('./Daylight_skybox/Left.jpg');

    material_array.push(new THREE.MeshBasicMaterial({ map: texture_ft }));
    material_array.push(new THREE.MeshBasicMaterial({ map: texture_bk }));
    material_array.push(new THREE.MeshBasicMaterial({ map: texture_tp }));
    material_array.push(new THREE.MeshBasicMaterial({ map: texture_bm }));
    material_array.push(new THREE.MeshBasicMaterial({ map: texture_rt }));
    material_array.push(new THREE.MeshBasicMaterial({ map: texture_lf }));

    for (let i = 0; i < 6; i++)
        material_array[i].side = THREE.BackSide;

    const skybox_geo = new THREE.BoxGeometry(2000, 2000, 2000);
    let skybox = new THREE.Mesh(skybox_geo, material_array);
    scene.add(skybox);

}
setupSkybox();


/**
 * add a cube
 */

const cube_geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
const cube_material = new THREE.MeshBasicMaterial({ color: 0x00ffff });
const cube = new THREE.Mesh(cube_geometry, cube_material);
cube.position.set(1, 0, 1);

scene.add(cube);


const fpc = new FirstPersonViewer(camera, canvas);

/**
 * start rendering
 */
function animate() {
    requestAnimationFrame(animate);
    fpc.update();
    cube.rotation.y += 0.002;
    cube.rotation.z += 0.002;
    renderer.render(scene, camera);
};
animate();