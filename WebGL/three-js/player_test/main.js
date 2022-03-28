import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";
import { FirstPersonController } from "./FirstPersonController.js";
import { FirstPersonViewer } from "./FirstPersonViewer.js"
import { World } from "./World.js";

const canvas = document.getElementById("myCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

/**
 * set up scene, camera, renderer
 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.width / canvas.height, 0.1, 2000);
camera.position.set(0, 2, 0);

if (!window.WebGLRenderingContext) {
    alert("Sorry, your browser doesn`t support WebGL");
}
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(canvas.width, canvas.height);

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
cube.position.set(1, 2, 1);
scene.add(cube);


//const cube_ = new THREE.Mesh(cube_geometry, cube_material);
//cube_.scale.set(0.2);
//cube_.position.set(2, 0, 2);
//camera.add(cube_);

/**
 * add ground
 */
const ground_geometry = new THREE.BoxGeometry(50, 1, 50);
const ground_texture = new THREE.TextureLoader().load('./ground.png',
    (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(80, 80);

    });
const ground_material = new THREE.MeshBasicMaterial({ map: ground_texture });
const ground = new THREE.Mesh(ground_geometry, ground_material);
ground.position.set(0, 0, 0);
scene.add(ground);


/**
 * add plane
 */
const plane_geometry = new THREE.BoxGeometry(4, 0.2, 4);
const plane_material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
//
const plane1 = new THREE.Mesh(plane_geometry, plane_material);
plane1.position.set(4, 2, 4);
scene.add(plane1);
//
const plane2 = new THREE.Mesh(plane_geometry, plane_material);
plane2.position.set(7, 3, 7);
scene.add(plane2);
//
const plane3 = new THREE.Mesh(plane_geometry, plane_material);
plane3.position.set(2, 4, 7);
scene.add(plane3);

//console.log(camera.children);


/**
 * add player box
 */
const player_geometry = new THREE.BoxGeometry(1, 2, 1);
const player_material = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
const player_mesh = new THREE.Mesh(player_geometry, player_material);
player_mesh.position.set(1, 10, 1);
scene.add(player_mesh);

//console.log(player_mesh.geometry.parameters);

const fpc = new FirstPersonController(camera, canvas, player_mesh);
canvas.addEventListener('click',
    () => {
        fpc.start();
    })
//window.setInterval(fpv.update, 10);

const wd = new World();
wd.addGround(ground);
wd.addGround(plane1);
wd.addGround(plane2);
wd.addGround(plane3);
wd.addPlayer(fpc);

/**
 * start rendering
 */
function animate() {
    requestAnimationFrame(animate);

    wd.update();

    cube.rotation.y += 0.002;
    cube.rotation.z += 0.002;
    renderer.render(scene, camera);
};
animate();