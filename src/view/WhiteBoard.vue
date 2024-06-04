<template>
  <div>
    <button @click="{paintType = 1;}">画任意线</button>
    <button @click="{paintType = 2;}">直尺</button><br>
    <canvas ref="canvasRef" width="800" height="600"></canvas>
  </div>
</template>
 
<script setup>
import { ref, onMounted } from "vue";
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

onMounted(() => {
  initCanvas();
  // 鼠标按下绘图
  canvas.onmousedown = (e) => {
    if (paintType.value == 1) {
      handlePaintLineStart(e);
    }
  };

  // 鼠标移动绘图
  canvas.onmousemove = (e) => {
    if (paintType.value == 1) {
      handlePaintLineMove(e);
    }
  };

  // 鼠标抬起停止绘图
  canvas.onmouseup = () => {
    if (paintType.value == 1) {
      handlePaintLineEnd();
    }
  };
});
</script>