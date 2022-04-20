import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { HitBox } from "./HitBox.js";
import { FirstPersonController } from "./FirstPersonController.js";
import { Ground } from "./Ground.js";

export class World {
    /**
     * @param {THREE.Scene} scene 
     * @param {number} gravity 
     */
    constructor(scene, gravity = 0.01) {
        this.scene = scene;
        this.gravity = gravity;
        this.ground_list = [];
    }

    /**
     * @param {Ground} ground
     */
    addGround(ground) {
        const gd = ground.clone();
        this.ground_list.push(gd);
        this.scene.add(gd.mesh);
        this.scene.add(gd.box);
    }

    /**
     * @param {FirstPersonController} player 
     */
    addPlayer(player) {
        this.player = player;
        this.player.box.acceleration.y = -this.gravity;
    }

    /**
     * @param {HitBox} player 
     * @param {HitBox} ground 
     */
    static _collision_detect(player_box, ground) {
        // we just detect if the player is on the ground(y-axis),
        // and if it will collid on ground at next moment

        let p_x = player_box.position.x - player_box.edge_length.x / 2;;
        let p_y = player_box.position.y - player_box.edge_length.y / 2;;
        let p_z = player_box.position.z - player_box.edge_length.z / 2;;

        let g_x = ground.position.x - ground.edge_length.x / 2;
        let g_y = ground.position.y - ground.edge_length.y / 2;
        let g_z = ground.position.z - ground.edge_length.z / 2;

        if (p_y >= g_y + ground.edge_length.y &&
            p_y + player_box.velocity.y <= g_y + ground.edge_length.y &&
            p_x + player_box.edge_length.x >= g_x &&
            p_x <= g_x + ground.edge_length.x &&
            p_z + player_box.edge_length.z >= g_z &&
            p_z <= g_z + ground.edge_length.z)
            return true;
        return false;
    }

    update() {

        // update all the members
        this.player.update();

        for (let i = 0; i < this.ground_list.length; i++) {
            
            if (World._collision_detect(this.player.box, this.ground_list[i].hitbox)) {
                console.log("collid !!!!");
                this.player.box.velocity.y = 0;
            }
        }

        this.player.move();

    }
}