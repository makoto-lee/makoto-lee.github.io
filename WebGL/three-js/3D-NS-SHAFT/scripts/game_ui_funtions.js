import { FirstPersonController } from "./FirstPersonController.js";

const health_div = document.getElementById("health");
const depth_div = document.getElementById("depth");
const you_dead_div = document.getElementById("you_dead");
const title_div = document.getElementById("title");
const start_button = document.getElementById("start_button");
const continue_button = document.getElementById("continue_button");
// ==
const how_to_play_button = document.getElementById("how_to_play_button");
// ==
const more_button = document.getElementById("more_button");
const more_div = document.getElementById("more");
const more_content_div = document.getElementById("more_content");
const close_more_button = document.getElementById("more_close");


export function game_start() {

    // show health bar    
    health_div.style.visibility = "visible";

    // show depth
    depth_div.style.visibility = "visible";

    // ============= set objects position ==============
    // light
    dot_light.position.set(0, 15, 0);

    // block
    b_manager.resume();
    b_manager.nextBlock();
    b_manager.nextBlock();
    b_manager.nextBlock();
    b_manager.nextBlock();
    b_manager.nextBlock();

    // state
    s_manager.state.health = s_manager.state.max_health;

    // ceiling
    ceiling.resume();

    // wall
    w_manager.resume();

    // ================================================
    // place the player
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

    // ================================================
    // audios
    a_manager.on();
    bgm_audio.play();

    // ================================================
    game_running = true;
}

export function game_end() {

    console.log("you dead !");

    // ================================================
    // audios
    audios["endgame_scream"].sound.play();
    a_manager.off();
    bgm_audio.pause();

    // ================================================
    game_running = false;

    // exit locking mouse
    document.exitPointerLock();

    // show you_dead_div
    you_dead_div.style.visibility = "visible";
}

function game_title_start() {

    console.log("start !");

    // hide title_div
    title_div.style.visibility = "hidden";

    game_start();
}
start_button.onclick = game_title_start;


function game_resume() {

    console.log("continue !");

    // hide you_dead_div
    you_dead_div.style.visibility = "hidden";

    game_start();
}
continue_button.onclick = game_resume;


async function downloadFile() {
    let response = await fetch("./updata_diary.txt");

    if (response.status != 200) {
        throw new Error("Server Error : reading update_diary");
    }

    // read response stream as text
    let text_data = await response.text();

    return text_data;
}

function read_how_to() {
    alert("stay alive");
}
how_to_play_button.onclick = read_how_to;


function read_more() {

    async function ff() {
        try {
            let text_data = await downloadFile();
            more_content_div.innerText = text_data;
        }
        catch (e) {
            alert(e.message);
        }
    }
    ff();

    more_div.style.visibility = "visible";
    more_div.style.marginTop = "0vh";
}
more_button.onclick = read_more;

function close_more() {

    more_div.style.marginTop = "100vh";
    more_div.style.visibility = "hidden";

}
close_more_button.onclick = close_more;
