// 用 canvas 画，且判断是否保存路径
import { addDataToStore } from "../state/index";

export function paintLineStart(ctx, x, y, isSavePath, linePath) {
  ctx.beginPath();
  ctx.moveTo(x, y);
  !isSavePath &&
    linePath.push({
      offsetX: x,
      offsetY: y,
    });
}

export function paintLineMove(ctx, x, y, isSavePath, linePath) {
  ctx.lineTo(x, y);
  ctx.stroke();
  !isSavePath &&
    linePath.push({
      offsetX: x,
      offsetY: y,
    });
}

export function paintLineEnd(ctx, isSavePath, linePath) {
  ctx.closePath();
  !isSavePath &&
    addDataToStore([...linePath], "currentPathStore");
}
