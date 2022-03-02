let canvas = document.createElement("canvas");
document.body.appendChild(canvas);

let ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

export function setSize(width: number, height: number) {
  canvas.width = width;
  canvas.height = height;
}

export function clear() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
export function background(color: string) {
  ctx.save();
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.restore();
}

export function drawPoint(x: number, y: number, color: string, radius: number) {
  ctx.save();
  ctx.beginPath();
  ctx.fillStyle = color;
  ctx.arc(x, y, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

export function drawPath(
  points: [number, number][],
  color: string,
  lineWidth: number,
  showPoints: boolean = false,
  radius: number = 1,
  pointColor: string | undefined = undefined,
) {
  ctx.save();

  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.lineWidth = lineWidth;
  let start = true;
  for (let point of points) {
    if (start) {
      ctx.moveTo(point[0], point[1]);
      start = false;
    } else {
      ctx.lineTo(point[0], point[1]);
    }
  }
  ctx.closePath();
  ctx.stroke();

  if (showPoints) {
    for (let point of points) {
      drawPoint(point[0], point[1], pointColor ?? color, radius);
    }
  }

  ctx.restore();
}

export function applyTransform(
  callback: () => void,
  x: number,
  y: number,
  xScale: number = 1,
  yScale: number = 1,
  angle: number = 0,
) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  ctx.save();
  ctx.transform(1, 0, 0, 1, x, y);
  ctx.transform(cos, -sin, sin, cos, 0, 0);
  ctx.transform(xScale, 0, 0, yScale, 0, 0);
  callback();
  ctx.restore();
}

export function drawStrokeRect(
  width: number,
  height: number,
  x: number,
  y: number,
  color: string,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.strokeRect(x, y, width, height);
  ctx.restore();
}
