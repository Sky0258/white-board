<template>
  <div>
    <button @click="{  paintType = 1;}">画任意线</button>
    <button @click="handleRuler">直尺</button>
    <button @click="handlePaintHistory">绘制历史线</button><br><br>
    <canvas ref="canvasRef" width="1200" height="700"></canvas>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { checkOnRuler, handleShowRuler, handleRulerMove, handleMoveRulerEnd, handleInclineRulerMove, handleInclineRulerEnd } from '../modules/handleMoveRuler'
import { paintHistoryLine, saveHistoryPath } from '../modules/handleSave'
import { handleNormalLineStart, handleNormalLineMove, handleNormalLineEnd } from '../modules/handleNormalLine'
import { handleRulerLineMove, handleRulerLineEnd } from '../modules/handleRulerLine'

const canvasRef = ref(null);
let canvas = null;
let ctx = null;
let paintType = ref(1);
// 判断是否是绘制当前界面的历史线（判断用不用 push 进当前的 pathStore)
let paintCurrentPathHistory = ref(false);
const linePath = [];
let angle = ref(0);
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


// 4. 暂存模块
function handlePaintHistory() {
  paintHistoryLine(ctx, paintCurrentPathHistory, linePath);
}


// 2.移动尺子模块
let isShowRuler = ref(false);
// 记录尺子左上角位置
const rulerPosition = reactive({
  x: 300,
  y: 300,
});

function handleRuler() {
  angle.value = 0;
  handleShowRuler(rulerPosition.x, rulerPosition.y, ctx, isShowRuler, paintType, paintCurrentPathHistory, linePath);
}


onMounted(() => {
  saveHistoryPath();
  initCanvas();
  // 鼠标按下绘图
  canvas.onmousedown = (e) => {
    switch (paintType.value) {
      case 1:
        handleNormalLineStart(e, isShowRuler, ctx, paintCurrentPathHistory, linePath, rulerPosition, paintType, angle);
        break;
      case 2:
        checkOnRuler(e, rulerPosition, paintType);
        break;
    }
  };

  // 鼠标移动绘图
  canvas.onmousemove = (e) => {
    switch (paintType.value) {
      case 1:
        handleNormalLineMove(e, ctx, rulerPosition, paintCurrentPathHistory, linePath, paintType);
        break;
      case 2:
        handleRulerMove(e, rulerPosition,ctx, paintCurrentPathHistory, linePath, isShowRuler);
        break;
      case 3:
        handleRulerLineMove(e, ctx, paintCurrentPathHistory, linePath);
        break;
      case 4:
        handleInclineRulerMove(ctx, e, rulerPosition, paintCurrentPathHistory, linePath, angle);
        break;
    }
  };

  // 鼠标抬起停止绘图
  canvas.onmouseup = () => {
    switch (paintType.value) {
      case 1:
        handleNormalLineEnd(ctx, paintCurrentPathHistory, linePath);
        break;
      case 2:
        console.log('鼠标抬起');
        handleMoveRulerEnd(paintType);
        break;
      case 3:
        handleRulerLineEnd(ctx, paintCurrentPathHistory, linePath, paintType);
        break;
      case 4:
        handleInclineRulerEnd(paintType);
        break;
    }
  };
});
</script>
