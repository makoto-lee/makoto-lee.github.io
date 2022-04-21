import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";
import { FirstPersonController } from "./FirstPersonController.js";
import { FirstPersonViewer } from "./FirstPersonViewer.js"
import { Ground } from "./Ground.js";
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
const cube_geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
const cube_material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(cube_geometry, cube_material);
cube.position.set(0, 2.5, 0);
scene.add(cube);

// =================================

const wd = new World(scene, 0.01);

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
const ground_mesh = new THREE.Mesh(ground_geometry, ground_material);
ground_mesh.position.set(0, 0, 0);

const main_ground = new Ground(ground_mesh, 50, 0.2, 50, new THREE.Vector3(0, 0.3, 0));
main_ground.addEvent("collid",
    () => {
        fpc.setPosition(0, 5, 0);
        fpc.box.velocity.y = 0;
    });
wd.addGround(main_ground);

/**
 * add island
 */

function getRandom(min, max) {
    return Math.floor(Math.random() * max) + min;
};

const blue_material = new THREE.MeshBasicMaterial({ color: 0x0000ee });

const tableTexture = new THREE.TextureLoader().load("./Wooden_Table/textures/wooden_table_02_diff_1k.jpg");
const tableMaterial = new THREE.MeshBasicMaterial({ map: tableTexture });

const loader = new GLTFLoader();
loader.load("./Wooden_Table/wooden_table_02_1k.gltf",
    (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                const m = child;
                m.receiveShadow = true;
                m.castShadow = true;
                m.material = tableMaterial;
                m.scale.multiplyScalar(2.5);


                let gd = new Ground(m, 2.8, 0.1, 1.75, new THREE.Vector3(0, 1.9, 0));
                //gd.addEvent("collid", () => { console.log("hi test"); });

                gd.setPosition(0, 0, 0);
                wd.addGround(gd);

                let x = 0;
                let y = 0;
                let z = 0;
                for (let i = 0; i < 3; i++) {
                    x += getRandom(2.0, 2.4);
                    z += getRandom(2.0, 2.4);
                    y++;
                    gd.setPosition(x, y, z);
                    wd.addGround(gd);
                }
                for (let i = 0; i < 5; i++) {
                    x += getRandom(2.0, 2.4);
                    z -= getRandom(2.0, 2.4);
                    y++;
                    gd.setPosition(x, y, z);
                    wd.addGround(gd);
                }
                for (let i = 0; i < 7; i++) {
                    x -= getRandom(2.0, 2.4);
                    z -= getRandom(2.0, 2.4);
                    y++;
                    gd.setPosition(x, y, z);
                    wd.addGround(gd);
                }
                for (let i = 0; i < 5; i++) {
                    x -= getRandom(2.0, 2.4);
                    z += getRandom(2.0, 2.4);
                    y++;
                    gd.setPosition(x, y, z);
                    wd.addGround(gd);
                }

            }
        });
    },
    (xhr) => {
        console.log("table :", (xhr.loaded / xhr.total) * 100 + '% loaded')
    },
    (error) => {
        console.log("Error happend when loading GLTF");
    });

/**
 * add plane

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
 */
//console.log(camera.children);


/**
 * add player box
 */
const player_geometry = new THREE.BoxGeometry(1, 2, 1);
const player_material = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
const player_mesh = new THREE.Mesh(player_geometry, player_material);
player_mesh.position.set(0, 10, 0);

const fpc = new FirstPersonController(camera, canvas, player_mesh);
canvas.addEventListener('click',
    () => {
        fpc.start();
    })

wd.addPlayer(fpc);

//window.setInterval(fpv.update, 10);
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