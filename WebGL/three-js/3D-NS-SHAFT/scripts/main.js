import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { FBXLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";
import { FirstPersonController } from "./FirstPersonController.js";
import { FirstPersonViewer } from "./FirstPersonViewer.js"
import { Ground } from "./Ground.js";
import { World } from "./World.js";



/**
* setup render canvas
*/
const render_canvas = document.getElementById("render_canvas");
console.log(window.innerWidth);
console.log(window.innerHeight);
render_canvas.width = window.innerWidth * 2;
render_canvas.height = window.innerHeight * 2;

render_canvas.style.transform = `
    translateX(${-window.innerWidth / 2}px)
    translateY(${-window.innerHeight / 2}px)
    scale(0.5)`;


/**
 * setup ui canvas
 */
const ui_canvas = document.getElementById("ui_canvas");
ui_canvas.width = window.innerWidth;
ui_canvas.height = window.innerHeight;

ui_canvas.style.transform = `scale(0.5)`;


let front_sight_size = 47;
const front_sight = new Image(front_sight_size, front_sight_size);
front_sight.src = "front_sight.png";

front_sight.onload = drawFrontSight;

function drawFrontSight() {

    const ctx = ui_canvas.getContext('2d');
    ctx.drawImage(front_sight,
        ui_canvas.width / 2 - Math.ceil(front_sight.width / 2),
        ui_canvas.height / 2 - Math.ceil(front_sight.height / 2),
        front_sight_size, front_sight_size);

}


/**
 * set up scene, camera, renderer
 */
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, render_canvas.width / render_canvas.height, 0.1, 2000);
camera.position.set(0, 2, 0);

if (!window.WebGLRenderingContext) {
    alert("Sorry, your browser doesn`t support WebGL");
}
const renderer = new THREE.WebGLRenderer({ canvas: render_canvas });
renderer.setSize(render_canvas.width, render_canvas.height);
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

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
    const skybox = new THREE.Mesh(skybox_geo, material_array);
    skybox.name = "sky";
    scene.add(skybox);

}
setupSkybox();

/**
 * add a cube
 */
const cube_geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
const cube_material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const cube = new THREE.Mesh(cube_geometry, cube_material);
cube.name = "cube";
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
ground_mesh.name = "ground";
ground_mesh.position.set(0, -1, 0);

const main_ground = new Ground(ground_mesh, 50, 0.2, 50, new THREE.Vector3(0, 0.3, 0));
main_ground.addEvent("collid",
    () => {
        //fpc.setPosition(0, 5, 0);
        //fpc.box.velocity.y = 0;
    });
wd.addGround(main_ground);


/**
 * add plane
 */
let concrete_block_mesh = null;
const concrete_block_texture = new THREE.TextureLoader().load('./Concrete_block/texture/rough_plasterbrick_05_diff_1k.jpg',
    (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(7, 5);
    }
);
const concrete_block_material = new THREE.MeshBasicMaterial({ map: concrete_block_texture });

/*
const fbx_loader = new FBXLoader();
fbx_loader.load('./Concrete_block/Paving_Stone.fbx',
    (loadedModel) => {
        concrete_block_mesh = loadedModel.children[0].clone();

        //console.log(concrete_block_mesh);

        concrete_block_mesh.material.map = concrete_block_texture;
        concrete_block_mesh.material.needsUpdate = true;

        scene.add(concrete_block_mesh);
    },
    (onProgress) => { console.log((onProgress.loaded / onProgress.total * 100) + '% loaded'); },
    (error) => { console.log('fbx_loader error happened'); });
*/
const gltf_loader = new GLTFLoader();
gltf_loader.load("./Concrete_block/Paving_Stone.gltf",
    (gltf) => {
        gltf.scene.traverse((child) => {
            if (child.isMesh) {
                const m = child;
                m.receiveShadow = true;
                m.castShadow = true;
                m.material = concrete_block_material;
                m.scale.set(0.7, 0.7, 0.2);
                m.name = 'concrete_block';


                let gd = new Ground(m, 5.7, 0.3, 5.5, new THREE.Vector3(0.2, 0.45, -0.5));
                //gd.addEvent("collid", () => { console.log("hi test"); });

                gd.setPosition(0, 0, 0);
                wd.addGround(gd);
            }
        });
    },
    (xhr) => { console.log("concrete block" + (xhr.loaded / xhr.total) * 100 + '% loaded') },
    (error) => { console.log("Error happend when loading GLTF"); }
);


/**
 * add player box
 */
const player_geometry = new THREE.BoxGeometry(1, 2, 1);
const player_material = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
const player_mesh = new THREE.Mesh(player_geometry, player_material);
player_mesh.name = "player";
player_mesh.position.set(0, 10, 0);
// set player mesh to layer 1, to make it not raycastable and non-visible
player_mesh.layers.set(1);
//console.log(player_mesh);

const fpc = new FirstPersonController(camera, render_canvas, player_mesh);
wd.addPlayer(fpc);

// when user click canvas start control
render_canvas.addEventListener('click',
    () => {
        fpc.start();
    })


/**
 * raycasting for object select
 */
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(0, 0);
raycaster.layers.set(0);

/**
 * start rendering
 */
const bulletin_board = document.getElementById("bulletin_board");
function animate() {
    requestAnimationFrame(animate);

    // update the picking ray with the camera and pointer position
    raycaster.setFromCamera(pointer, camera);
    const intersects = raycaster.intersectObjects(scene.children);

    if (intersects.length) {
        console.log(intersects[0].object.name);
        bulletin_board.innerText = intersects[0].object.name;
    }

    renderer.render(scene, camera);
};
animate();

/**
 * start gaming control
 */
window.setInterval(() => {
    //fpc.update();
    //fpc.move();
    wd.update();
    cube.rotation.y += 0.002;
    cube.rotation.z += 0.002;
},
    13);