import { Injectable } from "@angular/core";
import { WebGLContextService } from "./webgl-context";

@Injectable()
export class FragmentShader {

    constructor(private context_: WebGLContextService) { };

    getShader() {
        let gl = this.context_.context;
        this.shader_ = gl.createShader(gl.FRAGMENT_SHADER);
        gl.shaderSource(this.shader_, this.source_);
        gl.compileShader(this.shader_);

        if (!gl.getShaderParameter(this.shader_, gl.COMPILE_STATUS)) {
            console.log("Fragment shader compilation error: " + gl.getShaderInfoLog(this.shader_));
            return null;
        }
        return this.shader_; 
    };

    private source_: string = `
    precision mediump float;
 
    uniform vec4 uAxisColour;

    void main(void) {
        gl_FragColor = uAxisColour;
    }
    `;

    private shader_: WebGLShader;
}