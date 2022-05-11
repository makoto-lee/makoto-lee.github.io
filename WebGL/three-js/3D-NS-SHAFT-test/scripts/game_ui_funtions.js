import { FirstPersonController } from "./FirstPersonController.js";

export function game_start() {

    // show health bar    
    let health_div = document.getElementById("health");
    health_div.style.visibility = "visible";

    // ================================================
    // set objects position
    dot_light.position.set(0, 15, 0);

    b_manager.resume();
    b_manager.nextBlock();
    b_manager.nextBlock();
    b_manager.nextBlock();
    b_manager.nextBlock();
    b_manager.nextBlock();

    s_manager.state.health = s_manager.state.max_health;

    ceiling.resume();

    // ================================================

    let x = b_manager.world.ground_list[2].mesh.position.x;
    let y = b_manager.world.ground_list[2].mesh.position.y;
    let z = b_manager.world.ground_list[2].mesh.position.z;

    fpc.setPosition(x + 0.5, y + 2, z + 0.5);
    fpc.box.velocity.y = 0;

    fpc._forwarding = false;
    fpc._backwarding = false;
    fpc._lefting = false;
    fpc._righting = false;
    // start control fpc
    fpc.start();

    game_running = true;
}

export function game_end() {

    console.log("you dead !");

    game_running = false;

    // exit locking mouse
    document.exitPointerLock();

    // show you_dead_div
    let you_dead_div = document.getElementById("you_dead");
    you_dead_div.style.visibility = "visible";

}

function game_title_start() {

    console.log("start !");

    // hide title_div
    let title_div = document.getElementById("title");
    title_div.style.visibility = "hidden";

    game_start();
}

let start_button = document.getElementById("start_button");
start_button.onclick = game_title_start;


function game_resume() {

    console.log("continue !");

    // hide you_dead_div
    let you_dead_div = document.getElementById("you_dead");
    you_dead_div.style.visibility = "hidden";

    game_start();
}

let continue_button = document.getElementById("continue_button");
continue_button.onclick = game_resume;

// ============== test ============== 

window.addEventListener('keydown',
    (event) => {
        if (event.key == 'k')
            player_state.health = -999;
    });