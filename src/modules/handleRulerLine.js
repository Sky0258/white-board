// 3.沿着尺子画线模块
import { reactive } from "vue";
import { paintLineStart, paintLineMove, paintLineEnd } from "../utils/paintLine";
import { handleShowRuler } from './handleMoveRuler'

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
export function getLineEquation(rulerPosition, angle) {
  rulerEquation.k = parseFloat(Math.tan((angle.value * Math.PI) / 180).toFixed(4));
  rulerEquation.b = parseFloat((rulerPosition.y - rulerEquation.k * rulerPosition.x).toFixed(4));
}

// 获取垂直点
export function countVerticalPoint(x, y) {
  const { k, b } = rulerEquation;

  const targetPoint = {
    x: 0,
    y: 0,
  };

  if (k == 0) {
    targetPoint.x = (x + k * y - k * b) / (k * k + 1);
    targetPoint.y = k * x + b - 1;
  } else {
    // 计算垂线斜率
    const perpendicularSlope = -1 / k;
    // 计算垂线方程的截距
    const perpendicularIntercept = y - perpendicularSlope * x;
    targetPoint.x = (perpendicularIntercept - b) / (k - perpendicularSlope);
    targetPoint.y = k * targetPoint.x + b;
  }

  return targetPoint;
}


// 开始画吸附直线
export function handleRulerLineStart(e, ctx, rulerPosition, paintCurrentPathHistory, linePath, angle) {
  getLineEquation(rulerPosition, angle);
  const targetPoint = countVerticalPoint(e.offsetX, e.offsetY);
  paintLineStart(ctx, targetPoint.x, targetPoint.y, paintCurrentPathHistory.value, linePath);
  flag = true;
}

// 移动吸附直线
export function handleRulerLineMove(e, ctx, paintCurrentPathHistory, linePath) {
  if (flag) {
    const targetPoint = countVerticalPoint(e.offsetX, e.offsetY);
    // handleInclineRulerMove(ctx, e, rulerPosition, paintCurrentPathHistory, linePath, angle);
    paintLineMove(ctx, targetPoint.x, targetPoint.y, paintCurrentPathHistory.value, linePath);
  }
}


// 结束吸附直线
export function handleRulerLineEnd(ctx, paintCurrentPathHistory, linePath, paintType, isShowRuler) {
  paintLineEnd(ctx, paintCurrentPathHistory.value, linePath);
  linePath.length = 0;
  flag = false;
  isShowRuler.value = true;

  handleShowRuler(0, 0, ctx, isShowRuler, paintType, paintCurrentPathHistory, linePath);
  paintType.value = 1;
}

export function repaint() {}
