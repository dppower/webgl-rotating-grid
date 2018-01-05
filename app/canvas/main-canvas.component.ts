import { Component, ViewChild, ElementRef, AfterViewInit, OnDestroy, Inject, Input } from "@angular/core";

import { Transform } from "../maths/transform";
import { Vec3 } from "../maths/vec3";
import { Camera } from "../objects/camera";
import { XAxis } from "../objects/x-axis";
import { YAxis } from "../objects/y-axis";
import { ZAxis } from "../objects/z-axis";
import { WebGLContextService } from "../webgl/webgl-context";
import { WebGLProgramService } from "../webgl/webgl-program";
import { FragmentShader } from "../webgl/fragment-shader";
import { VertexShader } from "../webgl/vertex-shader";
import { MeshLoader } from "../webgl/mesh-loader";

@Component({
    selector: "main-canvas",
    template: `
    <canvas id="canvas" #canvas canvas-controller [width]="canvas_width" [height]="canvas_height">
        <p>{{fallback_text}}</p>
    </canvas>
    `,
    styles: [`
    #canvas {
        height: 100%;
        width: 100%;
        border: none;
        position: absolute;
        z-index: 0;
    }
    `]
})
export class MainCanvasComponent implements OnDestroy {
    @ViewChild("canvas") canvas_ref: ElementRef;
    
    fallback_text: string = "Loading Canvas...";
    
    get canvas_width() {
        return this.canvas_ref.nativeElement.clientWidth;
    };

    get canvas_height() {
        return this.canvas_ref.nativeElement.clientHeight;
    };

    mouse_dx: number = 0;
    mouse_dy: number = 0;

    cancelToken: number;

    private previousTime_: number = 0;
    private timeStep_: number = 1000 / 60.0;
    private dt_: number = 0;

    constructor(private context_: WebGLContextService,
        private program_: WebGLProgramService, private camera_: Camera,
        private xaxis_: XAxis, private yaxis_: YAxis, private zaxis_: ZAxis,
        @Inject("axis-transform") private axis_transform_: Transform
    ) { };
    
    updateCameraZoom(direction: "out" | "in") {
        this.camera_.update(direction);
    };

    ngAfterViewInit() {
        let gl = this.context_.create(this.canvas_ref.nativeElement);
        
        if (gl) {
            this.program_.initWebGl();
            this.xaxis_.init(gl);
            this.yaxis_.init(gl);
            this.zaxis_.init(gl);
            this.axis_transform_.rotate(new Vec3(1.0, 0.0, 0.0), 45.0);

            this.cancelToken = requestAnimationFrame(() => {
                this.tick();
            });
        }
        else {
            setTimeout(() => {
                this.fallback_text = "Unable to initialise WebGL."
            }, 0);
        }
    }

    tick() {
        this.cancelToken = requestAnimationFrame(() => {
            this.tick();
        });

        let timeNow = window.performance.now();
        this.dt_ += (timeNow - this.previousTime_); 
        while (this.dt_ >= this.timeStep_) {
            this.update(this.timeStep_, this.mouse_dx, this.mouse_dy);
            this.dt_ -= this.timeStep_;
        }
        this.draw(this.dt_);
        this.previousTime_ = timeNow;       
    };

    update(dt: number, mouse_dx: number, mouse_dy: number) {
        let dx = 0.005 * dt * mouse_dx;
        this.axis_transform_.rotate(new Vec3(0.0, 1.0, 0.0), dx);       
    };

    draw(dt: number) {
        let gl = this.context_.context;

        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // Use the viewport to display all of the buffer
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        
        // Aspect depends on the display size of the canvas, not drawing buffer.
        let aspect = this.canvas_width / this.canvas_height;
        this.camera_.aspect = aspect;

        gl.uniformMatrix4fv(this.program_.uView, false, this.camera_.view);
        gl.uniformMatrix4fv(this.program_.uProjection, false, this.camera_.projection);

        this.xaxis_.draw(gl, this.program_);
        this.yaxis_.draw(gl, this.program_);
        this.zaxis_.draw(gl, this.program_);
    };

    ngOnDestroy() {
        //this.context_.get.deleteProgram(this.program_.get);
        cancelAnimationFrame(this.cancelToken);
    };
}