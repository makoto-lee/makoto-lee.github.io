
class NodeData {

    /**
     * @param {String} name 
     */
    constructor(name) {

        this.position = new p5.Vector(
            Math.random() * 10 + canvas_height / 2,
            Math.random() * 10 + canvas_width / 2
        )

        this.velocity = new p5.Vector(0, 0);

        this.acceleration = new p5.Vector(0, 0);

        this.curr_force = new p5.Vector(0, 0);

        this.name = name;
    }

    /**
     * @param {p5.Vector} force 
     */
    addForce(force) {

        //console.log("add Force");
        //console.log(this.force);

        this.curr_force = p5.Vector.add(this.curr_force, force);

    }

    update() {
        // F = M * A
        // M = 1
        this.acceleration = this.curr_force;

        this.curr_force = new p5.Vector(0, 0);

        this.velocity = this.velocity.add(this.acceleration);
        this.position = this.position.add(this.velocity);

        // friction
        this.velocity = this.velocity.mult(0.95);
    }
}

class Spring {

    /**
     * @param {number} k 
     * @param {number} fix_length 
     * @param {NodeData} node1 
     * @param {NodeData} node2 
     */
    constructor(k, fix_length, node1, node2) {
        this.k = k;
        this.fix_length = fix_length;
        this.node1 = node1;
        this.node2 = node2;
    }

    update() {
        //console.log("spring update");

        let diff_vec = p5.Vector.sub(this.node1.position, this.node2.position);

        let diff_len = diff_vec.mag();

        let diff_nor = p5.Vector.normalize(diff_vec);

        let force = p5.Vector.mult(diff_nor, (diff_len - this.fix_length) * this.k);

        this.node2.addForce(force);

        this.node1.addForce(p5.Vector.mult(force, -1));
    }
}

class Graph {

    constructor() {
        this.connect_list = [];
        this.num_node = 0;
        this.node_datas = [];
        this.spring_list = [];
        this.name_map = {};
    }

    /**
     * @param {String} node_name1 
     * @param {String} node_name2 
     */
    addEdge(node_name1, node_name2) {

        // if a duplicate edge
        // if a self loop



        if (this.name_map[node_name1] == undefined) {

            this.name_map[node_name1] = this.num_node;

            this.num_node++;

            this.node_datas[this.name_map[node_name1]] = new NodeData(node_name1);

            this.connect_list[this.name_map[node_name1]] = [];
        }

        if (this.name_map[node_name2] == undefined) {

            this.name_map[node_name2] = this.num_node;

            this.num_node++;

            this.node_datas[this.name_map[node_name2]] = new NodeData(node_name2);

            this.connect_list[this.name_map[node_name2]] = [];
        }

        let node_name1_idx = this.name_map[node_name1];

        let node_name2_idx = this.name_map[node_name2];

        //

        this.connect_list[node_name1_idx].push(node_name2_idx);

        this.connect_list[node_name2_idx].push(node_name1_idx);

        this.spring_list.push(
            new Spring(0.005, 50, this.node_datas[node_name1_idx], this.node_datas[node_name2_idx])
        );
    }

    degreeMatrix() {

        let rt = math.zeros(this.num_node, this.num_node);

        for (let i = 0; i < this.num_node; i++) {
            rt._data[i][i] = this.connect_list[i].length;
        }

        return rt;
    }

    adjacencyMatrix() {

        let rt = math.zeros(this.num_node, this.num_node);

        for (let i = 0; i < this.num_node; i++) {
            for (let j = 0; j < this.connect_list[i].length; j++) {
                rt._data[i][this.connect_list[i][j]] = 1;
            }
        }

        return rt;
    }

    laplacianMatrix() {

        let A = math.multiply(-1, this.adjacencyMatrix());

        return math.add(this.degreeMatrix(), A);
    }

    fiedlerVector() {

        let rlt = [];

        let eig = math.eigs(this.laplacianMatrix());

        for (let idx in eig.vectors._data) {

            rlt.push(eig.vectors._data[idx][1]);

        }
        return rlt;
    }
}

// =========================================================

/**
 * @param {Graph} graph 
 */
function drawGraph(graph) {

    if (graph.node_datas.length == 0)
        return;

    // draw lines
    for (let idx in graph.spring_list) {

        line(
            graph.spring_list[idx].node1.position.x, graph.spring_list[idx].node1.position.y,
            graph.spring_list[idx].node2.position.x, graph.spring_list[idx].node2.position.y
        );

    }

    // draw nodes
    for (let idx in graph.node_datas) {

        let X = graph.node_datas[idx].position.x;

        let Y = graph.node_datas[idx].position.y;

        circle(X, Y, 20);

        text(graph.node_datas[idx].name, X - (4 * graph.node_datas[idx].name.length), Y + 5);

    }
}


// =========================================================

/**
 * @param {Graph} graph 
 */
function checkConnectivity(graph) {

    // empty graph
    if (graph.node_datas.length == 0)
        return true;


    let checked = new Array(graph.num_node).fill(false);

    function DFS(travel_node) {

        checked[travel_node] = true;

        for (let i = 0; i < graph.connect_list[travel_node].length; i++) {
            if (checked[graph.connect_list[travel_node][i]] == false) {
                DFS(graph.connect_list[travel_node][i]);
            }
        }

    }
    DFS(0);

    //console.log(checked);

    for (let i = 0; i < checked.length; i++) {
        if (checked[i] == false)
            return false;
    }

    return true;
}