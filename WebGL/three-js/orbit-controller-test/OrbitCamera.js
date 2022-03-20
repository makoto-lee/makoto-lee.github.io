export class OrbitCamera {
    #canvas = null;
    #dragging = false;
    #x;
    #y;
    #dx;
    #dy;
    #vx = 0;
    #vy = 0;
    #theta = 0;
    #phi = 0;
    #toRadian = Math.PI / 180;
    #friction_coef = 0.99;

    constructor(camera, lookat, radius, canvas, dragable = true, auto_move = true) {
        this.camera = camera;
        this.lookat = lookat;
        this.radius = radius;
        this.dragable = dragable;
        // ==
        this.auto_move = auto_move;
        this.speed = 0.2;
        this.view_point_max = 80;
        this.view_point_min = -80;

        if (dragable) {
            this.#canvas = canvas;

            this.#canvas.addEventListener("mousedown",
                (event) => {
                    this.#x = event.offsetX;
                    this.#y = event.offsetY;
                    this.#dragging = true;
                });

            this.#canvas, addEventListener("mousemove",
                (event) => {
                    if (this.#dragging) {

                        this.#dx = event.offsetX - this.#x;
                        this.#dy = event.offsetY - this.#y;
                        this.#x = event.offsetX;
                        this.#y = event.offsetY;

                        this.#vx = this.#dx;
                        this.#vy = this.#dy;

                        console.log("offsetX: " + event.offsetX + " offsetY: " + event.offsetX);
                    }
                });

            this.#canvas, addEventListener("mouseup",
                (event) => {
                    //this.#dx = 0;
                    //this.#dy = 0;
                    this.#dragging = false;
                    //console.log("dx: " + this.#dx + " dy: " + this.#dy);
                });
        }
    }

    update() {
        //console.log("dx: " + this.#dx + " dy: " + this.#dy);

        // momentum
        this.#theta += this.#vy * this.speed;
        this.#phi -= this.#vx * this.speed;

        // handle max-minimum view point
        this.#theta = Math.max(this.#theta, this.view_point_min);
        this.#theta = Math.min(this.#theta, this.view_point_max);

        if (this.dragable) {
            this.#vx *= this.#friction_coef;
            this.#vy *= this.#friction_coef;
        }

        if (!this.#dragging & this.auto_move) {
            this.#phi += 0.5;
        }

        // change camera position
        this.camera.position.x = this.radius * Math.sin((this.#theta * -1 + 90) * this.#toRadian) * Math.sin(this.#phi * this.#toRadian);
        this.camera.position.y = this.radius * Math.cos((this.#theta * -1 + 90) * this.#toRadian);
        this.camera.position.z = this.radius * Math.sin((this.#theta * -1 + 90) * this.#toRadian) * Math.cos(this.#phi * this.#toRadian);

        // refresh camera lookat
        this.camera.lookAt(this.lookat);
    }
}