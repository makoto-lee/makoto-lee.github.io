var main_scene = new Scene("main scene");
var draw_data = [];
var draw_flag = false;
var ground_idx = 0;
var running = false;

var draw_prevX, draw_prevY, draw_currX, draw_currY;

function canvas_clear() {
    background(127);
}

function makePolyGround(position_list) {
    if (position_list.length >= 3) {

        let the_new_ground = new PolyGround();


        let curr_node = new p5.Vector(position_list[0][0], position_list[0][1])

        the_new_ground.addEndPoint(curr_node.x, curr_node.y);

        for (let i = 1; i < position_list.length; i++) {

            let dist = p5.Vector.sub(curr_node, new p5.Vector(position_list[i][0], position_list[i][1])).mag();

            if (dist >= draw_poly_detail) {
                the_new_ground.addEndPoint(position_list[i][0], position_list[i][1]);
                curr_node.x = position_list[i][0];
                curr_node.y = position_list[i][1];
            }
        }

        if (the_new_ground.end_point_array.length <= 1)
            return;

        main_scene.addGround(the_new_ground, "draw_gd_" + ground_idx++);
    }
}

function setup() {
    console.log("setup!");

    var canvas = createCanvas(canvas_height, canvas_width);
    canvas.parent('canvas_div');
    canvas.id("main_canvas");

    var main_canvas = document.getElementById("main_canvas");
    var ctx = main_canvas.getContext("2d");

    // ================
    main_canvas.addEventListener("mousemove",
        (e) => {

            if (draw_flag) {
                draw_prevX = draw_currX;
                draw_prevY = draw_currY;
                draw_currX = e.clientX - main_canvas.offsetLeft;
                draw_currY = e.clientY - main_canvas.offsetTop;

                console.log(draw_currX, draw_currY);

                draw_data.push([draw_currX, draw_currY]);

                ctx.beginPath();
                ctx.moveTo(draw_prevX, draw_prevY);
                ctx.lineTo(draw_currX, draw_currY);
                //ctx.strokeStyle = x;
                //ctx.lineWidth = y;
                ctx.stroke();
                ctx.closePath();
            }


        });

    // ================
    main_canvas.addEventListener("mousedown",
        (e) => {
            running = false;

            draw_flag = true;

            draw_currX = e.clientX - main_canvas.offsetLeft;
            draw_currY = e.clientY - main_canvas.offsetTop;
        });

    // ================
    main_canvas.addEventListener("mouseup",
        (e) => {

            if (draw_flag) {
                console.log(draw_data);
                makePolyGround(draw_data);
                canvas_clear();
                main_scene.draw();
            }

            draw_flag = false;

            draw_data = [];
        });

    // ================
    main_canvas.addEventListener("mouseout",
        (e) => {

            if (draw_flag) {
                console.log(draw_data);
                makePolyGround(draw_data);
                canvas_clear();
                main_scene.draw();
            }

            draw_flag = false;

            draw_data = [];
        });

    canvas_clear();

}


function draw() {

    if (running == true) {

        canvas_clear();
        main_scene.draw();
    }
}


function start() {

    let soft_square = new RectangleSoftbody(3, 3, 15, 15);

    soft_square.setPosition(canvas_height / 2, 20);

    main_scene.addSoftbodyObject(soft_square, "main_square");

    running = true;

    //
    //let ground_1 = new PolyGround();

    //ground_1.addEndPoint(50, 300);
    //ground_1.addEndPoint(50, 350);
    //ground_1.addEndPoint(550, 350);
    //ground_1.addEndPoint(550, 300);

    //main_scene.addGround(ground_1, "g1");

    //let triangle_1 = new PolyGround();

    //triangle_1.addEndPoint(0, 0);
    //triangle_1.addEndPoint(50, 50);
    //triangle_1.addEndPoint(0, 50);
    //triangle_1.setPosition(280, 150);

    //main_scene.addGround(triangle_1, "t1");

    //let triangle_2 = new PolyGround();

    //triangle_2.addEndPoint(50, 0);
    //triangle_2.addEndPoint(50, 50);
    //triangle_2.addEndPoint(0, 50);
    //triangle_2.setPosition(420, 180);

    //main_scene.addGround(triangle_2, "t2");

}

function stop() {

    running = false;
}

function clear_scene() {

    main_scene.ground_dict = {};
    canvas_clear();
    main_scene.draw();
}

setInterval(() => {

    if (running == true) {

        main_scene.update();
    }

}, 17);