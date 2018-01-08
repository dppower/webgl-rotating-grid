"use strict"
var fs = require("fs");

let x_vertices = [];
let y_vertices = [];
let z_vertices = [];

var setXVertices = (vertices) => {
    for (let i = 0; i < 21; i++) {
        let j = (i / 10.0) - 1.0;

        vertices.push(j);
        vertices.push(0.0);
        vertices.push(0.0);

        if (j != 0.0) {
            vertices.push(j);
            vertices.push(1.0);
            vertices.push(0.0);

            vertices.push(j);
            vertices.push(-1.0);
            vertices.push(0.0);

            vertices.push(j);
            vertices.push(0.0);
            vertices.push(1.0);

            vertices.push(j);
            vertices.push(0.0);
            vertices.push(-1.0);
        }      
    }
};

var setYVertices = (vertices) => {
    for (let i = 0; i < 21; i++) {
        let j = (i / 10.0) - 1.0;

        vertices.push(0.0);
        vertices.push(j);
        vertices.push(0.0);

        if (j != 0.0) {
            vertices.push(1.0);
            vertices.push(j);
            vertices.push(0.0);

            vertices.push(-1.0);
            vertices.push(j);
            vertices.push(0.0);

            vertices.push(0.0);
            vertices.push(j);
            vertices.push(1.0);

            vertices.push(0.0);
            vertices.push(j);
            vertices.push(-1.0);
        }
    }
};

var setZVertices = (vertices) => {
    for (let i = 0; i < 21; i++) {
        let j = (i / 10.0) - 1.0;

        vertices.push(0.0);
        vertices.push(0.0);
        vertices.push(j);

        if (j != 0.0) {
            vertices.push(1.0);
            vertices.push(0.0);
            vertices.push(j);

            vertices.push(-1.0);
            vertices.push(0.0);
            vertices.push(j);

            vertices.push(0.0);
            vertices.push(1.0);
            vertices.push(j);

            vertices.push(0.0);
            vertices.push(-1.0);
            vertices.push(j);
        }
    }
};

setXVertices(x_vertices);
setYVertices(y_vertices);
setZVertices(z_vertices);

var q = (x_vertices.length / 3 ) - 1;

let x_indices = [];
let y_indices = [];
let z_indices = [];

var setIndices = (indices) => {
    for (let r = 0; r < q - 4; r++) {
        if (r < q / 2) {
            if (r % 5 == 0) {
                indices.push(r);
                indices.push(r + 5);
            } else {
                indices.push(r);
            }
        } else if (r == q / 2) {
            indices.push(r);
            indices.push(r + 1);
        } else if (r > q / 2) {
            if ((r - (1 + q / 2)) % 5 == 0) {
                indices.push(r);
                indices.push(r + 5);
            } else {
                indices.push(r);
            }
        }           
    }
    indices.push(q - 3);
    indices.push(q - 2);
    indices.push(q - 1);
    indices.push(q);
};

setIndices(x_indices);
setIndices(y_indices);
setIndices(z_indices);

var saveMesh = (vertices, indices, fileName) => {
    let axis = {};
    axis.vertices = vertices;
    axis.indices = indices;

    let output = JSON.stringify(axis);

    fs.writeFile(fileName + ".json", output, (err) => {
        if (err) throw err;
        console.log(fileName + " file saved.");
    })
};

saveMesh(x_vertices, x_indices, "x-axis");
saveMesh(y_vertices, y_indices, "y-axis");
saveMesh(z_vertices, z_indices, "z-axis");
