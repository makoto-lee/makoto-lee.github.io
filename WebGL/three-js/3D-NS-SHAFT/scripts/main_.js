import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { BufferGeometryUtils } from 'https://cdn.jsdelivr.net/npm/three@0.125.2/examples/jsm/utils/BufferGeometryUtils.js';
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.132.2/examples/jsm/loaders/GLTFLoader.js";
import { FirstPersonController } from "./FirstPersonController.js";
import { FirstPersonViewer } from "./FirstPersonViewer.js"
import { Ground } from "./Ground.js";
import { World } from "./World.js";
import { game_end } from "./game_ui_funtions.js";
import { BlockManager } from "./BlockManager.js";
import { StateManager } from "./StateManager.js";
import { WallManager } from "./WallManager.js";
import { AudioManager } from "./AudioManager.js";
import { Ceiling } from "./Ceiling.js";


function getCookieScore() {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; max_score=`);
    if (parts.length === 2)
        return parts.pop().split(';').shift();
    else
        return -1;
}

const listener = new THREE.AudioListener();

function main() {

    const manager = new THREE.LoadingManager();
    manager.onLoad = init;

    // === my_model ===
    my_models["jump_board"] = {
        gltf_url: './material/objects/Jump_board/jump_board.gltf',
        texture_url: './material/objects/Jump_board/textures/baking_2.png'
    };

    // === model ===

    models["concrete_block"] = {
        gltf_url: './material/objects/Concrete_block/Paving_Stone.gltf',
        texture_url: './material/objects/Concrete_block/texture/rough_plasterbrick_05_diff_1k.jpg'
    };
    models["ground"] = { texture_url: './material/pictures/ground.png' };
    models["player"] = {};
    models["wall"] = {
        texture_url: './material/objects/Factory_brick/textures/factory_brick_diff_1k.jpg',
        normal_map_url: './material/objects/Factory_brick/textures/factory_brick_nor_gl_1k.exr'
    };
    models["spike"] = {
        gltf_url: './material/objects/Spike_trap/scene.gltf',
        texture_url: './material/objects/Spike_trap/textures/OPM0041_baseColor_s.png',
        //normal_map_url: './material/Spike_trap/textures/OPM0041_normal.png'
    }

    // === audio ===

    audios["endgame_scream"] = {
        audio_url: './material/audios/classic_dead_audio.mp3'
    };
    audios["ceiling_moving"] = {
        position_audio_url: './material/audios/machine_1.wav'
    };
    audios["concrete_landing"] = {
        audio_url: './material/audios/landing.mp3'
    }
    audios["jump_board_landing"] = {
        audio_url: './material/audios/Spring-sound-effect-metal.mp3'
    }
    audios["bgm"] = {
        audio_url: './material/audios/bgm.mp3'
    }
    audios["damaged"] = {
        audio_url: './material/audios/oof_hurt.mp3'
    }
    audios["lobby_bgm"] = {
        audio_url: './material/audios/syndrome-official-youtube-channel.mp3'
    }


    {
        // == gltf_loader
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
            for (const [key, model] of Object.entries(my_models)) {
                if ("gltf_url" in model) {

                    // load the gltf
                    gltf_loader.load(my_models[key].gltf_url,
                        (gltf) => {
                            let geo_array = [];
                            gltf.scene.traverse((child) => {
                                if (child.isMesh) {
                                    geo_array.push(child.geometry);
                                }
                            });

                            let geo_buf = new THREE.BufferGeometry();
                            geo_buf = BufferGeometryUtils.mergeBufferGeometries(geo_array);
                            geo_buf.computeBoundingBox();
                            const mm = new THREE.Mesh(geo_buf);

                            mm.receiveShadow = true;
                            mm.castShadow = true;
                            mm.name = `${key}`;
                            my_models[key].mesh = mm;
                        },
                        (xhr) => { console.log(`${key} GLTF ` + (xhr.loaded / xhr.total) * 100 + '% loaded'); },
                        (error) => { console.log(`Error happend when loading ${key} GLTF`); }
                    );

                }
            }
        }
        // == texture_loader
        {
            const texture_loader = new THREE.TextureLoader(manager);

            for (const [key, model] of Object.entries(models)) {
                if ("texture_url" in model) {

                    // load the texture
                    texture_loader.load(model.texture_url, (t) => { models[key].texture = t; });
                }
            }
            for (const [key, model] of Object.entries(my_models)) {
                if ("texture_url" in model) {

                    // load the texture
                    texture_loader.load(model.texture_url, (t) => { my_models[key].texture = t; });
                }
            }
        }
        // == normal_map_loader
        {
            const normal_map_loader = new THREE.TextureLoader(manager);

            for (const [key, model] of Object.entries(models)) {
                if ("normal_map_url" in model) {

                    // load the texture
                    normal_map_loader.load(model.normal_map_url, (t) => { models[key].normal_map = t; });
                }
            }
        }

        // == audio
        {
            const audioLoader = new THREE.AudioLoader(manager);

            for (const [key, audio] of Object.entries(audios)) {
                //console.log(key);
                if ("audio_url" in audio) {
                    audioLoader.load(audio.audio_url,
                        (buffer) => {
                            audios[key].sound = new THREE.Audio(listener);
                            audios[key].sound.setBuffer(buffer);
                            audios[key].sound.setVolume(0.5);
                        }
                    );
                }
                else if ("position_audio_url" in audio) {
                    audioLoader.load(audio.position_audio_url,
                        (buffer) => {
                            audios[key].sound = new THREE.PositionalAudio(listener);
                            audios[key].sound.setBuffer(buffer);
                            audios[key].sound.setVolume(1);
                        }
                    );
                }
            }
        }

        // == progress bar
        {
            const progress_bar_elem = document.getElementById("progress_bar");
            manager.onProgress = (url, itemsLoaded, itemsTotal) => {
                progress_bar_elem.style.width = `${100 - (itemsLoaded / itemsTotal * 100)}%`;
            };
        }
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
        front_sight.src = "./material/pictures/front_sight.png";

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
        camera.add(listener);

        if (!window.WebGLRenderingContext) {
            alert("Sorry, your browser doesn`t support WebGL");
        }
        const renderer = new THREE.WebGLRenderer({ canvas: render_canvas });
        renderer.setSize(render_canvas.width, render_canvas.height);
        //renderer.shadowMap.enabled = true;
        //const axesHelper = new THREE.AxesHelper(10);
        //scene.add(axesHelper);

        /**
         * setup World
         */
        const wd = new World(scene, 0.009);


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

        w_manager = new WallManager(scene, fpc, models.wall.mesh);

        /**
         * setup spike
         */
        models.spike.texture.flipY = false;
        models.spike.mesh.material = new THREE.MeshPhongMaterial({
            color: "white",
            map: models.spike.texture,
            //normalMap: models.spike.normal_map
        });

        models.spike.mesh.scale.set(4, 4, 4);
        models.spike.mesh.rotation.x = Math.PI / 2;

        models.spike.mesh.receiveShadow = false;
        models.spike.mesh.castShadow = false;

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
                console.log("collid concrete");
                fpc.box.velocity.y = 0;
                s_manager.state.standOn = "concrete_landing";

            });

        /**
         * setup jump_board
         */
        my_models.jump_board.texture.flipY = false;
        my_models.jump_board.mesh.material = new THREE.MeshLambertMaterial({ map: my_models.jump_board.texture });

        my_models.jump_board.ground = new Ground(my_models.jump_board.mesh, 2.9, 0.1, 5.5, new THREE.Vector3(1.9, 0.1, -0.6));
        my_models.jump_board.ground.addEvent("collid",
            () => {
                console.log("collid jump_board");
                //console.log(fpc.box.velocity.y);
                fpc.box.velocity.y = Math.max(0.3, Math.abs(fpc.box.velocity.y * 0.7));
                s_manager.state.standOn = "jump_board_landing";
            });

        /**
         * setup lights
         */

        dot_light = new THREE.PointLight(0xffffff, 2, 25);
        dot_light.castShadow = true
        dot_light.add(audios["ceiling_moving"].sound);
        scene.add(dot_light);

        //let spotLightHelper = new THREE.SpotLightHelper(spot_light);
        //scene.add(spotLightHelper);

        let ambient_light = new THREE.AmbientLight(0xeeeeee, 0.3);
        scene.add(ambient_light);

        /**
         * setup audios
         */
        audios["ceiling_moving"].sound.setRolloffFactor(20);
        audios["ceiling_moving"].sound.setRefDistance(15);

        /**
         * setup Audio Manager
         */
        a_manager = new AudioManager(fpc, audios);

        /**
         * setup Block Manager
         */
        // name : [ground, probability(%)]
        let block_dict = {
            concrete: [models.concrete_block.ground, 70],
            jump: [my_models.jump_board.ground, 30]
        };

        b_manager = new BlockManager(wd, block_dict, lowering_speed, 10, 4);

        /**
         * setup StateManager
         */
        s_manager = new StateManager(fpc, ceiling, a_manager);

        // ==============================

        //show the title
        document.getElementById("loading").style.visibility = "hidden";
        document.getElementById("three_js").style.visibility = "hidden";
        document.getElementById("title").style.visibility = "visible";

        // play lobby_bgm
        title_bgm_audio.play();


        // ===========================================================

        const health_bar_elem = document.getElementById("health_bar");
        const depth_num_elem = document.getElementById("depth_num");
        const max_depth_num_elem = document.getElementById("max_depth_num");


        // load score
        max_score = getCookieScore();
        if (max_score == -1) {
            document.cookie = "max_score=0";
            max_score = 0;
        }
        max_depth_num_elem.innerText = max_score;

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

        let in_air_before, in_air_after;

        window.setInterval(
            () => {
                if (game_running == true) {

                    in_air_before = fpc._in_air;

                    wd.update();

                    in_air_after = fpc._in_air;

                    // landing check
                    if (in_air_before && !in_air_after) {
                        a_manager.play(s_manager.state.standOn);
                        console.log(s_manager.state.standOn);
                    }

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
                    curr_score = (fpc.box.position.y * (-1) / 4) | 0;
                    depth_num_elem.innerText = `${curr_score}`;
                    if (max_score < curr_score) {
                        max_score = curr_score;
                        max_depth_num_elem.innerText = `${max_score}`;
                    }

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