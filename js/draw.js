let canvas = document.createElement("canvas");
document.body.appendChild(canvas);
let ctx = canvas.getContext("2d");
export function setSize(width, height) {
    canvas.width = width;
    canvas.height = height;
}
export function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
export function background(color) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
}
export function drawPoint(x, y, color, radius) {
    ctx.save();
    ctx.beginPath();
    ctx.fillStyle = color;
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
}
export function drawPath(points, color, lineWidth, showPoints = false, radius = 1, pointColor = undefined) {
    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    let start = true;
    for (let point of points) {
        if (start) {
            ctx.moveTo(point[0], point[1]);
            start = false;
        }
        else {
            ctx.lineTo(point[0], point[1]);
        }
    }
    ctx.closePath();
    ctx.stroke();
    if (showPoints) {
        for (let point of points) {
            drawPoint(point[0], point[1], pointColor !== null && pointColor !== void 0 ? pointColor : color, radius);
        }
    }
    ctx.restore();
}
export function applyTransform(callback, x, y, xScale = 1, yScale = 1, angle = 0) {
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    ctx.save();
    ctx.transform(1, 0, 0, 1, x, y);
    ctx.transform(cos, -sin, sin, cos, 0, 0);
    ctx.transform(xScale, 0, 0, yScale, 0, 0);
    callback();
    ctx.restore();
}
export function drawStrokeRect(width, height, x, y, color) {
    ctx.save();
    ctx.strokeStyle = color;
    ctx.strokeRect(x, y, width, height);
    ctx.restore();
}
