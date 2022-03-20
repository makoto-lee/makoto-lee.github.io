import * as THREE from "https://cdn.skypack.dev/three@0.132.2";
export class FirstPersonViewer {
    #locked = false;
    #target_element;
    #look_dir;
    #dx;
    #dy;
    #vx = 0;
    #vy = 0;
    #theta = 0;
    #phi = 0;
    #toRadian = Math.PI / 180;

    constructor(camera, target_element) {
        this.camera = camera;
        this.#target_element = target_element;
        this.#look_dir = new THREE.Vector3(1, 0, 0);
        this.speed = 0.1;
        this.camera_position = camera.position;
        this.view_point_max = 80;
        this.view_point_min = -80;

        this.#target_element.addEventListener("click",
            () => {
                if (!this.#locked)
                    this.#target_element.requestPointerLock();

            }, false);

        this.#target_element.addEventListener("mousemove",
            (event) => {
                if (this.#locked) {
                    let x_tmp = event.movementX;
                    let y_tmp = event.movementY;
                    
                    // sometimes the event.movementX,Y may return a very big value
                    // 
                    if (Math.abs(event.movementY) > 100 | Math.abs(event.movementX) > 100) {
                        x_tmp = 0;
                        y_tmp = 0;
                    }
                    this.#phi -= x_tmp * this.speed;
                    this.#theta -= y_tmp * this.speed;

                    console.log("X: " + x_tmp + " Y: " + y_tmp);
                    //console.log(this.camera.position);
                    //this.#target_element.exitPointerLock();
                }
            });

        document.onpointerlockchange =
            (event) => {
                if (this.#locked) {
                    this.#locked = false;
                    console.log("pointer unlocked!");
                }
                else {
                    this.#locked = true;
                    console.log("pointer locked!");
                }
            }

    }

    update() {
        // momentum
        //this.#theta += this.#vy;
        //this.#phi -= this.#vx;

        // handle max-minimum view point
        this.#theta = Math.max(this.#theta, this.view_point_min);
        this.#theta = Math.min(this.#theta, this.view_point_max);

        // change camera position
        this.#look_dir.x = 200 * Math.sin((this.#theta * -1 + 90) * this.#toRadian) * Math.sin(this.#phi * this.#toRadian);
        this.#look_dir.y = 200 * Math.cos((this.#theta * -1 + 90) * this.#toRadian);
        this.#look_dir.z = 200 * Math.sin((this.#theta * -1 + 90) * this.#toRadian) * Math.cos(this.#phi * this.#toRadian);

        //console.log(this.#look_dir);
        let new_look_dir = this.#look_dir.add(this.camera_position);
        //console.log(new_look_dir);
        this.camera.lookAt(new_look_dir);
    }

}