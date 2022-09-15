class Node {

    /**
     * @param {String} name 
     */
    constructor(x, y) {

        this.position = new p5.Vector(x, y);

        this.velocity = new p5.Vector(0, 0);

        this.acceleration = new p5.Vector(0, 0);

        this.curr_force = new p5.Vector(0, 0);
    }

    /**
     * @param {p5.Vector} force 
     */
    addForce(force) {

        this.curr_force = p5.Vector.add(this.curr_force, force);
    }

    update() {
        // F = M * A
        // M = 1
        this.acceleration = this.curr_force;

        this.curr_force = new p5.Vector(0, 0);

        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);

        // air resistance
        this.velocity = this.velocity.mult(0.995);
    }
}