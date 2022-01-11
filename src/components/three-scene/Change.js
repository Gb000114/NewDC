// const console = {
//   log: () => { }
// }

// 声明变量
let camera, scene, controls, renderer2, renderer, dom, t, p, runScene;
import * as THREE from "three";
import jfThree from "js-funcs-three";

// 拿资源
const setAssets = (assets) => {
  camera = assets.camera;
  scene = assets.scene;
  controls = assets.controls;
  renderer2 = assets.renderer2;
  renderer = assets.renderer;
  dom = assets.dom;
  t = assets.t;
  p = assets.p;
};

// 整体场景事件
function Change(runScene, info) {
  /* 拿资源 分解资源 
      this挂载至t上 
      p为公共方法从runScene上取
      runScene上的其他Api可以直接runScene.直接使用
  */
  setAssets({ ...runScene.getAssets(), t: this, p: runScene.p, runScene });
  //排队需要执行的事件
  this.pending = [];
  // 全局使用的bus
  const { bus } = info;
  // 使用bus
  this.bus = bus;
  // 基本事件
  this.events = new Events();
  //尺寸显示和隐藏
  this.size = new Size();
  //聚焦事件
  this.focus = new Focus();
  // 初始化
  this.init = (onDone) => {
    Promise.all(this.pending).then((results) => {
      // 实现running的每帧调用
      runScene.setLoopFn(this.running);
      //相机缓动
      controls.enableDamping = true;

      //入场动画
      this.entranceAmin();

      // 成功回调
      onDone && onDone();
    });
    return this;
  };

  // 入场动画
  this.entranceAmin = () => {
    t.events.closeAnimaAtStart.entranceAmin = p.camAnima(
      p.getCamLocal(),
      {
        cx: -345.6820666025319,
        cy: 1787.5502320404528,
        cz: -0.23055810865404114,
        tx: -68.14938993861004,
        ty: 446.5107458059801,
        tz: 2.3373565968211096,
      },
      1,
      () => {
        t.events.closeAnimaAtStart.entranceAmin = p.camAnima(
          p.getCamLocal(),
          {
            cx: -3038.944771816833,
            cy: 1425.0445032579496,
            cz: -3.3790678000101053,
            tx: -73.189391,
            ty: 484.338424,
            tz: 26.080386,
          },
          1
        );
      }
    );
  };

  // 每帧调用函数 render同步
  this.running = () => {};

  // 销毁
  this.dispose = () => {
    this.init = () => {};
    dom.removeEventListener("click", this.click);
    runScene.dispose();
  };
}

//尺寸显示和隐藏
class Size {
  // 长度
  Linescale = {
    length: p.getModel("长度"),
    width: p.getModel("宽度"),
    height: p.getModel("高度"),
  };
  Wordscale = {
    length: p.getModel("长度字"),
    width: p.getModel("宽度字"),
    height: p.getModel("高度字"),
  };
  constructor() {
    this.init();
    this.isShowSize(false);
  }
  init() {
    Object.values(this.Linescale).map((i) => {
      i.children &&
        i.children.map((model) => {
          model.oldScale = { ...model.scale };
        });
    });
    Object.values(this.Wordscale).map((i) => {
      i.oldScale = { ...i.scale };
    });
  }
  // 判断是否显示尺寸 ---- true显示 false隐藏
  isShowSize(isShow) {
    Object.values(this.Linescale).map((i) => {
      i.matrixAutoUpdate = true;
      i.children &&
        i.children.map((model) => {
          model.matrixAutoUpdate = true;
          t.events.closeAnimaAtStart.ShowSizeOne = p.anima(
            {
              x: model.scale.x,
              y: model.scale.y,
              z: model.scale.z,
            },
            {
              x: isShow ? model.oldScale.x : 0,
              y: isShow ? model.oldScale.y : 0,
              z: isShow ? model.oldScale.z : 0,
            },
            1,
            (data) => {
              model.scale.x = data.x;
              model.scale.y = data.y;
              model.scale.z = data.z;
            }
          );
        });
    });
    Object.values(this.Wordscale).map((i) => {
      i.matrixAutoUpdate = true;
      t.events.closeAnimaAtStart.ShowSizeSecond = p.anima(
        {
          x: i.scale.x,
          y: i.scale.y,
          z: i.scale.z,
        },
        {
          x: isShow ? i.oldScale.x : 0,
          y: isShow ? i.oldScale.y : 0,
          z: isShow ? i.oldScale.z : 0,
        },
        1,
        (data) => {
          i.scale.x = data.x;
          i.scale.y = data.y;
          i.scale.z = data.z;
        }
      );
    });
  }
}

