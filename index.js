import {
  applyTransform,
  drawPath,
  drawPoint,
  setSize,
  background,
  clear,
} from "./draw.js";

import {
  checkPoints,
  orderPoints,
  filterNextStartPoints,
  getPointsOfShape,
  moveShape,
  rectPath,
  calcPosibleShapePosition,
} from "./calcPosibleShapePosition.js";

setSize(innerWidth, innerHeight);
background("black");

let deleteEquals = (points) => {
  let result = [];

  for (let point of points) {
    if (
      !result.some((item) => {
        if (typeof item == "object") {
          for (let i in item) {
            if (item[i] != point[i]) {
              return false;
            }
          }
        } else if (item != point) {
          return false;
        }

        return true;
      })
    ) {
      result.push(point);
    }
  }

  return result;
};

let shapes = [
  rectPath(80, 80, 0, 0),
  rectPath(50, 50, 0, 0),
  rectPath(50, 150, 0, 0),
  rectPath(90, 150, 0, 0),
];

let posibleShapePosition = calcPosibleShapePosition(shapes, 200, 20);

let idx = 2;
let counter = 0;

clear();
background("black");

for (let shapePosition of posibleShapePosition[idx]) {
  drawPath(shapePosition, "red");
}

/*    
function loop() {
  if (counter % 50 == 0) {
    clear();
    background("black");
    if (idx == posibleShapePosition.length) {
      idx = 0;
    }
    for (let shapePosition of posibleShapePosition[idx]) {
      drawPath(shapePosition, "red");
    }
    idx++;
  }

  counter++;
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop); */
