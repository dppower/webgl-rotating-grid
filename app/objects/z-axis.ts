import { Inject, Injectable } from "@angular/core";
import { WebGLProgramService } from "../webgl/webgl-program";
import { MeshLoader } from "../webgl/mesh-loader";
import { Transform } from "../maths/transform";
import { BaseObject } from "./base-object";

@Injectable()
export class ZAxis extends BaseObject {

    constructor( @Inject("axis-transform") transform: Transform, meshLoader_: MeshLoader) {
        super(transform, "z-axis.json", new Float32Array([0.0, 0.0, 1.0, 1.0]), meshLoader_);
    };
};