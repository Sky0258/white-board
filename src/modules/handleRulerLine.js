// 3.沿着尺子画线模块
import { reactive } from "vue";
import { paintLineStart, paintLineMove, paintLineEnd } from "../utils/paintLine";
// import { }
let flag = false;
const rulerEquation = reactive({
  k: 0,
  b: 0,
});
// 判断是否在尺子附近进行吸附
export function handleRulerAround(e, rulerPosition, paintType) {
  if (e.offsetX >= rulerPosition.x && e.offsetX <= rulerPosition.x + 420 && e.offsetY >= rulerPosition.y - 30 && e.offsetY <= rulerPosition.y) {
    paintType.value = 3;
    return true;
  }
}

// 获取尺子直线方程
export function getLineEquation(rulerPosition) {
  let angle = 0; // 角度值
  rulerEquation.k = parseFloat(Math.tan((angle * Math.PI) / 180).toFixed(2));
  rulerEquation.b = parseFloat((rulerPosition.y - rulerEquation.k * rulerPosition.x).toFixed(2));
}

// 获取垂直点
export function countVerticalPoint(x, y) {
  const { k, b } = rulerEquation;

  const targetPoint = {
    x: 0,
    y: 0,
  };
  targetPoint.x = (x + k * y - k * b) / (k * k + 1);
  targetPoint.y = k * x + b - 1;

  return targetPoint;
}

// 开始画吸附直线
export function handleRulerLineStart(e, ctx, rulerPosition, paintCurrentPathHistory, linePath) {
  getLineEquation(rulerPosition);
  const targetPoint = countVerticalPoint(e.offsetX, e.offsetY);
  paintLineStart(ctx, targetPoint.x, targetPoint.y, paintCurrentPathHistory.value, linePath);
  flag = true;
}

// 移动吸附直线
export function handleRulerLineMove(e, ctx, paintCurrentPathHistory, linePath) {
  if (flag) {
    const targetPoint = countVerticalPoint(e.offsetX, e.offsetY);
    paintLineMove(ctx, targetPoint.x, targetPoint.y, paintCurrentPathHistory.value, linePath);
  }
}

// 结束吸附直线
export function handleRulerLineEnd(ctx, paintCurrentPathHistory, linePath, paintType) {
  // 替换
  // ctx.closePath();
  paintLineEnd(ctx, paintCurrentPathHistory.value, linePath);
  linePath.length = 0;
  flag = false;
  paintType.value = 1;
}
