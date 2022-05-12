import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

export class Ceiling {

    /**
     * @param {THREE.Scene} scene 
     * @param {THREE.Mesh} mesh 
     * @param {number} num_x times of repeated in x 
     * @param {number} num_y times of repeated in y
     * @param {number} len_x length of ceiling in x
     * @param {number} len_y length of ceiling in y
     */
    constructor(scene, mesh, num_x, num_y, len_x, len_y) {

        this.scene = scene;
        this.num_x = num_x;
        this.num_y = num_y;
        this.len_x = len_x;
        this.len_y = len_y;

        this.init_height = mesh.position.y;

        this.ceiling_array = [];
        this.height = 0;

        for (let i = 0; i < num_x * num_y; i++)
            this.ceiling_array.push(mesh.clone());

        this.x = this.ceiling_array[0].position.x;
        this.y = this.ceiling_array[0].position.y;
        this.z = this.ceiling_array[0].position.z;

        for (let i = 0; i < this.num_x; i++) {
            for (let j = 0; j < this.num_y; j++) {
                this.ceiling_array[i * this.num_x + j].position.x += i * this.len_x;
                this.ceiling_array[i * this.num_x + j].position.z += j * this.len_y;
            }
        }

        for (let i = 0; i < num_x * num_y; i++)
            this.scene.add(this.ceiling_array[i]);

        this.height = this.ceiling_array[0].position.y;
    }

    moveY(input_num) {

        for (let i = 0; i < this.num_x; i++) {
            for (let j = 0; j < this.num_y; j++) {
                this.ceiling_array[i * this.num_x + j].position.y += input_num;
            }
        }

        this.height = this.ceiling_array[0].position.y;
    }

    resume() {
        for (let i = 0; i < this.num_x * this.num_y; i++)
            this.ceiling_array[i].position.y = this.init_height;

        this.height = this.init_height;
    }
}