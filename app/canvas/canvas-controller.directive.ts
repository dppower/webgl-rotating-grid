import { Directive, HostListener } from "@angular/core";
import { MainCanvasComponent } from "./main-canvas.component";

@Directive({
    selector: "[canvas-controller]"
})
export class CanvasController {

    constructor(private canvas: MainCanvasComponent) { };

    @HostListener("wheel", ["$event"])
    onMouseWheel(event: WheelEvent) {
        let delta = event.deltaY;

        if (delta > 0.0) {
            this.canvas.updateCameraZoom("out");
        } else {
            this.canvas.updateCameraZoom("in");
        }
        return false;
    };

    @HostListener("mousemove", ["$event"])
    onDrag(event: MouseEvent) {

        if (event.buttons == 1) {
            this.canvas.mouse_dx = event.movementX;
            this.canvas.mouse_dy = event.movementY;
        } else {
            this.canvas.mouse_dx = 0;
            this.canvas.mouse_dy = 0;
        }
    };
}