import {Inject, Injectable} from "angular2/core";
import {WebGLProgramService} from "./webgl-program";
import {Transform, Vec3} from "./transform";
import {GameObject} from "./game-object";
import {MeshLoader} from "./mesh-loader";

@Injectable()
export class ZAxis extends GameObject {

    constructor( @Inject("axis-transform") transform: Transform, meshLoader_: MeshLoader) {
        super(transform, "z-axis.json", new Float32Array([0.0, 0.0, 1.0, 1.0]), meshLoader_);
    };
};