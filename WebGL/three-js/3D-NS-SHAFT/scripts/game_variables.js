// is it a proper way to share variables?

let game_running = false;

// ===
let bgm_audio = new Audio('./material/audios/bgm.mp3');
bgm_audio.volume = 0.2;
bgm_audio.loop = true;

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