<template>
  <div>
    <button
      @click="
        {
          paintType = 1;
        }
      ">画任意线</button>
    <button @click="drawRuler(300, 300)">直尺</button><br />
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

function initCanvas() {
  canvas = canvasRef.value;
  ctx = canvas.getContext("2d");
  // 设置画板线条的大小，背景色等
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  ctx.fillStyle = "#e0e0e0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  // 平滑所画的曲线
  // // 开启抗锯齿
  // ctx.imageSmoothingEnabled = true;
  // ctx.lineJoin = 'round';
}

function handlePaintLineStart(e) {
  flag = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

function handlePaintLineMove(e) {
  if (flag) {
    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
  }
}

function handlePaintLineEnd() {
  ctx.closePath();
  flag = false;
}

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

function drawRuler(x, y) {
  paintType.value = 2;
  // 把之前的尺子删掉
  ctx.fillStyle = "#e0e0e0";
  ctx.fillRect(preRulerPosition.x - 10, preRulerPosition.y - 10, 420, 90);

  preRulerPosition.x = x;
  preRulerPosition.y = y;

  ctx.fillStyle = "white";
  ctx.fillRect(x, y, 400, 70);

  // 绘制横向刻度
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + 400, y);
  ctx.stroke();

  // 绘制竖向刻度
  for (let i = 0; i <= 400; i += 20) {
    ctx.beginPath();
    ctx.moveTo(x + i, y);
    let yLine = i % 100 == 0 ? 23 : 10;
    ctx.lineTo(x + i, y + yLine);
    ctx.stroke();
  }
}

function handleMoveRuler(e) {
  const { distanceX, distanceY } = distanceToRuler;

  if (isDragging.value) {
    rulerPosition.x = e.offsetX - distanceX;
    rulerPosition.y = e.offsetY - distanceY;
    drawRuler(rulerPosition.x, rulerPosition.y);
  }
}

function checkOnRuler(e) {
  const { x, y } = rulerPosition;
  if (e.offsetX >= x && e.offsetX <= x + 400 && e.offsetY >= y && e.offsetY <= y + 70) {
    distanceToRuler.distanceX = e.offsetX - x;
    distanceToRuler.distanceY = e.offsetY - y;
    isDragging.value = true;
    return true;
  }
  return false;
}
// function handleRulerRange(e) {
//   if(e.offsetX >= 250 && e.offsetX <= 650 && e.offsetY >= 250 && e.offsetY <= 470) {
//     console.log('在尺子周围');
//   }
// }

function handleMoveRulerEnd() {
  isDragging.value = false;
}

onMounted(() => {
  initCanvas();
  // 鼠标按下绘图
  canvas.onmousedown = (e) => {
    switch (paintType.value) {
      case 1:
        handlePaintLineStart(e);
        break;
      case 2:
        checkOnRuler(e);
        break;
    }
  };

  // 鼠标移动绘图
  canvas.onmousemove = (e) => {
    // if (paintType.value == 1) {
    //   handlePaintLineMove(e);
    // }
    switch (paintType.value) {
      case 1:
        handlePaintLineMove(e);
        break;
      case 2:
        handleMoveRuler(e);
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
    }
  };
});
</script>
