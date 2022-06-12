import { AudioManager } from "./AudioManager.js";

export class StateManager {

    /**
     * @param {FirstPersonController} player 
     * @param {Ceiling} ceiling 
     * @param {AudioManager} AM
     */
    constructor(player, ceiling, AM) {
        this.player = player;
        this.ceiling = ceiling;
        this.AM = AM;
        this.live_range = 25;

        this.player_height = player.box.edge_length.y;

        this.state = {
            max_health: 1000,
            health: 1000,
            damaging: false,
            standOn: -1
        }
    }

    update() {
        // healing by time
        this.state.health += 0.1;

        // when player is above ceiling -3 health
        if (this.player.box.position.y + this.player_height > this.ceiling.height) {
            this.state.health -= 3; // when player is above ceiling -3 health
            if (this.state.damaging == false) {
                console.log("damaged >o<");
                this.AM.play("damaged");    // play damaged sound
            }
            this.state.damaging = true;
        }
        else {
            this.state.damaging = false;
        }

        // when fall out 
        if (this.player.box.position.y < this.ceiling.height - this.live_range) {
            this.state.health = -999;
        }

        this.state.health = Math.min(this.state.health, this.state.max_health);
    }
}