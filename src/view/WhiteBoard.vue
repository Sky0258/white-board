<template>
  <div>
    <button @click="{  paintType = 1;}">画任意线</button>
    <button @click="handleRuler">直尺</button>
    <button @click="paintHistoryLine">绘制历史线</button><br>
    <canvas ref="canvasRef" width="1200" height="700"></canvas>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import {
  getPathStore,
  // addDataToStore,
  setLocalStorageValue,
} from "../state/index";

import {
  paintLineStart,
  paintLineMove,
  paintLineEnd,
} from "../utils/paintLine";


import { checkOnRuler, handleShowRuler, handleRulerMove, handleMoveRulerEnd } from '../modules/handleMoveRuler'




const canvasRef = ref(null);
let canvas = null;
let ctx = null;
let flag = false;
let paintType = ref(1);
// 判断是否是绘制当前界面的历史线（判断用不用 push 进当前的 pathStore)
let paintCurrentPathHistory = ref(false);
const linePath = [];

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
  if (isShowRuler.value && handleRulerAround(e)) {
    handleRulerLineStart(e);
    return;
  }

  flag = true;
  paintLineStart(
    ctx,
    e.offsetX,
    e.offsetY,
    paintCurrentPathHistory.value,
    linePath
  );
}

function handlePaintLineMove(e) {
  if (flag && !checkOnRuler(e, rulerPosition)) {
    paintLineMove(
      ctx,
      e.offsetX,
      e.offsetY,
      paintCurrentPathHistory.value,
      linePath
    );
  }
}

function handlePaintLineEnd() {
  paintLineEnd(ctx, paintCurrentPathHistory.value, linePath);
  linePath.length = 0;
  flag = false;
}

// 4. 暂存模块
function paintPathLine(storeName) {
  ctx.lineWidth = 5;
  ctx.strokeStyle = "blue";
  const oldPath = getPathStore(storeName);
  oldPath &&
    oldPath.forEach((item) => {
      paintLineStart(
        ctx,
        item[0].offsetX,
        item[0].offsetY,
        paintCurrentPathHistory.value,
        linePath
      );
      for (let i = 0; i < item.length; i++) {
        paintLineMove(
          ctx,
          item[i].offsetX,
          item[i].offsetY,
          paintCurrentPathHistory.value,
          linePath
        );
      }
      paintLineEnd(ctx, paintCurrentPathHistory.value, linePath);
      linePath.length = 0;
    });
  ctx.lineWidth = 1;
  ctx.strokeStyle = "black";
}

function paintHistoryLine() {
  // 开启线条推入
  paintCurrentPathHistory.value = false;
  paintPathLine("historyPathStore");
}

// 刷新前缓存
function saveHistoryPath() {
  const currentPath = getPathStore("currentPathStore");
  currentPath &&
    setLocalStorageValue("historyPathStore", JSON.stringify(currentPath));
  setLocalStorageValue("currentPathStore", null);
}

// 2.移动尺子模块
let isShowRuler = ref(false);
// 记录尺子左上角位置
const rulerPosition = reactive({
  x: 300,
  y: 300,
});

function handleRuler() {
  handleShowRuler(rulerPosition.x, rulerPosition.y, ctx, isShowRuler, paintType, paintCurrentPathHistory, linePath);
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
    return true;
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
  paintLineStart(
    ctx,
    targetPoint.x,
    targetPoint.y,
    paintCurrentPathHistory.value,
    linePath
  );
  flag = true;
}

// 移动吸附直线
function handleRulerLineMove(e) {
  if (flag) {
    const targetPoint = countVerticalPoint(e.offsetX, e.offsetY);
    paintLineMove(
      ctx,
      targetPoint.x,
      targetPoint.y,
      paintCurrentPathHistory.value,
      linePath
    );
  }
}

// 结束吸附直线
function handleRulerLineEnd() {
  // 替换
  // ctx.closePath();
  paintLineEnd(ctx, paintCurrentPathHistory.value, linePath);
  linePath.length = 0;
  flag = false;
  paintType.value = 1;
}

onMounted(() => {
  saveHistoryPath();
  initCanvas();
  // 鼠标按下绘图
  canvas.onmousedown = (e) => {
    switch (paintType.value) {
      case 1:
        handlePaintLineStart(e);
        break;
      case 2:
        checkOnRuler(e, rulerPosition);
        break;
      // case 3:
      //   handleRulerLineStart(e);
      //   break;
    }
  };

  // 鼠标移动绘图
  canvas.onmousemove = (e) => {
    switch (paintType.value) {
      case 1:
        handlePaintLineMove(e);
        break;
      case 2:
        handleRulerMove(e, rulerPosition,ctx, paintCurrentPathHistory, linePath, isShowRuler);
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
        handleMoveRulerEnd(paintType);
        break;
      case 3:
        handleRulerLineEnd();
        break;
    }
  };
});
</script>
