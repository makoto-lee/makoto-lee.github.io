
export class WallManager {

    /**
     * @param {THREE.Scene} scene 
     * @param {FirstPersonController} player 
     * @param {THREE.Mesh} wall 
     */
    constructor(scene, player, wall) {
        this.scene = scene;
        this.player = player;
        this.wall = wall;
        this.wall_height = wall.geometry.parameters.height;
        this.wall_num = 3;
        this.curr_bottom = 0;
        //this._wall_idx = 0;

        this.wall_array = [];
        for (let i = 0; i < this.wall_num; i++)
            this.wall_array.push(this.wall.clone());


        for (let i = 0; i < this.wall_num; i++) {
            this.wall_array[i].name = `wall_${i}`;
            this.wall_array[i].position.set(0, this.curr_bottom, 0);
            this.curr_bottom -= this.wall_height;

            this.scene.add(this.wall_array[i]);
        }
    }

    update() {

        if (this.wall_array[0].position.y > this.player.box.position.y + this.wall_height) {
            let pick_wall = this.wall_array.shift();

            pick_wall.position.set(0, this.curr_bottom, 0);
            this.curr_bottom -= this.wall_height;

            this.wall_array.push(pick_wall);
        }

    }

    resume() {
        
        this.curr_bottom = 0;

        for (let i = 0; i < this.wall_num; i++) {
            this.wall_array[i].position.set(0, this.curr_bottom, 0);
            this.curr_bottom -= this.wall_height;
        }
        
    }
}