import { MeshLoader, Mesh } from "../webgl/mesh-loader";
import { WebGLProgramService } from "../webgl/webgl-program";
import { Transform } from "../maths/transform";

export class BaseObject {

    private vertex_buffer_: WebGLBuffer;
    private index_buffer_: WebGLBuffer;
    private mesh_ = new Mesh();
    private mesh_loaded_: boolean = false;

    constructor(
        public transform_: Transform,
        private mesh_file_name_: string,
        public colour_ = new Float32Array([1.0, 1.0, 1.0, 1.0]),
        private mesh_loader_: MeshLoader
    ) { };

    init(gl: WebGLRenderingContext) {
        this.mesh_loader_.loadMesh(this.mesh_file_name_).subscribe(data => {
            this.mesh_.vertices = new Float32Array(data.vertices);
            this.mesh_.indices = new Uint16Array(data.indices);
            this.mesh_.length = this.mesh_.indices.length;
            if (this.mesh_.length) {
                this.initBuffers(gl);
            }
        });       
    };

    private initBuffers(gl: WebGLRenderingContext) {
        this.vertex_buffer_ = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer_);
        gl.bufferData(gl.ARRAY_BUFFER, this.mesh_.vertices, gl.STATIC_DRAW);

        this.index_buffer_ = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer_);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.mesh_.indices, gl.STATIC_DRAW);
        this.mesh_loaded_ = true
    };

    draw(gl: WebGLRenderingContext, program: WebGLProgramService) {
        if (this.mesh_loaded_ === false) return;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertex_buffer_);

        gl.vertexAttribPointer(program.aVertexPosition, 3, gl.FLOAT, false, 0, 0);

        gl.uniform4fv(program.uAxisColour, this.colour_);

        gl.uniformMatrix4fv(program.uTransform, false, this.transform_.transform);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.index_buffer_);

        gl.drawElements(gl.LINES, this.mesh_.length, gl.UNSIGNED_SHORT, 0);

    };
};