<template>
  <div class="view">
    <div class="ui">
      <div class="img">
        <div class="title">NEX ENERGY</div>
        <div class="sub">Residential Power Bank</div>
        <div>Building a new home energy source</div>
      </div>
    </div>
    <div class="battery">
      <div class="total">Total Capacity:5.12KWh(51.2V,100Ah)</div>
      <div class="weight">Weight:55kg</div>
      <div class="dimension">Dimension:525(W)*855(D)*153(H)mm</div>
      <div class="rating">IP rating:IP65</div>
    </div>
    <div class="life">LifePo4 Battery</div>
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
.img {
  position: absolute;
  left: 7px;
  top: 27px;
  border: 1px solid #9c9c9c;
  padding: 6px;
  border-radius: 12px;
  z-index: 3;
  line-height: 29px;
  span {
    font-weight: bold;
  }
  .title {
    font-weight: bold;
    font-size: 25px;
  }
}
.battery {
  position: absolute;
  right: 14px;
  bottom: 54px;
  z-index: 3;
  font-size: 5px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 213px;
  height: 117px;
  border: 1px solid #9c9c9c;
  border-radius: 12px;
}
.life{
  z-index: 3;
  position: absolute;
  bottom: 22px;
  right: 51px;
  font-size: 20px;
}
</style>
