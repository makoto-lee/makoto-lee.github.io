class MeshData {
    constructor(vertices = null, faces = null) {
        this.vertices = vertices;
        this.faces = faces;
    }
}


function previewFile() {
    const preview = document.getElementById('preview');
    const file = document.querySelector('input[type=file]').files[0];

    if (file) {
        const reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            preview.innerText = evt.target.result;
            readOBJ(evt.target.result);
        }
        reader.onerror = function (evt) {
            console.log("⛔Error happend while reading file");
        }
    }
}

class OBJReader {
    constructor() {
        this.file_content = 0;
    }

    /**
     * some regular tags in a .obj file, like 'v', 'f', ....
     * @readonly
     * @enum
     */
    static #obj_tags = {
        /**
         * @readonly
         */
        v: 0,
        /**
         * @readonly
         */
        f: 1,
        /**
         * @readonly
         */
        undefined: -1,
    }

    static #getTag(line) {
        if (line.length) {
            let tmp_idx = 0;
            while (line[tmp_idx] != ' ') { tmp_idx++ }

            let tmp_tag = line.substring(0, tmp_idx);

            for (let i = 0; i < Object.keys(OBJReader.#obj_tags).length; i++) {
                //console.log(Object.keys(OBJReader.#obj_tags));
                if (Object.keys(OBJReader.#obj_tags)[i] == tmp_tag)
                    return OBJReader.#obj_tags[tmp_tag];
            }
            return OBJReader.#obj_tags.undefined;
        }
    }

    static #readOBJ(file_content) {

        let it = OBJReader.lineReader(file_content);

        let num_v = 0;
        let num_f = 0;
        for (let line = it.next(); !line.done; line = it.next()) {
            //console.log(line.value);
            if (OBJReader.#getTag(line.value) == OBJReader.#obj_tags.v) {
                num_v++;
            }
            else if (OBJReader.#getTag(line.value) == OBJReader.#obj_tags.f) {
                num_f++;
            }
        }

        console.log("num_v = ", num_v);
        console.log("num_f = ", num_f);

        let rt = new MeshData();
        rt.vertices = new Float32Array(num_v * 3);
        rt.faces = new Uint16Array(num_f * 3);

        it = OBJReader.lineReader(file_content);
        let line = it.next();
        for (let i = 0; i < num_v; i++, line = it.next()) {
            //console.log(line.value);
            let sep = line.value.split(" ");
            rt.vertices[i * 3] = parseFloat(sep[1]);
            rt.vertices[i * 3 + 1] = parseFloat(sep[2]);
            rt.vertices[i * 3 + 2] = parseFloat(sep[3]);
        }
        for (let i = 0; i < num_f; i++, line = it.next()) {
            //console.log(line.value);
            let sep = line.value.split(" ");
            rt.faces[i * 3] = parseInt(sep[1]) - 1;
            rt.faces[i * 3 + 1] = parseInt(sep[2]) - 1;
            rt.faces[i * 3 + 2] = parseInt(sep[3]) - 1;
        }
        return rt;
    }

    static *lineReader(str) {
        let loc = 0;
        while (loc < str.length) {
            const temp = str.indexOf("\n", loc);
            const len = temp - loc;
            if (loc != temp)
                yield str.substring(loc, loc + len);
            loc = temp + 1;
        }
    }

    static getFileContent(path) {
        let str = null;
        let rawFile = new XMLHttpRequest();
        rawFile.open("GET", path, false);
        rawFile.onreadystatechange = function () {
            if (rawFile.readyState === 4) {
                if (rawFile.status === 200 || rawFile.status == 0) {
                    str = rawFile.responseText;
                }
            }
        };
        rawFile.send(null);
        return str;
    }

    static readLocalFile(path) {

        if (path.substring(path.length - 4) == ".obj") {
            let file_content = OBJReader.getFileContent(path);
            return OBJReader.#readOBJ(file_content);
        }
    }
}


let a = OBJReader.readLocalFile("teapot.obj");
console.log(a)
