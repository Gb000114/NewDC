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
            cx: -1412.0053887971837,
            cy: 731.9969609203264,
            cz: 20.299430753139674,
            tx: -56.45197638592644,
            ty: 541.2733126956798,
            tz: 59.25222975774079,
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
    // 默认0.1秒缩放为0
    this.Small(0.1);
  }
  // 判断是否显示尺寸 ---- true显示 false隐藏
  isShowSize(isShow) {
    if (isShow) {
      Object.values(this.Linescale).map((i) => {
        i.matrixAutoUpdate = true;
        i.children &&
          i.children.map((model) => {
            model.matrixAutoUpdate = true;
            p.anima(
              {
                x: model.scale.x,
                y: model.scale.y,
                z: model.scale.z,
              },
              {
                x: model.oldScale.x,
                y: model.oldScale.y,
                z: model.oldScale.z,
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
        p.anima(
          {
            x: i.scale.x,
            y: i.scale.y,
            z: i.scale.z,
          },
          {
            x: i.oldScale.x,
            y: i.oldScale.y,
            z: i.oldScale.z,
          },
          1,
          (data) => {
            i.scale.x = data.x;
            i.scale.y = data.y;
            i.scale.z = data.z;
          }
        );
      });
    } else {
      this.Small(1);
    }
  }
  // 缩小
  Small(timer) {
    p.getMacro(() => {
      this.Linescale &&
        Object.values(this.Linescale).map((i) => {
          i.matrixAutoUpdate = true;
          if (i.children !== undefined) {
            i.children.map((model) => {
              model.matrixAutoUpdate = true;
              model.oldScale = { ...model.scale };
              p.anima(
                {
                  x: model.scale.x,
                  y: model.scale.y,
                  z: model.scale.z,
                },
                {
                  x: 0,
                  y: 0,
                  z: 0,
                },
                timer,
                (data) => {
                  model.scale.x = data.x;
                  model.scale.y = data.y;
                  model.scale.z = data.z;
                }
              );
            });
          }
        });

      Object.values(this.Wordscale).map((i) => {
        i.matrixAutoUpdate = true;
        i.oldScale = { ...i.scale };
        p.anima(
          {
            x: i.scale.x,
            y: i.scale.y,
            z: i.scale.z,
          },
          {
            x: 0,
            y: 0,
            z: 0,
          },
          timer,
          (data) => {
            i.scale.x = data.x;
            i.scale.y = data.y;
            i.scale.z = data.z;
          }
        );
      });
    }, 100);
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
        cx:-1440.6863285544177,cy:1378.5833692821657,cz:590.7573616240431,
        tx:45.11176998942494,ty:543.7792440323999,tz:113.4772068436512
      },
      1
    );
  }
  //还原
  backfocus() {
    p.camAnima(p.getCamLocal(), this.oldAngle, 1);
  }
}
export default Change;
