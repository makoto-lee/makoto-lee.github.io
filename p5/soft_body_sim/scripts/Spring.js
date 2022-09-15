class Spring {

    /**
     * @param {number} k 
     * @param {number} fix_length 
     * @param {Node} node1 
     * @param {Node} node2 
     */
    constructor(k, fix_length, node1, node2) {
        this.k = k;
        this.fix_length = fix_length;
        this.node1 = node1;
        this.node2 = node2;
    }

    update() {

        let diff_vec = p5.Vector.sub(this.node1.position, this.node2.position);

        let diff_len = diff_vec.mag();

        let diff_nor = p5.Vector.normalize(diff_vec);

        let force = p5.Vector.mult(diff_nor, (diff_len - this.fix_length) * this.k);

        // force decay
        force = p5.Vector.mult(force, 0.9);

        this.node2.addForce(force);

        this.node1.addForce(p5.Vector.mult(force, -1));
    }
}