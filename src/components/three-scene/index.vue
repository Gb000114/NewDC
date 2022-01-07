<template>
  <div class="three-scene" ref="three-scene" onselectstart="return false;">
    <div
      class="btn"
      @pointerdown="
        (e) => {
          e.preventDefault();
          e.stopPropagation();
        }
      "
    >
      <button @click="appear">显示</button>
      <button @click="disappear">隐藏</button>
    </div>
  </div>
</template>

<script>
import Change from "./Change";
import { RunScene } from "run-scene";
import { Bus } from "run-scene";
// 场景的传值Bus
const bus = new Bus();
export default {
  data() {
    return {
      change: null,
      runScene: null,
    };
  },
  mounted() {
    // 加载场景
    this.loadScene();
    // 打印点击的模型接口
    bus.$on("logClickModel", this.logClickModel);
  },
  methods: {
    // 加载场景
    loadScene() {
      this.runScene = new RunScene({
        path: "https://test2-1303915342.cos.ap-shanghai.myqcloud.com/newbattery/d.glb",
        // path: "./assets/s.glb",
        rootDom: this.$refs["three-scene"],
        options: {
          resize: true,
          // firstTexture:true
          // css3DRender: true,
          // css2DRender: true,
          // run: false,
          static: false,
          level: 2,
          progress: (pg) => {
            console.log("进度:", pg);
          },
          // controlsUpdate: false,
        },
      }).done(async (runScene) => {
        await Promise.resolve(1);
        let Info = { bus: bus };
        // 所需要的信息统一成对象传入Change中
        this.change = new Change(runScene, Info).init(this.onDone);
      });
    },
    // 场景加载完毕回调
    onDone() {
      console.log("场景加载完毕~");
    },
    // 打印点击到的模型
    logClickModel(model) {
      console.log("点击的模型为:", model.name);
    },
    // 显示尺寸
    appear() {
      this.change.focus.sizefocus();
      this.change.size.isShowSize(true)
    },
    //隐藏尺寸
    disappear(){
      this.change.focus.backfocus();
      this.change.size.isShowSize(false)
    }
  },
};
</script>

<style lang="less" scoped>
.three-scene {
  width: 100vw;
  height: 100vh;
  .btn {
    z-index: 10;
    position: absolute;
    button {
      float: left;
      color: black;
    }
  }
}

.showOpacity {
  opacity: 1 !important;
}
</style>
