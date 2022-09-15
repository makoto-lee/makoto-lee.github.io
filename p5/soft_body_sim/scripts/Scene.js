class Scene {

    constructor(name = "new scene") {
        this.name = name;
        this.ground_dict = {};
        this.softbody_dict = {};
    }

    /**
     * @param {Softbody} softbody 
     * @param {String} name 
     */
    addSoftbodyObject(softbody, name) {

        this.softbody_dict[name] = softbody;
    }

    addSoildObject() {

    }

    /**
     * @param {Ground} ground 
     * @param {String} name 
     */
    addGround(ground, name) {

        this.ground_dict[name] = ground;
    }

    draw() {

        // draw softbodies
        for (let idx in this.softbody_dict) {
            this.softbody_dict[idx].draw();
        }

        //draw grounds
        for (let idx in this.ground_dict) {
            this.ground_dict[idx].draw();
        }
    }

    update() {

        // add gravity
        for (let idx in this.softbody_dict) {

            for (let i = 0; i < this.softbody_dict[idx].node_array.length; i++) {
                this.softbody_dict[idx].node_array[i].addForce(new p5.Vector(0, gravity_acc));
            }
        }

        // let every spring in softbody to work
        for (let idx in this.softbody_dict) {
            this.softbody_dict[idx].springUpdate();
        }

        // pevent self collision
        for (let idx in this.softbody_dict) {
            this.softbody_dict[idx].antiSelfCollapse();
        }


        // collision detect
        // for each softbody
        for (let idx in this.softbody_dict) {

            // each node in softbody
            for (let i = 0; i < this.softbody_dict[idx].node_array.length; i++) {

                // each polyground
                for (let idx_ in this.ground_dict) {

                    let next_position =
                        p5.Vector.add(this.softbody_dict[idx].node_array[i].position, this.softbody_dict[idx].node_array[i].velocity);

                    let collid_rlt_tmp = nodePolyGroundCollisionDetect(next_position, this.ground_dict[idx_]);

                    // if it does collid , give the reaction force to the node
                    if (collid_rlt_tmp != false) {

                        let normal_vec = p5.Vector.sub(collid_rlt_tmp, this.softbody_dict[idx].node_array[i].position);

                        let curr_force_vec = this.softbody_dict[idx].node_array[i].curr_force.copy();

                        let curr_velocity_vec = this.softbody_dict[idx].node_array[i].velocity.copy();

                        let diff_force_vec =
                            p5.Vector.mult(normal_vec, curr_force_vec.dot(normal_vec) / Math.pow(normal_vec.mag(), 2));
                        //console.log(diff_force_vec);

                        let diff_velocity_vec =
                            p5.Vector.mult(normal_vec, curr_velocity_vec.dot(normal_vec) / Math.pow(normal_vec.mag(), 2));


                        // 
                        this.softbody_dict[idx].node_array[i].velocity = new p5.Vector(0, 0);
                        //p5.Vector.add(curr_velocity_vec, p5.Vector.mult(diff_velocity_vec, -2));

                        // push out the node align the normal vector
                        this.softbody_dict[idx].node_array[i].position =
                            p5.Vector.add(this.softbody_dict[idx].node_array[i].position, normal_vec);

                        this.softbody_dict[idx].node_array[i].addForce(p5.Vector.mult(diff_force_vec, -1));

                        //norm force

                        this.softbody_dict[idx].node_array[i].addForce(new p5.Vector(0, gravity_acc * -1));

                    }
                }
            }
        }

        // let every node in softbody to move
        for (let idx in this.softbody_dict) {
            this.softbody_dict[idx].nodeUpdate();
        }


    }
}