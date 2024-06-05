// 判断是否在尺子上
// 记录尺子左上角位置
import { reactive, ref } from "vue";
import { paintPathLine } from './handleSave'

const rulerPosition = reactive({
  x: 300,
  y: 300,
});

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

export function checkOnRuler(e) {
  const { x, y } = rulerPosition;
  if (e.offsetX >= x && e.offsetX <= x + 400 && e.offsetY >= y && e.offsetY <= y + 70) {
    distanceToRuler.distanceX = e.offsetX - x;
    distanceToRuler.distanceY = e.offsetY - y;
    isDragging.value = true;
    return true;
  }
  return false;
}

// 显示尺子
export function handleShowRuler(x, y, isShowRuler, paintType, paintCurrentPathHistory) {
  isShowRuler.value = !isShowRuler.value;
  paintType.value = 2;
  isDragging.value = false;
  drawRuler(x, y);

  if (!isShowRuler.value) {
    // 关闭线条推入
    paintCurrentPathHistory.value = true;
    paintPathLine("currentPathStore");
    // 重置线条推入设置
    paintCurrentPathHistory.value = false;
  }
}

// 画尺子
export function drawRuler(x, y, ctx, isShowRuler) {
  // 把之前的尺子删掉
  ctx.fillStyle = "#e0e0e0";
  ctx.fillRect(preRulerPosition.x - 1, preRulerPosition.y, 402, 70);

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

    // 绘制竖向刻度
    for (let i = 0; i <= 400; i += 20) {
      ctx.beginPath();
      ctx.moveTo(x + i, y);
      let yLine = i % 100 == 0 ? 23 : 10;
      ctx.lineTo(x + i, y + yLine);
      ctx.stroke();
    }
    ctx.strokeStyle = "black";
  }
}

export function handleRulerMove(e, paintCurrentPathHistory) {
  const { distanceX, distanceY } = distanceToRuler;

  if (isDragging.value) {
    rulerPosition.x = e.offsetX - distanceX;
    rulerPosition.y = e.offsetY - distanceY;

    // 关闭线条推入
    paintCurrentPathHistory.value = true;
    paintPathLine("currentPathStore");
    // 重置线条推入设置
    paintCurrentPathHistory.value = false;
    drawRuler(rulerPosition.x, rulerPosition.y);
  }
}

export function handleMoveRulerEnd(paintType) {
  isDragging.value = false;
  paintType.value = 2;
}
