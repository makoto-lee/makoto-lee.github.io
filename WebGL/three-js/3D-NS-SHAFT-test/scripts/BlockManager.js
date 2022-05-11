
function getRandomFloat(min, max) {
    return (Math.random() * (max - min) + min);
}

export class BlockManager {

    /**
     * @param {World} world 
     * @param {dictionary_of_Ground} block_dict 
     * @param {Number} move_interval the speed of ceiling goes down
     * @param {Number} ceiling_height the height of ceiling in staring
     * @param {Number} block_interval the interval of height of each block
     */
    constructor(world, block_dict, move_interval = 0.02, ceiling_height = 15, block_interval = 4) {
        this.world = world;
        this.block_dict = block_dict;
        this.move_interval = move_interval;
        this.ceiling_height = ceiling_height;
        this.curr_ceiling_height = ceiling_height;
        this.block_interval = block_interval;

        this.bottom_height = 0;
        this.block_idx = 0;
        // the lower the it's index is the block is higher

    }

    nextBlock() {
        // pick block
        this.block_dict.concrete.setName(`block_${this.block_idx}`);
        this.block_idx += 1;

        let x_tmp = getRandomFloat(-5, 5);
        let z_tmp = getRandomFloat(-5, 5);
        this.block_dict.concrete.setPosition(x_tmp, this.bottom_height, z_tmp);

        this.bottom_height -= this.block_interval;

        // add block
        this.world.addGround(this.block_dict.concrete);
    }

    // updata the block in game, check if block need to remove or add
    update() {
        this.curr_ceiling_height -= this.move_interval;

        // check remove block

        /**
         * @type {Ground} 
         */
        let pick_block = this.world.ground_list[0]; // pick the block with min idx (the hightest)

        //console.log("pick_block.mesh.position.y", pick_block.mesh.position.y);
        //console.log("this.ceiling_height", this.ceiling_height);

        if (pick_block && pick_block.mesh.position.y > this.curr_ceiling_height) {

            console.log("removed a block 0.0");

            // remove the block
            this.world.removeGround(pick_block.mesh.name);

            // add new block
            this.nextBlock();
        }
    }

    resume() {
        console.log("clean blocks");

        // reset ceiling height
        this.curr_ceiling_height = this.ceiling_height;


        // remove all block
        for (let i = 0; i < this.world.ground_list.length; i++) {

            let pick_block = this.world.ground_list[i];
            //console.log(pick_block.mesh);
            let name = pick_block.mesh.name;
            let selected;

            selected = this.world.scene.getObjectByName(name);
            this.world.scene.remove(selected);

            selected = this.world.scene.getObjectByName(name + "_hitbox");
            this.world.scene.remove(selected);
        }
        this.world.ground_list = [];
        console.log("world.ground_list.length", this.world.ground_list.length);

        this.bottom_height = 0;
    }
}