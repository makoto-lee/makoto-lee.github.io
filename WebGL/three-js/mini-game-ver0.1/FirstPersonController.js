import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
import { FirstPersonViewer } from "./FirstPersonViewer.js";
import { HitBox } from "./HitBox.js";

export class FirstPersonController extends FirstPersonViewer {
    _forwarding = false;
    _backwarding = false;
    _lefting = false;
    _righting = false;
    // it is a const mtx variable only used to rotate _forward_dir to directing right
    #to_right_dir = new THREE.Matrix3().set(
        Math.cos(-Math.PI / 2), 0, Math.sin(-Math.PI / 2),
        0, 1, 0,
        -Math.sin(-Math.PI / 2), 0, Math.cos(-Math.PI / 2)
    );
    constructor(camera, target_element, mesh) {
        super(camera, target_element);

        // it is the project of now looking at to the x,z axis
        this._forward_dir = new THREE.Vector3(1, 0, 0);
        // it is the current right direction by rotate this._forward_dir by -pi/2
        this._right_dir = new THREE.Vector3(0, 0, 1);
        // this represent current moving direct
        this._move_dir = new THREE.Vector3(0, 0, 0);
        // the shift vector from box to camera
        this._camera_shift = new THREE.Vector3(0, 1, 0);
        // create player's box
        this.box = new HitBox(mesh);

        this.movespeed = {
            forward: 0.07,
            backward: 0.04
        }


        window.addEventListener('keydown',
            (event) => {
                if (this._locked) {
                    switch (event.key) {
                        case 'w':
                            //console.log("w keydown");
                            this._forwarding = true;
                            break;

                        case 'a':
                            //console.log("a keydown");
                            this._lefting = true;
                            break;

                        case 's':
                            //console.log("s keydown");
                            this._backwarding = true;
                            break;

                        case 'd':
                            //console.log("d keydown");
                            this._righting = true;
                            break;
                        case " ":
                            console.log("space keydown");
                            this.box.velocity.y = 0.2;
                            break;
                    }
                }
            });

        window.addEventListener('keyup',
            (event) => {
                if (this._locked) {
                    switch (event.key) {
                        case 'w':
                            //console.log("w keyup");
                            this._forwarding = false;
                            break;

                        case 'a':
                            //console.log("a keyup");
                            this._lefting = false;
                            break;

                        case 's':
                            //console.log("s keyup");
                            this._backwarding = false;
                            break;

                        case 'd':
                            //console.log("d keyup");
                            this._righting = false;
                            break;
                    }
                }
            });
    }

    // update the _move_dir, velocity
    update() {
        super.update();

        // compute forward direction
        this._forward_dir.copy(this._look_dir);
        this._forward_dir.y = 0;
        // compute right direction
        this._right_dir.copy(this._forward_dir);
        this._right_dir.applyMatrix3(this.#to_right_dir);

        if (this._forwarding) {
            //console.log("forwarding");
            this._move_dir.add(this._forward_dir);
            //console.log(this._move_dir);
        }
        else if (this._backwarding) {
            //console.log("backwarding");
            this._move_dir.add(this._forward_dir.multiplyScalar(-1));
        }

        if (this._righting) {
            //console.log("righting");
            this._move_dir.add(this._right_dir);
            //console.log(this._move_dir);
        }
        else if (this._lefting) {
            //console.log("lefting");
            this._move_dir.add(this._right_dir.multiplyScalar(-1));
        }

        this._move_dir.normalize();

        // update velocity
        this.box.velocity.y = this.box.velocity.y + this.box.acceleration.y;

        //console.log(this.box.velocity.y);
        //console.log(this.box.acceleration.y)
        //console.log(this.box.position.y);
        //console.log(this.camera.position);
    }

    // move the mesh and camera according to the velocity
    move() {
        // move box
        if (this._backwarding)
            this.box.position.add(this._move_dir.multiplyScalar(this.movespeed.backward));
        else
            this.box.position.add(this._move_dir.multiplyScalar(this.movespeed.forward));

        this.box.position.y = this.box.position.y + this.box.velocity.y;

        // move camera
        this.camera.position.copy(this.box.position);
        this.camera.position.add(this._camera_shift); // add camera shift

        // we reset this.move_dir
        this._move_dir.set(0, 0, 0);
    }
}
