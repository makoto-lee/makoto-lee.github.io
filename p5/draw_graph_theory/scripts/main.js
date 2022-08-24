
var main_graph = new Graph();

var graph_avalible = false;

var main_fiedler_vector = [];

var fiedler_support = true;

/*
main_graph.addEdge(0, 2);
main_graph.addEdge(2, 4);
main_graph.addEdge(4, 1);
main_graph.addEdge(1, 3);
main_graph.addEdge(3, 0);

main_graph.addEdge(0, 1);
main_graph.addEdge(1, 2);
main_graph.addEdge(2, 3);
main_graph.addEdge(3, 4);
main_graph.addEdge(4, 0);
*/


/*
wiki example

main_graph.addEdge(5, 3);
main_graph.addEdge(3, 4);
main_graph.addEdge(2, 3);
main_graph.addEdge(2, 1);
main_graph.addEdge(4, 1);
main_graph.addEdge(4, 0);
main_graph.addEdge(1, 0);
*/
/*
5 -> 3
3 -> 4
2 -> 3
2 -> 1
4 -> 1
4 -> 0
1 -> 0
*/


//====

function setup() {
    console.log("setup!");

    var canvas = createCanvas(canvas_height, canvas_width);
    canvas.parent('canvas_div');

    background(127);

}


function draw() {

    background(127);

    drawGraph(main_graph);
}


// =======================================================

const empty_re = /\s*/;

/**
 * @param {String} line 
 */
function isEmptyLine(line) {

    let match_rlt = line.match(empty_re);

    if (match_rlt[0] == line) {
        return true;
    }

    return false;

}

// =======================================================

const re = /[0-9]*\s*(->)\s*[0-9]*/;

/**
 * @param {String} input_text
 * return true when success, return false when fail
 */
function readGraph(input_text) {

    let lines = input_text.split("\n");

    let ok_lines = [];
    // check if syntex error
    for (const idx in lines) {

        if (isEmptyLine(lines[idx]))
            continue;

        let match_rlt = lines[idx].match(re);

        if (match_rlt[0] != match_rlt.input) {

            alert("Invalid input :" + lines[idx]);
            return false;

        }
        ok_lines.push(lines[idx]);
    }

    console.log("ok_lines", ok_lines);

    if (ok_lines.length == 0) {

        alert("Error : nothing input");
        return false;
    }

    // clear main_graph
    main_graph = new Graph();

    // load to main_graph
    for (const idx in ok_lines) {

        let tmp = ok_lines[idx].split("->");

        let node_1 = parseInt(tmp[0]);

        let node_2 = parseInt(tmp[1]);

        console.log(node_1, node_2);

        main_graph.addEdge(node_1, node_2);

    }

    console.log(main_graph.node_datas);

    return true;
}

// =======================================================

function supportSwitch() {

    const fiedler_support_checkbox = document.getElementById("fiedler_support_checkbox");

    fiedler_support = fiedler_support_checkbox.checked;
}

// =======================================================

function example() {

    const text_area = document.getElementById("enter_text");

    text_area.value =
        `5 -> 3
3 -> 4
2 -> 3
2 -> 1
4 -> 1
4 -> 0
1 -> 0`;

    return;
}

// =======================================================

function start() {

    graph_avalible = false;

    //console.log(main_graph.node_datas);

    // read input text
    const text_area = document.getElementById("enter_text");
    console.log(text_area.value);

    if (readGraph(text_area.value)) {

        console.log(main_graph.node_datas);

        checkConnectivity(main_graph);

        let d = main_graph.laplacianMatrix();
        console.log("laplacianMatrix", d);

        main_fiedler_vector = main_graph.fiedlerVector()

        console.log("fiedlerVector", main_fiedler_vector);

        graph_avalible = true;
    }

}

setInterval(() => {

    if (graph_avalible) {

        // add repulsive force
        if (fiedler_support) {

            let n = main_graph.num_node;
            for (let i = 0; i < n - 1; i++) {
                for (let j = i + 1; j < n; j++) {

                    let diff_vec = p5.Vector.sub(main_graph.node_datas[i].position, main_graph.node_datas[j].position);

                    let diff_nor = p5.Vector.normalize(diff_vec);

                    let algebra_distance = Math.abs(main_fiedler_vector[i] - main_fiedler_vector[j]);

                    let force = p5.Vector.mult(diff_nor, algebra_distance * 0.03);

                    main_graph.node_datas[i].addForce(force);

                    main_graph.node_datas[j].addForce(p5.Vector.mult(force, -1));
                }
            }
        }

        // add spring force
        for (let idx in main_graph.spring_list) {
            main_graph.spring_list[idx].update();
        }

        // update nodes
        for (let idx in main_graph.node_datas) {
            main_graph.node_datas[idx].update();
        }

    }


    //console.log(main_graph.node_datas[0].position);

}, 17);