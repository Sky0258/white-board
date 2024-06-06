import { reactive, ref } from "vue";
import { paintPathLine } from "./handleSave";

// 记录上一个尺子的位置，避免叠影
const preRulerPosition = reactive({
  x: 300,
  y: 300,
});

const distanceToRuler = reactive({
  distanceX: 0,
  distanceY: 0,
});

const isDragging = ref(false);
const isInclining = ref(false);

// 判断是否在尺子上
export function checkOnRuler(e, rulerPosition, paintType) {
  const { x, y } = rulerPosition;
  if (e.offsetX >= x && e.offsetX <= x + 400 && e.offsetY >= y && e.offsetY <= y + 70) {
    distanceToRuler.distanceX = e.offsetX - x;
    distanceToRuler.distanceY = e.offsetY - y;

    if (checkOnRulerButton(e, rulerPosition, paintType)) {
      paintType.value = 4;
    } else {
      isDragging.value = true;
    }

    return true;
  }
  return false;
}

// 显示尺子
export function handleShowRuler(x, y, ctx, isShowRuler, paintType, paintCurrentPathHistory, linePath) {
  isShowRuler.value = !isShowRuler.value;
  paintType.value = 2;
  isDragging.value = false;

//   if (!isShowRuler.value) {
//     // 关闭线条推入
//     paintCurrentPathHistory.value = true;
//     paintPathLine("currentPathStore", ctx, paintCurrentPathHistory, linePath);
//     // 重置线条推入设置
//     paintCurrentPathHistory.value = false;
//   }
  drawRuler(x, y, ctx, isShowRuler, paintCurrentPathHistory, linePath);
}

// 画尺子
export function drawRuler(x, y, ctx, isShowRuler, paintCurrentPathHistory, linePath) {
  // 把之前的尺子删掉
  ctx.fillStyle = "#e0e0e0";
  //   ctx.fillRect(preRulerPosition.x - 1, preRulerPosition.y, 402, 70);
  ctx.fillRect(0, 0, 1200, 700);

 
  if (isShowRuler.value) {
    preRulerPosition.x = x;
    preRulerPosition.y = y;
    ctx.fillStyle = "white";
    ctx.fillRect(x, y, 400, 70);

    // 绘制横向刻度
    ctx.strokeStyle = "#D4D2CF";
    ctx.beginPath();
    ctx.moveTo(x, y + 1);
    ctx.lineTo(x + 400, y + 1);
    ctx.stroke();
    ctx.closePath();

    // 绘制竖向刻度
    for (let i = 0; i <= 400; i += 20) {
      ctx.beginPath();
      ctx.moveTo(x + i, y);
      let yLine = i % 100 == 0 ? 23 : 10;
      ctx.lineTo(x + i, y + yLine);
      ctx.stroke();
      ctx.closePath();
    }

    // 画旋转按钮
    var radius = 8;
    ctx.beginPath();
    ctx.arc(x + 370, y + 40, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.closePath();
    ctx.strokeStyle = "black";
  }

   // 关闭线条推入
   paintCurrentPathHistory.value = true;
   paintPathLine("currentPathStore", ctx, paintCurrentPathHistory, linePath);
   // 重置线条推入设置
   paintCurrentPathHistory.value = false;
}

export function handleRulerMove(e, rulerPosition, ctx, paintCurrentPathHistory, linePath, isShowRuler) {
  const { distanceX, distanceY } = distanceToRuler;

  if (isDragging.value) {
    rulerPosition.x = e.offsetX - distanceX;
    rulerPosition.y = e.offsetY - distanceY;

    // // 关闭线条推入
    // paintCurrentPathHistory.value = true;
    // paintPathLine("currentPathStore", ctx, paintCurrentPathHistory, linePath);
    // // 重置线条推入设置
    // paintCurrentPathHistory.value = false;

    drawRuler(rulerPosition.x, rulerPosition.y, ctx, isShowRuler, paintCurrentPathHistory, linePath);
  }
}

export function handleMoveRulerEnd(paintType) {
  isDragging.value = false;
  paintType.value = 2;
}

// 尺子倾斜模块
function checkOnRulerButton(e, rulerPosition) {
  const { x, y } = rulerPosition;
  if (e.offsetX >= x + 362 && e.offsetX <= x + 378 && e.offsetY >= y + 32 && e.offsetY <= y + 48) {
    isInclining.value = true;
    return true;
  }
  return false;
}

// 处理尺子倾斜
export function handleInclineRulerMove(ctx, e, rulerPosition, paintCurrentPathHistory, linePath, angle) {
  // 计算鼠标点击点与尺子左上角的连线和水平方向的夹角
  angle.value = Math.atan2(e.offsetY - rulerPosition.x, e.offsetX - rulerPosition.y) * 100;
  // 转成弧度制
  const radian = ((angle.value + 180) * Math.PI) / 180;

  drawInclineRuler(ctx, radian, rulerPosition);
  // 关闭线条推入
  paintCurrentPathHistory.value = true;
  paintPathLine("currentPathStore", ctx, paintCurrentPathHistory, linePath);
  // 重置线条推入设置
  paintCurrentPathHistory.value = false;
}

function drawInclineRuler(ctx, radian, rulerPosition) {
  ctx.fillStyle = "#e0e0e0";
  ctx.fillRect(0, 0, 1200, 700); //清屏

  if (isInclining.value) {
    ctx.save();
    ctx.beginPath();
    ctx.translate(rulerPosition.x, rulerPosition.y);
    ctx.rotate(radian); //设置矩形旋转
    ctx.closePath();
    // 绘制矩形
    ctx.fillStyle = "white";
    ctx.fillRect(-400, -70, 400, 70);

    // 绘制横向刻度
    ctx.strokeStyle = "#D4D2CF";
    ctx.beginPath();
    ctx.moveTo(0, 0 - 1);
    ctx.lineTo(0 - 400, 0 - 1);
    ctx.stroke();
    ctx.closePath();

    // 绘制竖向刻度
    for (let i = 0; i >= -400; i -= 20) {
      ctx.beginPath();
      ctx.moveTo(0 + i, 0);
      let yLine = i % 100 == 0 ? 23 : 10;
      ctx.lineTo(0 + i, 0 - yLine);
      ctx.stroke();
      ctx.closePath();
    }

    // 画旋转按钮
    var radius = 8;
    ctx.beginPath();
    ctx.arc(0 - 370, 0 - 40, radius, 0, 2 * Math.PI);
    ctx.stroke();
    ctx.strokeStyle = "black";
    ctx.restore();
    ctx.closePath();
  }
}

export function handleInclineRulerEnd(paintType) {
  isInclining.value = false;
  paintType.value = 2;
}
