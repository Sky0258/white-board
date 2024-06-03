<template>
    <div
      @mousedown="startPath"
      @mousemove="drawPath"
      @mouseup="endPath"
      @mouseleave="endPath"
      ref="canvas"
      style="position: relative; width: 100%; height: 400px; background: #f3f3f3;"
    >
      <div
        v-for="(path, index) in paths"
        :key="index"
        :style="{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }"
      >
        <canvas :ref="`path${index}`" :width="width" :height="height" style="position: absolute; top: 0; left: 0;"></canvas>
      </div>
    </div>
  </template>
   
  <script>
  export default {
    data() {
      return {
        isDrawing: false,
        lastX: 0,
        lastY: 0,
        width: 0,
        height: 0,
        paths: []
      };
    },
    methods: {
      startPath(e) {
        this.isDrawing = true;
        this.addNewPath();
        const rect = this.$refs.canvas.getBoundingClientRect();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
      },
      drawPath(e) {
        if (!this.isDrawing) return;
        const rect = this.$refs.canvas.getBoundingClientRect();
        const ctx = this.$refs[`path${this.paths.length - 1}`][0].getContext('2d');
        ctx.beginPath();
        ctx.moveTo(this.lastX, this.lastY);
        ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2;
        ctx.stroke();
        this.lastX = e.clientX - rect.left;
        this.lastY = e.clientY - rect.top;
      },
      endPath() {
        if (this.isDrawing) {
          this.isDrawing = false;
        }
      },
      addNewPath() {
        this.width = this.$refs.canvas.offsetWidth;
        this.height = this.$refs.canvas.offsetHeight;
        this.paths.push(this.paths.length);
      }
    }
  };
  </script>