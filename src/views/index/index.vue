<template>
  <div class="view">
    <three-scene></three-scene>
  </div>
</template>
<script>
import ThreeScene from "../../components/three-scene";

export default {
  components: {
    ThreeScene,
  },
};
</script>
<style lang="less" scoped>
.view {
  width: 100vw;
  height: 100vh;
}
</style>
