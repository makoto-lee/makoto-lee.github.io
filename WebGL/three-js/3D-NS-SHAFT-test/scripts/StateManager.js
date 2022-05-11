export class StateManager {

    /**
     * @param {FirstPersonController} player 
     * @param {Ceiling} ceiling 
     */
    constructor(player, ceiling) {
        this.player = player;
        this.ceiling = ceiling;
        this.live_range = 20;

        this.player_height = player.box.edge_length.y;

        this.state = {
            max_health: 1000,
            health: 1000
        }
    }

    update() {

        if (this.player.box.position.y + this.player_height > this.ceiling.height) {
            this.state.health -= 2;
        }

        if (this.player.box.position.y < this.ceiling.height - this.live_range) {
            this.state.health = -999;
        }
    }
}