import { Injectable } from "@angular/core";

import { of as rxOf } from "rxjs/observable/of";
import { tap, catchError } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

export interface MeshData {
    vertices: number[];
    indices: number[];
}

export class Mesh {
    vertices: Float32Array;
    indices: Uint16Array;
    length: number;
}

@Injectable()
export class MeshLoader {

    constructor(private http_client_: HttpClient) { };

    loadMesh(fileName: string) {
        localStorage.clear();
        let json = localStorage.getItem(fileName);
        if (json) {
            let object = JSON.parse(json) as MeshData;
            return rxOf(object);
        }

        return this.http_client_.get<MeshData>("mesh/" + fileName)
            .pipe(
                tap(mesh => {
                    this.saveToLocal(fileName, mesh);
                }),
                catchError(this.handleError)
            );
    };

    handleError(err: Response) {
        return rxOf<MeshData>({ vertices: [], indices: [] });
    };

    saveToLocal(key: string, mesh: object) {
        let data = JSON.stringify(mesh);
        localStorage.setItem(key, data);
    };
};