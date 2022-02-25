function imageDataTo3DArray(pixels, width, height) {
    let rt = Array(height).fill().map(
        () => Array(width).fill().map(
            () => new Uint8Array(4)));
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            const index = 4 * (i * width + j);
            rt[i][j][0] = pixels[index];
            rt[i][j][1] = pixels[index + 1];
            rt[i][j][2] = pixels[index + 2];
            rt[i][j][3] = pixels[index + 3];
        }
    }
    return rt;
}

function toGrayScale2DArray(img_data, width, height) {
    let rt = Array(height).fill().map(
        () => new Uint8Array(width).fill());
    for (let i = 0; i < height; i++) {
        for (let j = 0; j < width; j++) {
            rt[i][j] = img_data[i][j][0] * 0.299 + img_data[i][j][1] * 0.587 + img_data[i][j][2] * 0.114;
        }
    }
    return rt;
}
// 1 4 2 5 3 6 7 8
function genUnicodeTable(start, length) {
    return String.fromCharCode(
        ...Array(length).fill().map((_, i) => start + i)
    );
}

function filter2D(arr, x, y, len_x, len_y) {
    let tmp = 0;
    for (let i = 0; i < len_x; i++) {
        for (let j = 0; j < len_y; j++) {
            tmp += arr[x + i][y + j];
        }
    }
    return tmp / (len_x * len_y);
}

function extract2DArray(arr, x, y, len_x, len_y) {
    let rt = Array(len_x).fill().map(
        () => new Uint8Array(len_y).fill());
    for (let i = 0; i < len_x; i++) {
        for (let j = 0; j < len_y; j++) {
            rt[i][j] = arr[x + i][y + j];
        }
    }
    return rt;
}

const Braille_dots_val = [1, 4, 16, 2, 8, 32, 64, 128];
var reverse = 0;

function getBrailleChar(block, height, width) {
    // 暫定uint 16 如果 width 太大可能會 overflow
    let dots = new Uint16Array([0, 0, 0, 0, 0, 0, 0, 0]);
    let edge_len = width / 2;

    for (let i = 0; i < edge_len; i++) {
        for (let j = 0; j < edge_len; j++) {
            dots[0] += block[0 + i][0 + j];
        }
    }
    for (let i = 0; i < edge_len; i++) {
        for (let j = 0; j < edge_len; j++) {
            dots[1] += block[0 + i][edge_len + j];
        }
    }
    // ======================
    for (let i = 0; i < edge_len; i++) {
        for (let j = 0; j < edge_len; j++) {
            dots[2] += block[edge_len + i][0 + j];
        }
    }
    for (let i = 0; i < edge_len; i++) {
        for (let j = 0; j < edge_len; j++) {
            dots[3] += block[edge_len + i][edge_len + j];
        }
    }
    // ======================
    for (let i = 0; i < edge_len; i++) {
        for (let j = 0; j < edge_len; j++) {
            dots[4] += block[edge_len * 2 + i][0 + j];
        }
    }
    for (let i = 0; i < edge_len; i++) {
        for (let j = 0; j < edge_len; j++) {
            dots[5] += block[edge_len * 2 + i][edge_len + j];
        }
    }
    // ======================
    for (let i = 0; i < edge_len; i++) {
        for (let j = 0; j < edge_len; j++) {
            dots[6] += block[edge_len * 3 + i][0 + j];
        }
    }
    for (let i = 0; i < edge_len; i++) {
        for (let j = 0; j < edge_len; j++) {
            dots[7] += block[edge_len * 3 + i][edge_len + j];
        }
    }

    // ======= mean ========
    for (let i = 0; i < 8; i++) {
        dots[i] /= (edge_len * edge_len);
    }

    console.log(reverse);

    for (let i = 0; i < 8; i++) {
        if (dots[i] <= black_white_bound)
            dots[i] = reverse;
        else
            dots[i] = 1 - reverse;
    }

    let idx_diff = 0;
    for (let i = 0; i < 8; i++) {
        if (dots[i]) {
            idx_diff += Braille_dots_val[i];
        }
    }
    if (idx_diff != 0)
        return String.fromCharCode(0x2800 + idx_diff);
    return String.fromCharCode(0x2801);
}

function getBrailleString(img, height, width, dpi) {

    let rt = String("");
    let block_height = dpi * 4;
    let block_width = dpi * 2;

    for (let i = 0; i < height / block_height - 1; i++) {
        for (let j = 0; j < width / block_width - 1; j++) {
            let block = extract2DArray(img, i * block_height, j * block_width, block_height, block_width);
            rt += getBrailleChar(block, block_height, block_width);
        }
        rt += '\n';
    }
    return rt;
}