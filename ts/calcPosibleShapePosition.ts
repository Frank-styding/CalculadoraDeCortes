export function checkPoints(points: [number, number, number[]][]) {
  for (let i = 0; i < points.length; i++) {
    for (let j = 0; j < points.length; j++) {
      if (i != j) {
        if (points[i][0] == points[j][0] && points[i][1] == points[j][1]) {
          let set = new Set([...points[i][2], ...points[j][2]]);
          points[i][2] = [...set];
          points[j][2] = [...set];
        }
      }
    }
  }

  let result: [number, number][] = [];

  result = points
    .filter((point) => point[2].length === 1)
    .map((point) => [point[0], point[1]]);

  return result;
}

export function orderPoints(points: [number, number][]) {
  let vertical = true;
  let path = [[0, 0]];

  do {
    let currentPoint = path[path.length - 1];
    let direction = vertical ? 1 : 0;

    let nextPoint = points
      .filter((point) => {
        return (
          !path.some(
            (point1) => point1[0] == point[0] && point1[1] == point[1],
          ) &&
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

export function filterNextStartPoints(points: [number, number][]) {
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

export function getPointsOfShape(
  shapes: ([number, number] | [number, number, number[]])[][],
) {
  let points: [number, number, number[]][] = [];
  for (let i = 0; i < shapes.length; i++) {
    let shape = shapes[i];
    for (let point of shape) {
      if (point.length != 3) {
        points.push([point[0], point[1], [i]]);
      } else {
        points.push([point[0], point[1], point[2]]);
      }
    }
  }
  return points;
}

export function moveShape(
  shape: ([number, number] | [number, number, number[]])[],
  pos: [number, number],
) {
  let result: ([number, number] | [number, number, number[]])[] = [];
  for (let point of shape) {
    if (point.length == 3) {
      result.push([point[0] + pos[0], point[1] + pos[1], point[2]]);
    } else {
      result.push([point[0] + pos[0], point[1] + pos[1]]);
    }
  }
  return result;
}

export function rotateShape(shape: [number, number][]) {
  let maxX = 0;
  let maxY = 0;
  for (let point of shape) {
    maxX = Math.max(point[0], maxX);
    maxY = Math.max(point[1], maxY);
  }

  let centerX = maxX / 2;
  let centerY = maxY / 2;

  console.log(centerX + " " + centerY)
  return shape
    .map((point) => [point[0] - centerX , point[1] - centerY])
    .map((point) => [point[1],-point[0]])
    .map((point) => [point[0] + centerX, point[1] + centerY]);
}

export function intersectLine(
  a: [number, number],
  b: [number, number],
  c: [number, number],
  d: [number, number],
) {
  let _a = a,
    _b = b,
    _c = c,
    _d = d;

  if (a[0] == b[0] && c[1] == d[1]) {
    if (a[1] > b[1]) {
      _b = a;
      _a = b;
    }
    if (c[0] > d[0]) {
      _c = d;
      _d = c;
    }
    return _d[0] > _a[0] && _a[0] > _c[0] && _b[1] > _c[1] && _c[1] > _a[1];
  }

  if (a[1] == b[1] && c[0] == d[0]) {
    if (c[1] > d[1]) {
      _c = d;
      _d = c;
    }
    if (a[0] > b[0]) {
      _b = a;
      _a = b;
    }
    return _b[0] > _c[0] && _c[0] > _a[0] && _d[1] > _a[1] && _a[1] > _c[1];
  }

  return false;
}

export function intersectShapes(
  shapeA: [number, number][],
  shapeB: [number, number][],
) {
  for (let i = 0; i < shapeA.length; i++) {
    for (let j = 0; j < shapeB.length; j++) {
      if (
        intersectLine(
          shapeA[i % shapeA.length],
          shapeA[(i + 1) % shapeA.length],
          shapeB[j % shapeB.length],
          shapeB[(j + 1) % shapeB.length],
        )
      ) {
        return true;
      }
    }
  }
  return false;
}

export function existIntersect(shapes: [number, number][][]) {
  for (let i = 0; i < shapes.length; i++) {
    for (let j = 0; j < shapes.length; j++) {
      if (i != j) {
        if (intersectShapes(shapes[j], shapes[i])) {
          return true;
        }
      }
    }
  }

  return false;
}

export function isInMaxSpace(
  shapes: [number, number][][],
  width: number,
  height: number,
) {
  let points = getPointsOfShape(shapes);
  return (
    points.filter((point) => point[0] <= width && point[1] <= height).length ==
    points.length
  );
}

export function rectPath(
  width: number,
  height: number,
  x: number,
  y: number,
): [number, number][] {
  return [
    [x, y],
    [width + x, y],
    [width + x, height + y],
    [x, height + y],
  ];
}

export function calcPosibleShapePosition(
  shapes: [number, number][][],
  width: number,
  height: number,
  idx = 0,
  startPoints: [number, number][] = [[0, 0]],
  shapesOnSpace: [number, number][][] = [],
): [number, number][][][] {
  if (startPoints.length == 0) {
    return [];
  }
  if (shapes.length == idx) {
    return [shapesOnSpace];
  }

  let shape = shapes[idx];

  let posibleShapesOnSpace: [number, number][][] = startPoints.map((point) =>
    moveShape(shape, point),
  ) as [number, number][][];

  for (let posibleShape of posibleShapesOnSpace) {
    let nextShapes: [number, number][][] = [...shapesOnSpace, posibleShape];

    getPointsOfShape(nextShapes);

    if (
      !existIntersect(nextShapes) &&
      isInMaxSpace(nextShapes, width, height)
    ) {
      let nextStartPoints = filterNextStartPoints(
        orderPoints(
          checkPoints(getPointsOfShape(nextShapes)) as [number, number][],
        ) as [number, number][],
      );
      let aux = calcPosibleShapePosition(
        shapes,
        width,
        height,
        idx + 1,
        nextStartPoints,
        nextShapes,
      );
      if (aux.length > 0) {
        return aux;
      }
    }
  }

  return [];
}
