<template>
  <canvas ref="canvasRef" width="800" height="600"></canvas>
</template>
 
<script setup>
import { ref, onMounted } from 'vue';
const canvasRef = ref(null);

onMounted(() => {
  const canvas = canvasRef.value;
  console.log(canvas); // 这里应该能够正确获取到 canvas 元素
});
</script>