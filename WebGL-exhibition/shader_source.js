// Vertex shader program

const vs_static_source = `
attribute vec3 aVertex3DPosition;

uniform vec3 uScale;

void main() {
  gl_Position = vec4(aVertex3DPosition * uScale, 1.0);
}
`;

const vs_rotate_source = `
attribute vec3 aVertex3DPosition;
attribute vec4 aVertexColor;

varying lowp vec4 vColor;

uniform mat4 uPerspectiveMatrix;
uniform mat4 uCamera;
uniform mat4 uRotateMatrix;

void main() {
  gl_Position = uPerspectiveMatrix * uCamera * uRotateMatrix * vec4(aVertex3DPosition, 1.0);
  vColor = aVertexColor;
}
`;

// Fragment shader program

const fs_white_source = `
void main() {
  gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
}
`;

const fs_colorful_source = `
varying lowp vec4 vColor;

void main(void) {
  gl_FragColor = vColor;
}
  `;