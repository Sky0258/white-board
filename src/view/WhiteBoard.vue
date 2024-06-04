<template>
  <div>
    <button @click="{ paintType = 1;}">画任意线</button>
    <button @click="handleShowRuler(rulerPosition.x, rulerPosition.y)">直尺</button><br />
    <canvas ref="canvasRef" width="1200" height="700"></canvas>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
const canvasRef = ref(null);
let canvas = null;
let ctx = null;
let flag = false;
let paintType = ref(1);

// 初始化 canvas
function initCanvas() {
  canvas = canvasRef.value;
  ctx = canvas.getContext("2d");
  // 设置画板线条的大小，背景色等
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.fillStyle = "#e0e0e0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// 1.任意线模块
function handlePaintLineStart(e) {
  flag = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function handlePaintLineMove(e) {
  if (flag && !checkOnRuler(e)) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
}

function handlePaintLineEnd() {
  ctx.closePath();
  flag = false;
}

// 2.移动尺子模块
let isShowRuler = ref(false);
// 记录尺子左上角位置
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

// 判断是否在尺子上
function checkOnRuler(e) {
  const { x, y } = rulerPosition;
  if (
    e.offsetX >= x &&
    e.offsetX <= x + 400 &&
    e.offsetY >= y &&
    e.offsetY <= y + 70
  ) {
    distanceToRuler.distanceX = e.offsetX - x;
    distanceToRuler.distanceY = e.offsetY - y;
    isDragging.value = true;
    return true;
  }
  return false;
}

// 显示尺子
function handleShowRuler(x, y) {
  isShowRuler.value = !isShowRuler.value;
  paintType.value = 2;
  isDragging.value = false;
  drawRuler(x, y);
}

// 画尺子
function drawRuler(x, y) {
  // 把之前的尺子删掉
  ctx.fillStyle = "#e0e0e0";
  ctx.fillRect(preRulerPosition.x - 1, preRulerPosition.y, 420, 90);

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

function handleRulerMove(e) {
  const { distanceX, distanceY } = distanceToRuler;

  if (isDragging.value) {
    rulerPosition.x = e.offsetX - distanceX;
    rulerPosition.y = e.offsetY - distanceY;
    drawRuler(rulerPosition.x, rulerPosition.y);
  }
}

function handleMoveRulerEnd() {
  isDragging.value = false;
}

// 3.沿着尺子画线模块
const rulerEquation = reactive({
  k: 0,
  b: 0,
});
// 判断是否在尺子附近进行吸附
function handleRulerAround(e) {
  if (
    e.offsetX >= rulerPosition.x &&
    e.offsetX <= rulerPosition.x + 420 &&
    e.offsetY >= rulerPosition.y - 30 &&
    e.offsetY <= rulerPosition.y
  ) {
    paintType.value = 3;
  }
}

// 获取尺子直线方程
function getLineEquation() {
  let angle = 0; // 角度值
  rulerEquation.k = parseFloat(Math.tan((angle * Math.PI) / 180).toFixed(2));
  rulerEquation.b = parseFloat(
    (rulerPosition.y - rulerEquation.k * rulerPosition.x).toFixed(2)
  );
}

// 获取垂直点
function countVerticalPoint(x, y) {
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
function handleRulerLineStart(e) {
  getLineEquation();
  const targetPoint = countVerticalPoint(e.offsetX, e.offsetY);
  ctx.beginPath();
  ctx.moveTo(targetPoint.x, targetPoint.y);
  flag = true;
}

// 移动吸附直线
function handleRulerLineMove(e) {
  if (flag) {
    const targetPoint = countVerticalPoint(e.offsetX, e.offsetY);
    ctx.lineTo(targetPoint.x, targetPoint.y);
    ctx.stroke();
  }
}

// 结束吸附直线
function handleRulerLineEnd() {
  ctx.closePath();
  flag = false;
  paintType.value = 2;
}

onMounted(() => {
  initCanvas();
  // 鼠标按下绘图
  canvas.onmousedown = (e) => {
    if (isShowRuler.value) {
      handleRulerAround(e);
    }

    switch (paintType.value) {
      case 1:
        handlePaintLineStart(e);
        break;
      case 2:
        checkOnRuler(e);
        break;
      case 3:
        handleRulerLineStart(e);
        break;
    }
  };

  // 鼠标移动绘图
  canvas.onmousemove = (e) => {
    switch (paintType.value) {
      case 1:
        handlePaintLineMove(e);
        break;
      case 2:
        handleRulerMove(e);
        break;
      case 3:
        handleRulerLineMove(e);
        break;
    }
  };

  // 鼠标抬起停止绘图
  canvas.onmouseup = () => {
    switch (paintType.value) {
      case 1:
        handlePaintLineEnd();
        break;
      case 2:
        handleMoveRulerEnd();
        break;
      case 3:
        handleRulerLineEnd();
        break;
    }
  };
});
</script>