//聚焦事件
class Focus {
  constructor() {}
  oldAngle = {
    cx: -1412.0053887971837,
    cy: 731.9969609203264,
    cz: 20.299430753139674,
    tx: -56.45197638592644,
    ty: 541.2733126956798,
    tz: 59.25222975774079,
  };
  //聚焦显示
  sizefocus() {
    p.camAnima(
      p.getCamLocal(),
      {
        cx: -2135.6350447164036,
        cy: 1741.3956587790512,
        cz: 627.7030837063357,
        tx: -8.012608808963794,
        ty: 545.9788742687629,
        tz: -55.74910719014835,
      },
      1
    );
  }
  //还原
  backfocus() {
    // p.camAnima(p.getCamLocal(), this.oldAngle, 1);
    p.camAnima(
      p.getCamLocal(),
      {
        cx: -3038.944771816833,
        cy: 1425.0445032579496,
        cz: -3.3790678000101053,
        tx: -73.189391,
        ty: 484.338424,
        tz: 26.080386,
      },
      1
    );
  }
}

// 工具类
class Events {
  // 初始化
  constructor() {
    dom.addEventListener("pointerdown", this.mouseDown);
    dom.addEventListener("pointerup", this.mouseUp);
    controls.addEventListener("start", this.controlStart);
    dom.addEventListener("onkeydown ", this.keydownEvents);
  }

  // 点位
  downPosition = { x: 0, y: 0 };

  // 需要被打断的动画名称
  closeAnimaAtStart = {
    enterAnima: "",
    ShowSize: "",
  };

  keydownEvents = (event) => {
    console.log(event);
  };

  mouseDown = (event) => {
    this.downPosition = {
      x: event.offsetX,
      y: event.offsetY,
    };
  };

  mouseUp = (event) => {
    if (event.button === 2) return;
    const ux = event.offsetX;
    const uy = event.offsetY;
    const { x, y } = this.downPosition;
    // 当点击的位置和点击后的位置一致时就会触发
    ux === x && uy === y && this.triggerClick(event);
  };

  mouseMove = (e) => {
    const { intersects, obj } = p.getClickObj(e, scene.children);
    if (!obj) return;
    // console.log('悬浮选中的模型', obj,);
  };

  triggerClick = (e) => {
    console.log(
      `cx:${camera.position.x},cy:${camera.position.y},cz:${camera.position.z}`,
      "位置"
    );
    console.log(
      `tx:${controls.target.x},ty:${controls.target.y},tz:${controls.target.z}`,
      "相机视角"
    );

    const { intersects, obj } = p.getClickObj(e, scene.children, true);
    if (!obj) return;

    console.log("点击的对象", obj.name, obj);

    // 点击打印模型接口
    t.bus.$emit("logClickModel", obj);
  };

  controlStart = () => {
    this.closeAnmia();
  };

  // 关闭所有的动画
  closeAnmia() {
    Object.values(this.closeAnimaAtStart).map(
      (item) =>
        // 暂停动画 并清空内容 item就是那个动画
        item && item.kill()
    );
  }

  dispose() {
    dom.removeEventListener("pointerdown", this.mouseDown);
    dom.removeEventListener("pointerup", this.mouseUp);
    controls.removeEventListener("start", this.controlStart);
  }
}
export default Change;
