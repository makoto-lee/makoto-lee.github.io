
export class AudioManager {

    /**
     * @param {FirstPersonController} player 
     * @param {dictionay_of_audio} audios 
     */
    constructor(player, audios) {
        this.game_running = false;
        this.player = player;
        this.audios = audios;
    }

    on() {
        this.game_running = true;

        this.audios.ceiling_moving.sound.setLoop(true);
        this.audios.ceiling_moving.sound.play();

        //this.audios.bgm.sound.setLoop(true);
        //this.audios.bgm.sound.play();
        
    }

    off() {
        
        this.audios.ceiling_moving.sound.stop();
        
    }
}