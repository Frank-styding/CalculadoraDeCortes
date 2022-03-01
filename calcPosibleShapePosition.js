export function checkPoints(points) {
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

export function orderPoints(points) {
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

export function filterNextStartPoints(points) {
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

export function getPointsOfShape(shapes) {
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

export function moveShape(shape, pos) {
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

export function rectPath(width, height, x, y) {
  return [
    [x, y],
    [width + x, y],
    [width + x, height + y],
    [x, height + y],
  ];
}

export function calcPosibleShapePosition(
  shapes,
  width,
  height,
  idx = 0,
  startPoints = [[0, 0]],
  shapesOnSpace = [],
) {
  if (shapes.length == idx) {
    return [shapesOnSpace];
  }

  let shape = shapes[idx];

  


  let previus = filterNextStartPoints(
    orderPoints(
      checkPoints(getPointsOfShape([...shapesOnSpace])),
    ),
  );

  console.log(previus)




  let posibleShapesOnSpace = startPoints.map((point) =>
    moveShape(shape, point),
  );

  let result = [];
  for (let posibleShape of posibleShapesOnSpace) {
    let nextStartPoints = filterNextStartPoints(
      orderPoints(
        checkPoints(getPointsOfShape([...shapesOnSpace, posibleShape])),
      )
    );

    result.push(
      ...calcPosibleShapePosition(
        shapes,
        width,
        height,
        idx + 1,
        nextStartPoints,
        [...shapesOnSpace, posibleShape],
      ),
    );
  }

  return result;
}
