import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { FBXLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/FBXLoader.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";
import { FirstPersonController } from "./FirstPersonController.js";
import { FirstPersonViewer } from "./FirstPersonViewer.js"
import { Ground } from "./Ground.js";
import { World } from "./World.js";
import { game_end } from "./game_ui_funtions.js";
import { BlockManager } from "./BlockManager.js";
import { StateManager } from "./StateManager.js";
import { WallManager } from "./WallManager.js";
import { Ceiling } from "./Ceiling.js";


function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

function main() {

    const manager = new THREE.LoadingManager();
    manager.onLoad = init;

    models["concrete_block"] = {
        gltf_url: './material/Concrete_block/Paving_Stone.gltf',
        texture_url: './material/Concrete_block/texture/rough_plasterbrick_05_diff_1k.jpg'
    };
    models["ground"] = { texture_url: './material/ground.png' };
    models["player"] = {};
    models["wall"] = {
        texture_url: './material/Factory_brick/textures/factory_brick_diff_1k.jpg',
        normal_map_url: './material/Factory_brick/textures/factory_brick_nor_gl_1k.exr'
    };
    models["spike"] = {
        gltf_url: './material/Spike_trap/scene.gltf',
        texture_url: './material/Spike_trap/textures/OPM0041_baseColor_s.png',
        //normal_map_url: './material/Spike_trap/textures/OPM0041_normal.png'
    }


    {
        const gltf_loader = new GLTFLoader(manager);

        for (const [key, model] of Object.entries(models)) {
            if ("gltf_url" in model) {

                // load the gltf
                gltf_loader.load(model.gltf_url,
                    (gltf) => {
                        gltf.scene.traverse((child) => {
                            if (child.isMesh) {
                                const m = child;
                                m.receiveShadow = true;
                                m.castShadow = true;
                                m.wireframe = true;
                                m.renderOrder = 0;

                                m.name = `${key}`;
                                models[key].mesh = m;
                            }
                        });
                    },
                    (xhr) => { console.log(`${key} GLTF ` + (xhr.loaded / xhr.total) * 100 + '% loaded'); },
                    (error) => { console.log(`Error happend when loading ${key} GLTF`); }
                );

            }
        }

        // ==

        const texture_loader = new THREE.TextureLoader(manager);

        for (const [key, model] of Object.entries(models)) {
            if ("texture_url" in model) {

                // load the texture
                texture_loader.load(model.texture_url, (t) => { models[key].texture = t; });
            }
        }

        // ==

        const normal_map_loader = new THREE.TextureLoader(manager);

        for (const [key, model] of Object.entries(models)) {
            if ("normal_map_url" in model) {

                // load the texture
                normal_map_loader.load(model.normal_map_url, (t) => { models[key].normal_map = t; });
            }
        }

        // ==

        const progress_bar_elem = document.getElementById("progress_bar");
        manager.onProgress = (url, itemsLoaded, itemsTotal) => {
            progress_bar_elem.style.width = `${100 - (itemsLoaded / itemsTotal * 100)}%`;
        };
    }

    function init() {
        console.log("init !!");
        /**
        * setup render canvas
        */
        const render_canvas = document.getElementById("render_canvas");
        console.log("window.innerWidth :", window.innerWidth);
        console.log("window.innerHeight :", window.innerHeight);
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
        front_sight.src = "./material/front_sight.png";

        front_sight.onload = drawFrontSight;

        function drawFrontSight() {

            const ctx = ui_canvas.getContext('2d');
            ctx.drawImage(front_sight,
                ui_canvas.width / 2 - Math.ceil(front_sight.width / 2),
                ui_canvas.height / 2 - Math.ceil(front_sight.height / 2),
                front_sight_size, front_sight_size);

        }

        /**
        * setup scene, camera, renderer
        */
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, render_canvas.width / render_canvas.height, 0.1, 2000);
        camera.position.set(3, 0, 3);
        camera.lookAt(0, 0, 0);

        if (!window.WebGLRenderingContext) {
            alert("Sorry, your browser doesn`t support WebGL");
        }
        const renderer = new THREE.WebGLRenderer({ canvas: render_canvas });
        renderer.setSize(render_canvas.width, render_canvas.height);
        //const axesHelper = new THREE.AxesHelper(10);
        //scene.add(axesHelper);

        /**
         * setup World
         */
        const wd = new World(scene, 0.01);

        /**
         * setup ground
         */
        models.ground.geometry = new THREE.BoxGeometry(50, 1, 50);

        models.ground.texture.wrapS = models.ground.texture.wrapT = THREE.RepeatWrapping;
        models.ground.texture.offset.set(0, 0);
        models.ground.texture.repeat.set(80, 80);

        models.ground.material = new THREE.MeshBasicMaterial({ map: models.ground.texture });

        models.ground.mesh = new THREE.Mesh(models.ground.geometry, models.ground.material);
        models.ground.mesh.position.set(0, 0, 0);
        models.ground.mesh.name = "ground";

        const main_ground = new Ground(models.ground.mesh, 50, 0.2, 50, new THREE.Vector3(0, 0.3, 0));
        main_ground.addEvent("collid",
            () => {
                //fpc.setPosition(0, 5, 0);
                //fpc.box.velocity.y = 0;
            });
        //wd.addGround(main_ground);

        /**
         * setup player
         */
        models.player.geometry = new THREE.BoxGeometry(1, 2, 1);
        models.player.material = new THREE.MeshBasicMaterial({ color: 0xeeeeee });
        models.player.mesh = new THREE.Mesh(models.player.geometry, models.player.material);

        models.player.mesh.name = "player";
        models.player.mesh.position.set(0, 10, 0);

        fpc = new FirstPersonController(camera, render_canvas, models.player.mesh);
        wd.addPlayer(fpc);


        /**
         * setup wall
         */

        models.wall.texture.wrapS = models.wall.texture.wrapT = THREE.RepeatWrapping;
        models.wall.texture.repeat.set(7, 5);

        models.wall.geometry = new THREE.CylinderGeometry(20, 20, 80, 32);
        models.wall.material = [
            new THREE.MeshPhongMaterial({ map: models.wall.texture, side: THREE.BackSide }),
            new THREE.MeshPhongMaterial({ color: 0x000000, opacity: 0, transparent: true }),
            new THREE.MeshPhongMaterial({ color: 0x000000, opacity: 0, transparent: true })
        ];
        models.wall.mesh = new THREE.Mesh(models.wall.geometry, models.wall.material);
        models.wall.mesh.receiveShadow = true;
        models.wall.mesh.castShadow = true;
        models.wall.mesh.wireframe = true;
        models.wall.mesh.renderOrder = 0;

        w_manager = new WallManager(scene, fpc, models.wall.mesh);

        /**
         * setup spike
         */
        models.spike.mesh.material = new THREE.MeshPhongMaterial({
            map: models.spike.texture,
            //normalMap: models.spike.normal_map
        });

        models.spike.mesh.scale.set(4, 4, 4);
        models.spike.mesh.rotation.x = Math.PI / 2;

        models.spike.mesh.receiveShadow = true;
        models.spike.mesh.castShadow = true;
        models.spike.mesh.wireframe = true;
        models.spike.mesh.renderOrder = 0;

        models.spike.mesh.position.set(-15.6, 10, -15.6);

        ceiling = new Ceiling(scene, models.spike.mesh, 13, 13, 2.4, 2.4);

        /**
         * setup concrete_block
         */
        models.concrete_block.mesh.scale.set(0.7, 0.7, 0.2);

        models.concrete_block.texture.wrapS = models.concrete_block.texture.wrapT = THREE.RepeatWrapping;
        models.concrete_block.texture.offset.set(0, 0);
        models.concrete_block.texture.repeat.set(7, 5);

        models.concrete_block.mesh.material = new THREE.MeshLambertMaterial({ map: models.concrete_block.texture });

        models.concrete_block.ground = new Ground(models.concrete_block.mesh, 5.7, 0.3, 5.5, new THREE.Vector3(0.2, 0.45, -0.5));

        models.concrete_block.ground.addEvent("collid",
            () => {
                //console.log("collid block");
            });


        /**
         * setup lights
         */
        //spot_light.castShadow = true;

        dot_light = new THREE.PointLight(0xffffff, 1, 25);
        scene.add(dot_light);

        //let spotLightHelper = new THREE.SpotLightHelper(spot_light);
        //scene.add(spotLightHelper);

        let ambient_light = new THREE.AmbientLight(0xeeeeee, 0.3);
        scene.add(ambient_light);


        /**
         * setup Block Manager
         */
        let block_dict = {
            concrete: models.concrete_block.ground
        };

        b_manager = new BlockManager(wd, block_dict, lowering_speed, 10, 4);

        /**
         * setup StateManager
         */
        s_manager = new StateManager(fpc, ceiling);

        // ==============================

        //show the title
        document.getElementById("loading").style.visibility = "hidden";
        document.getElementById("title").style.visibility = "visible";


        // ===========================================================


        /**
         * start rendering
         */
        function animate() {
            requestAnimationFrame(animate);

            renderer.render(scene, camera);
        };
        animate();

        /**
        * start gaming control
        */
        const health_bar_elem = document.getElementById("health_bar");
        const depth_num_elem = document.getElementById("depth_num");

        window.setInterval(
            () => {
                if (game_running == true) {

                    console.log("curr height:", fpc.box.position.y);

                    wd.update();

                    // lower ceiling
                    ceiling.moveY(-lowering_speed);

                    // lower dot light
                    dot_light.position.y += -lowering_speed;

                    // refresh blocks
                    b_manager.update();

                    // player state update
                    s_manager.update();

                    // update health bar
                    health_bar_elem.style.width = `${s_manager.state.health / s_manager.state.max_health * 100}%`;

                    // update depth
                    depth_num_elem.innerText = `${(fpc.box.position.y * (-1) / 4) | 0}`

                    // player state check
                    if (s_manager.state.health <= 0) {
                        game_end();
                    }
                }
            },
            13);// 60hz

        // update scene that doesn't need update so frequently
        window.setInterval(
            () => {
                if (game_running == true) {

                    // wall update
                    w_manager.update();

                }
            },
            1);//1 hz
    }
};

main();