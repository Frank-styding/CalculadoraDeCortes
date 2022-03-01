import {
  applyTransform,
  drawPath,
  drawPoint,
  setSize,
  background,
  clear,
} from "./draw.js";

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

function checkPoints(points) {
  for (let i = 0; i < points.length; i++) {
    for (let j = i; j < points.length; j++) {
      if (points[i][0] == points[j][0] && points[i][1] == points[j][1]) {
        let aux = [...new Set([...points[i][2], ...points[j][2]])];
        points[i][2] = aux;
        points[j][2] = aux;
      }
    }
  }
  points = points.filter((point) => point[2].length === 1);

  return points;
}
function orderPoints(points) {
  let vertical = true;

  let path = [[0, 0]];

  do {
    let currentPoint = path[path.length - 1];
    let direction = vertical ? 1 : 0;

    let nextPoint = points
      .filter(
        (point) =>
          !path.some(
            (point1) => point1[0] == point[0] && point1[1] == point[1],
          ),
      )

      .filter((point) => {
        return (
          point[direction] == currentPoint[direction] &&
          point[1 - direction] != currentPoint[1 - direction]
        );
      })
      .sort(
        (a, b) =>
          Math.abs(a[1 - direction] - currentPoint[1 - direction]) -
          Math.abs(b[1 - direction] - currentPoint[1 - direction]),
      )[0];

    if (nextPoint != undefined) {
      path.push(nextPoint);
    } else {
      break;
    }

    vertical = !vertical;
  } while (path.length < points.length);

  return path;
}
function filterNextStartPoints(points) {
  let list = [];
  for (let i = 0; i < points.length; i++) {
    let a = points[i % points.length];
    let b = points[(i + 1) % points.length];
    if (a[0] == b[0]) {
      list.push(a);
    }
  }
  return list;
}
function getPointsOfShape(shapes) {
  let points = [];
  for (let i = 0; i < shapes.length; i++) {
    let shape = shapes[i];
    for (let point of shape) {
      if (point.length != 3) {
        points.push([...point, [i]]);
      } else {
        points.push([...point]);
      }
    }
  }
  return points;
}

function moveShape(shape, pos) {
  let result = [];
  for (let point of shape) {
    if (point.length == 3) {
      result.push([point[0] + pos[0], point[1] + pos[1], point[2]]);
    } else {
      result.push([point[0] + pos[0], point[1] + pos[1]]);
    }
  }
  return result;
}

function rectPath(width, height, x, y) {
  return [
    [x, y],
    [width + x, y],
    [width + x, height + y],
    [x, height + y],
  ];
}

let shapes = [
  rectPath(100, 100, 0, 0),
  rectPath(100, 100, 0, 0),
  rectPath(80, 150, 0, 0),
  rectPath(80, 150, 0, 0),
];

/* calcNewShape(
  [[0, 0]],
  [rectPath(100, 100, 0, 0), rectPath(100, 100, 0, 0)],
  200,
  200,
);
 */

function calcPosibleShapePosition(
  shapes,
  width,
  height,
  idx = 0,
  startPoints = [[0, 0]],
  shapesOnSpace = [],
) {
  //
  if (shapes.length == idx) {
    return [shapesOnSpace];
  }
  //
  let shape = shapes[idx];

  let posibleShapesOnSpace = startPoints.map((point) =>
    moveShape(shape, point),
  );

  let result = [];
  for (let posibleShape of posibleShapesOnSpace) {
    let nextStartPoints = filterNextStartPoints(
      orderPoints(
        checkPoints(getPointsOfShape([...shapesOnSpace, posibleShape])),
      ),
    );

    result.push(
      ...calcPosibleShapePosition(shapes, width, height, idx + 1, nextStartPoints, [
        ...shapesOnSpace,
        posibleShape,
      ]),
    );
  }
  return result;
}


let posibleShapePosition = calcPosibleShapePosition(shapes,200,20);

/* for( let shapePosition of posibleShapePosition){
  drawPath(shapePosition,"red")
} */

let idx = 0;

let counter = 0;

function loop(){
  if(counter % 100 == 0 ){
    clear();
    background("black");
    if(idx == posibleShapePosition.length){
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
requestAnimationFrame(loop);
