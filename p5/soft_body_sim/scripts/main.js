var main_scene = new Scene("main scene");

function setup() {
    console.log("setup!");

    var canvas = createCanvas(canvas_height, canvas_width);
    canvas.parent('canvas_div');

    background(127);

}




function draw() {

    background(127);

    main_scene.draw();

}

function start() {

    let soft_square = new RectangleSoftbody(3, 8, 15, 15);

    soft_square.setPosition(canvas_height / 2, 20);

    main_scene.addSoftbodyObject(soft_square, "main_square");

    //
    let ground_1 = new PolyGround();

    ground_1.addEndPoint(50, 300);
    ground_1.addEndPoint(50, 350);
    ground_1.addEndPoint(550, 350);
    ground_1.addEndPoint(550, 300);

    main_scene.addGround(ground_1, "g1");

    //
    let triangle_1 = new PolyGround();

    triangle_1.addEndPoint(0, 0);
    triangle_1.addEndPoint(50, 50);
    triangle_1.addEndPoint(0, 50);
    triangle_1.setPosition(280, 150);

    //main_scene.addGround(triangle_1, "t1");

    //
    let triangle_2 = new PolyGround();

    triangle_2.addEndPoint(50, 0);
    triangle_2.addEndPoint(50, 50);
    triangle_2.addEndPoint(0, 50);
    triangle_2.setPosition(420, 180);

    //main_scene.addGround(triangle_2, "t2");

}

setInterval(() => {

    main_scene.update();


    //soft_square.node_array[0].position.y += 0.5;

}, 17);