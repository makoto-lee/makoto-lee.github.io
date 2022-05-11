import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { HitBox } from "./HitBox.js";
import { InteractObj } from "./InteractObj.js";

export class Ground extends InteractObj {

    /**
     * @param {THREE.Mesh} mesh 
     * @param {number} L length of the hitbox
     * @param {number} W width of the hitbox
     * @param {number} H height of the hitbox
     * @param {THREE.Vector3} shift
     */
    constructor(mesh, L, W, H, shift) {
        super();
        // composed with mesh & hitbox
        // mesh
        this.mesh = mesh.clone();
        this.L = L;
        this.W = W;
        this.H = H;
        this.shift = shift;

        // hitbox
        const box_geometry = new THREE.BoxGeometry(L, W, H);
        const box_material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

        this.box = new THREE.Mesh(box_geometry, box_material);
        this.box.position.copy(this.mesh.position);
        this.box.position.add(shift);

        this.hitbox = new HitBox(this.box);
    }

    clone() {
        let rt = new Ground(this.mesh, this.L, this.W, this.H, this.shift);
        rt.events_dict = this.events_dict;
        rt.box.name = this.box.name;
        return rt;
    }

    setPosition(x, y, z) {
        this.mesh.position.set(x, y, z);
        this.box.position.copy(this.mesh.position);
        this.box.position.add(this.shift);
        this.hitbox = new HitBox(this.box); // 一移動就開一個新的 Hitbox?! too wasted 要改
    }

    /**
     * @param {String} given_name 
     */
    setName(given_name) {
        this.mesh.name = given_name;
        this.box.name = `${given_name}_hitbox`;
    }
}