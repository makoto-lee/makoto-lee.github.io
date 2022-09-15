class Softbody {

    constructor() {

        this.node_array = [];
        this.spring_array = [];
    }

    /**
     * @param {number} x 
     * @param {number} y 
     */
    setPosition(x, y) {

        if (this.node_array.length == 0)
            return;

        let diff_vec = p5.Vector.sub(new p5.Vector(x, y), this.node_array[0].position);

        for (let idx in this.node_array) {

            this.node_array[idx].position = p5.Vector.add(this.node_array[idx].position, diff_vec);
        }
    }

    draw() {

        // draw lines
        for (let idx in this.spring_array) {

            line(
                this.spring_array[idx].node1.position.x, this.spring_array[idx].node1.position.y,
                this.spring_array[idx].node2.position.x, this.spring_array[idx].node2.position.y
            );
        }

        // draw nodes
        for (let idx in this.node_array) {

            let X = this.node_array[idx].position.x;

            let Y = this.node_array[idx].position.y;

            circle(X, Y, 5);
        }
    }

    springUpdate() {

        for (let idx in this.spring_array) {
            this.spring_array[idx].update();
        }
    }

    nodeUpdate() {

        for (let idx in this.node_array) {
            this.node_array[idx].update();
        }
    }

    antiSelfCollapse() {

        for (let idx in this.spring_array) {

            // if the distance betwween 2 nodes less than spring length / 2
            let node1_tmp = this.spring_array[idx].node1;
            let node2_tmp = this.spring_array[idx].node2;
            let diff_vector = p5.Vector.sub(node1_tmp.position, node2_tmp.position)
            let curr_distance = diff_vector.mag();

            if (curr_distance < this.spring_array[idx].fix_length / 2) {

                let diff_distance = this.spring_array[idx].fix_length / 2 - curr_distance;
                let shift_vector = p5.Vector.mult(p5.Vector.normalize(diff_vector), diff_distance / 2);

                this.spring_array[idx].node1.position = p5.Vector.add(node1_tmp.position, shift_vector);

                this.spring_array[idx].node2.position = p5.Vector.add(node2_tmp.position, p5.Vector.mult(shift_vector, -1));
            }
        }
    }
}

class RectangleSoftbody extends Softbody {

    /**
     * @param {number} width number of nodes on its width edge
     * @param {number} height number of nodes on its height edge
     * @param {number} w_interval interval between its nodes in x axis
     * @param {number} h_interval interval between its nodes in y axis
     */
    constructor(width, height, w_interval, h_interval) {

        super();

        this.width = width;
        this.height = height;
        this.w_interval = w_interval;
        this.h_interval = h_interval;

        let x_tmp = 0;
        let y_tmp = 0;

        // append nodes
        for (let i = 0; i < height; i++) {

            for (let j = 0; j < width; j++) {

                this.node_array.push(new Node(x_tmp, y_tmp));
                x_tmp += w_interval;
            }
            x_tmp = 0;

            y_tmp += h_interval;
        }

        this.node2darr = (a, b) => {
            return this.node_array[a + b * this.width];
        }

        let k = 0.15;

        // append springs
        for (let i = 0; i < height; i++) {

            for (let j = 1; j < width; j++) {
                this.spring_array.push(new Spring(k, this.w_interval, this.node2darr(j, i), this.node2darr(j - 1, i)));
            }
        }

        for (let i = 0; i < width; i++) {

            for (let j = 1; j < height; j++) {
                this.spring_array.push(new Spring(k, this.h_interval, this.node2darr(i, j), this.node2darr(i, j - 1)));
            }
        }

        let diagonal_len = Math.sqrt(this.h_interval * this.h_interval + this.w_interval * this.w_interval);

        for (let i = 1; i < width; i++) {

            for (let j = 1; j < height; j++) {
                this.spring_array.push(new Spring(k, diagonal_len, this.node2darr(i - 1, j - 1), this.node2darr(i, j)));
                this.spring_array.push(new Spring(k, diagonal_len, this.node2darr(i - 1, j), this.node2darr(i, j - 1)));
            }
        }


    }
}