function initializeWebGL(canvas_name) {
    const glCanvas = document.getElementById(canvas_name);
    const gl =
        glCanvas.getContext("webgl") ||
        glCanvas.getContext("experimantal-webgl") ||
        glCanvas.getContext("mozkit-3d") ||
        glCanvas.getContext("webkit-3d");

    if (!gl) {
        console.log("%c" + "⛔failed to get gl", "color:red")
        return null;
    }

    gl.viewportWidth = glCanvas.clientWidth;
    gl.viewportHeight = glCanvas.clientHeight;

    gl.clearColor(0.3, 0.3, 0.3, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    console.log("✅initialize WebGl successfully");
    return gl;
}

function initializeShader(gl, vs_source, fs_source) {

    // new shaders
    var vert_shader = gl.createShader(gl.VERTEX_SHADER);
    var frag_shader = gl.createShader(gl.FRAGMENT_SHADER);

    gl.shaderSource(vert_shader, vs_source);
    gl.shaderSource(frag_shader, fs_source);

    // compile shaders
    gl.compileShader(vert_shader);
    gl.compileShader(frag_shader);

    var error = false;

    if (!gl.getShaderParameter(vert_shader, gl.COMPILE_STATUS)) {
        console.log("%c" + "⛔failed to compile vertex shader : " + gl.getShaderInfoLog(vert_shader), "color:red");
        error = true;
    }

    if (!gl.getShaderParameter(frag_shader, gl.COMPILE_STATUS)) {
        console.log("%c" + "⛔failed to compile fragment shader : " + gl.getShaderInfoLog(frag_shader), "color:red");
        error = true;
    }

    // create programe consisting these shaders
    var program = gl.createProgram();

    // attach shaders to the program
    gl.attachShader(program, vert_shader);
    gl.attachShader(program, frag_shader);

    // link program
    if (gl.linkProgram(program) == 0) {
        console.log("%c" + "⛔failed to link program with error code 0", "color:red");
        error = true;
    }

    if (error) {
        console.log("%c" + "⛔failed to link program with error code 0 : ", "color:red");
        return null;
    }
    else {
        console.log("✅initialize shader successfully");
        return program;
    }
}

function drawPolygon(gl, vertices, program, scale) {
    // create new buffer
    let vert_buffer = gl.createBuffer();

    // bind buffer to gl
    gl.bindBuffer(gl.ARRAY_BUFFER, vert_buffer);

    // pass the list of positions into the buffer
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);

    // use this program to render
    gl.useProgram(program);

    // === get the location of aVertex3DPosition in shader
    const aVertex3DPosition_location = gl.getAttribLocation(program, "aVertex3DPosition");

    // 
    const numComponents = 3;  // pull out 3 values per iteration
    const type = gl.FLOAT;    // the data in the buffer is 32bit floats
    const normalize = false;  // don't normalize
    const stride = 0;         // how many bytes to get from one set of values to the next; 0 = use type and numComponents above
    const offset = 0;         // how many bytes inside the buffer to start from
    gl.vertexAttribPointer(
        aVertex3DPosition_location,
        numComponents,
        type,
        normalize,
        stride,
        offset);
    gl.enableVertexAttribArray(aVertex3DPosition_location);

    // === get the location of uScale in shader
    const uScale_location = gl.getUniformLocation(program, "uScale");
    // set the value of uScale
    gl.uniform3f(uScale_location, scale / gl.viewportWidth, scale / gl.viewportHeight, 1);
    //gl.uniform3f(uScale_location, 0.5, 0.5, 1);

    // draw array
    // parameter : (drawing_mode), (offset from the start of array), (num of vertex)
    gl.drawArrays(gl.TRIANGLE_FAN, 0, Math.floor(vertices.length / 3));

    // delete the buffer
    gl.deleteBuffer(vert_buffer);
}

function v(x, y, z) {
    var v = vec3.create();
    vec3.set(v, x, y, z);
    return v;
}

class polygonDrawer {
    constructor(gl, program, scale) {
        this.gl = gl;
        this.program = program;

        // use this program to render
        this.gl.useProgram(this.program);

        // === get the location of uScale in shader
        const uScale_location = gl.getUniformLocation(program, "uScale");

        // set the value of uScale
        gl.uniform3f(uScale_location, scale / gl.viewportWidth, scale / gl.viewportHeight, 1);

        console.log("🆗new polygonDrawer");
    }

    draw(vertices) {
        // create new buffer
        let vert_buffer = this.gl.createBuffer();

        // bind buffer to gl
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vert_buffer);

        // pass the list of positions into the buffer
        this.gl.bufferData(this.gl.ARRAY_BUFFER, new Float32Array(vertices), this.gl.STATIC_DRAW);

        // === get the location of aVertex3DPosition in shader
        const aVertex3DPosition_location = this.gl.getAttribLocation(this.program, "aVertex3DPosition");

