<template>
  <div>
    <canvas ref="canvasRef" width="800" height="600"></canvas>
  </div>
</template>
 
<script setup>
import { ref, onMounted } from "vue";
const canvasRef = ref(null);


onMounted(() => {
  const canvas = canvasRef.value;
  const ctx = canvas.getContext("2d");

  // 设置画板线条的大小，背景色等
  ctx.lineWidth = 2;
  ctx.strokeStyle = "black";
  let flag = false;
  ctx.fillStyle = "#e0e0e0";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 平滑所画的曲线
  // // 开启抗锯齿
  // ctx.imageSmoothingEnabled = true;
  // // 设置线条样式
  // ctx.lineJoin = 'round';


  // 鼠标按下绘图
  canvas.onmousedown = (e) => {
    flag = true;
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
  };
  // 鼠标抬起停止绘图
  canvas.onmouseup = (e) => {
    ctx.closePath();
    // 首尾封闭成图形并填色
    // ctx.fillStyle = "red";
    // ctx.fill();
    ctx.quadraticCurveTo(200, 200, e.offsetX, e.offsetY);
    flag = false;
  };

  // 鼠标移动绘图
  canvas.onmousemove = (e) => {
    if (flag) {
      console.log(e);
      // ctx.lineTo(e.offsetX, e.offsetY);
      ctx.quadraticCurveTo(200,200, e.offsetX, e.offsetY);
      ctx.stroke();
    }
  };
});
</script>