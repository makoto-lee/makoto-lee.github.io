class PolyGround {

    constructor() {

        /**
         * array of p5.Vector
         */
        this.end_point_array = [];
    }

    addEndPoint(x, y) {

        this.end_point_array.push(new p5.Vector(x, y));
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    setPosition(x, y) {

        if (this.end_point_array.length == 0)
            return;

        let diff_vec = p5.Vector.sub(new p5.Vector(x, y), this.end_point_array[0]);

        for (let idx in this.end_point_array) {

            this.end_point_array[idx] = p5.Vector.add(this.end_point_array[idx], diff_vec);
        }
    }

    draw() {

        if (this.addEndPoint.length == 0)
            return;

        for (let i = 1; i < this.end_point_array.length; i++) {

            // draw lines
            line(
                this.end_point_array[i].x, this.end_point_array[i].y,
                this.end_point_array[i - 1].x, this.end_point_array[i - 1].y
            );
        }
        line(
            this.end_point_array[0].x, this.end_point_array[0].y,
            this.end_point_array[this.end_point_array.length - 1].x, this.end_point_array[this.end_point_array.length - 1].y
        );
    }
}