        // 
        const numComponents = 3;  // pull out 3 values per iteration
        const type = this.gl.FLOAT;    // the data in the buffer is 32bit floats
        const normalize = false;  // don't normalize
        const stride = 0;         // how many bytes to get from one set of values to the next; 0 = use type and numComponents above
        const offset = 0;         // how many bytes inside the buffer to start from
        this.gl.vertexAttribPointer(
            aVertex3DPosition_location,
            numComponents,
            type,
            normalize,
            stride,
            offset);
        this.gl.enableVertexAttribArray(aVertex3DPosition_location);

        // draw array
        // parameter : (drawing_mode), (offset from the start of array), (num of vertex)
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, Math.floor(vertices.length / 3));

        // delete the buffer
        this.gl.deleteBuffer(vert_buffer);
    }
}

class rotatePolygonDrawer {
    constructor(gl, program, vertices, color, scale, rotate) {
        this.gl = gl;
        this.program = program;
        this.vertex_num = Math.floor(vertices.length / 3);
        this.rotate = rotate;
        this.theta = 1;

        // use this program to render
        this.gl.useProgram(this.program);

        // ===== set up perspective mtx

        // === define perspective        
        var perspective_matrix = mat4.create();
        mat4.perspective(perspective_matrix, 1, gl.viewportWidth / gl.viewportHeight, 40, 1);
        // get the location of uPerspectiveMatrix in shader
        const uPerspectiveMatrix_location = gl.getUniformLocation(program, "uPerspectiveMatrix");
        // set the value of uPerspectiveMatrix
        gl.uniformMatrix4fv(uPerspectiveMatrix_location, false, perspective_matrix);

        // ===== set up camera mtx

        // === define camera
        var camera = mat4.create();
        // parameters : (output mtx), (eye, Position of the viewer), (Point the viewer is looking at), (pointing up)
        mat4.lookAt(camera, v(0, 0, 10), v(0, 0, 0), v(0, 1, 0));
        // get the location of uCamera in shader
        const uCamera_location = gl.getUniformLocation(program, "uCamera");
        // set the value of uCamera
        gl.uniformMatrix4fv(uCamera_location, false, camera);


        // ===== set up vertex dots

        // create new buffer
        let vert_buffer = gl.createBuffer();
        // bind buffer to gl
        gl.bindBuffer(gl.ARRAY_BUFFER, vert_buffer);
        // pass the list of positions into the buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
        // === get the location of aVertex3DPosition in shader
        const aVertex3DPosition_location = gl.getAttribLocation(program, "aVertex3DPosition");
        //      
        gl.vertexAttribPointer(
            aVertex3DPosition_location,
            3,          // pull out 3 values per iteration
            gl.FLOAT,   // the data in the buffer is 32bit floats
            false,      // don't normalize
            0,          // how many bytes to get from one set of values to the next; 0 = use type and numComponents above
            0           // how many bytes inside the buffer to start from
        );
        gl.enableVertexAttribArray(aVertex3DPosition_location);

        // ===== set up color buffer

        // create new buffer
        let color_buffer = gl.createBuffer();
        // bind buffer to gl
        gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
        // pass the list of positions into the buffer
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(color), gl.STATIC_DRAW);
        // === get the location of aVertexColor in shader
        const aVertexColor_location = gl.getAttribLocation(program, "aVertexColor");
        //
        gl.vertexAttribPointer(
            aVertexColor_location,
            4,          // pull out 3 values per iteration
            gl.FLOAT,   // the data in the buffer is 32bit floats
            false,      // don't normalize
            0,          // how many bytes to get from one set of values to the next; 0 = use type and numComponents above
            0           // how many bytes inside the buffer to start from
        );
        gl.enableVertexAttribArray(aVertexColor_location);

        // =====

        console.log("🆗new rotatePolygonDrawer");
    }

    draw() {

        // === define rotate mtx
        var rotate_matrix = mat4.create();
        mat4.rotateX(rotate_matrix, rotate_matrix, this.rotate[0] * this.theta);
        mat4.rotateY(rotate_matrix, rotate_matrix, this.rotate[1] * this.theta);
        mat4.rotateZ(rotate_matrix, rotate_matrix, this.rotate[2] * this.theta);
        // get the location of uRotateMatrix in shader
        const uRotateMatrix_location = this.gl.getUniformLocation(this.program, "uRotateMatrix");
        // set the value of uRotateMatrix
        this.gl.uniformMatrix4fv(uRotateMatrix_location, false, rotate_matrix);
        // update theta
        this.theta += 1;

        // draw array
        // parameter : (drawing_mode), (offset from the start of array), (num of vertex)
        this.gl.drawArrays(this.gl.TRIANGLE_FAN, 0, this.vertex_num);
        //this.gl.drawElements(this.gl.TRIANGLE_STRIP, Math.floor(vertices.length / 3), type, 0);

        // delete the buffer
        //this.gl.deleteBuffer(vert_buffer);
    }
}