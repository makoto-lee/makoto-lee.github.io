// is it a proper way to share variables?

let game_running = false;

// ===
let bgm_audio = new Audio('./material/audios/bgm.mp3');
bgm_audio.volume = 0.15;
bgm_audio.loop = true;


let title_bgm_audio = new Audio('./material/audios/syndrome-official-youtube-channel.mp3');
title_bgm_audio.volume = 0.2;
title_bgm_audio.loop = true;

let button_hover_audio = new Audio('./material/audios/button_click.mp3');
button_hover_audio.volume = 0.7;
button_hover_audio.loop = false;

/**
 * @type {FirstPersonController}
 */
let fpc = null;

const my_models = {};

const models = {};

const audios = {};

// ===

let dot_light = null;

let ceiling = null;

// ===

let b_manager = null;

let s_manager = null;

let w_manager = null;

let a_manager = null;

// ==

let lowering_speed = 0.03;

// ==

let curr_score = 0;
let max_score = 0;