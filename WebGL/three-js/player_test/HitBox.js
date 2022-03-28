import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

export class HitBox {
    /**
     * @param {THREE.Mesh} box_mesh 
     */
    constructor(box_mesh) {
        this.position = box_mesh.position;
        this.mesh = box_mesh;
        this.edge_length = {
            x: box_mesh.geometry.parameters.width,
            y: box_mesh.geometry.parameters.height,
            z: box_mesh.geometry.parameters.depth
        }
        this.velocity = {
            x: 0,
            y: 0,
            z: 0
        };
        this.acceleration = {
            x: 0,
            y: 0,
            z: 0
        };
    }
}