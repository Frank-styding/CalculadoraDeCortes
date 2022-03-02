import { applyTransform, drawPath, setSize, background, clear, drawStrokeRect, } from "./draw.js";
import { rectPath, calcPosibleShapePosition, rotateShape, } from "./calcPosibleShapePosition.js";
setSize(innerWidth, innerHeight);
background("black");
let shapes = [
    rectPath(150, 90, 0, 0),
    rectPath(20, 50, 0, 0),
    rectPath(50, 100, 0, 0),
    rectPath(50, 50, 0, 0),
    rectPath(50, 50, 0, 0),
    rectPath(50, 90, 0, 0),
    rectPath(20, 20, 0, 0),
];
let width = 170;
let height = 200;
console.time("time");
let posibleShapePosition = calcPosibleShapePosition(shapes, width, height);
console.timeEnd("time");
calcPosibleShapePosition([rectPath(200, 200, 0, 0)], 200, 200);
console.log(posibleShapePosition.length);
console.log(rotateShape(rectPath(100, 200, 0, 0)));
let idx = 0;
let counter = 0;
function loop() {
    if (counter % 50 == 0) {
        clear();
        background("black");
        if (idx == posibleShapePosition.length) {
            idx = 0;
        }
        applyTransform(() => {
            drawStrokeRect(width, height, 0, 0, "white");
        }, 400, 400);
        for (let shapePosition of posibleShapePosition[idx]) {
            applyTransform(() => {
                drawPath(shapePosition, "red", 2);
            }, 400, 400);
        }
        idx++;
    }
    counter++;
    requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
