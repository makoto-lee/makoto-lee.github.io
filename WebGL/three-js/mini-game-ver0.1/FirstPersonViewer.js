import * as THREE from "https://cdn.skypack.dev/three@0.132.2";

export class FirstPersonViewer {
    _locked = false;
    _target_element;
    _look_dir;
    _theta = 0;
    _phi = 0;
    _toRadian = Math.PI / 180;

    /**
     * @param {THREE.PerspectiveCamera} camera 
     * camera in THREE.js that it will control
     * @param {document.Element} target_element 
     * Element in document the will lock your cursor
     */
    constructor(camera, target_element) {
        this.camera = camera;
        this._target_element = target_element;
        this._look_dir = new THREE.Vector3(1, 0, 0);
        this.camera_speed = 0.1;
        this.view_point_max = 80;
        this.view_point_min = -80;

        this._target_element.addEventListener("mousemove",
            (event) => {
                if (this._locked) {
                    let x_tmp = event.movementX;
                    let y_tmp = event.movementY;

                    // sometimes the event.movementX,Y may return a very big value, why?                     
                    if (Math.abs(event.movementY) > 100 | Math.abs(event.movementX) > 100) {
                        x_tmp = 0;
                        y_tmp = 0;
                    }

                    this._phi -= x_tmp * this.camera_speed;
                    this._theta -= y_tmp * this.camera_speed;

                    //console.log("X: " + x_tmp + " Y: " + y_tmp);
                    //console.log(this.camera.position);
                    //this._target_element.exitPointerLock();
                }
            });

        document.onpointerlockchange =
            (event) => {
                if (this._locked) {
                    this._locked = false;
                    console.log("pointer unlocked!");
                }
                else {
                    this._locked = true;
                    console.log("pointer locked!");
                }
            }

    }

    start() {
        if (!this._locked)
            this._target_element.requestPointerLock();
    }

    update() {
        // momentum
        //this._theta += this.#vy;
        //this._phi -= this.#vx;

        // handle max-minimum view point
        this._theta = Math.max(this._theta, this.view_point_min);
        this._theta = Math.min(this._theta, this.view_point_max);

        // change camera position
        this._look_dir.x = 200 * Math.sin((this._theta * -1 + 90) * this._toRadian) * Math.sin(this._phi * this._toRadian);
        this._look_dir.y = 200 * Math.cos((this._theta * -1 + 90) * this._toRadian);
        this._look_dir.z = 200 * Math.sin((this._theta * -1 + 90) * this._toRadian) * Math.cos(this._phi * this._toRadian);

        //console.log(this._look_dir);
        let new_look_dir = this._look_dir.add(this.camera.position);
        //console.log(new_look_dir);
        this.camera.lookAt(new_look_dir);
    }

}