<template>
  <WhiteBoard id="white-board"></WhiteBoard>
</template>

<script>
import WhiteBoard from './view/WhiteBoard.vue'

export default {
  name: 'App',
  components: {
    WhiteBoard
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#white-board {
  width: 95vw;
  height: 95vh;
}
</style>
