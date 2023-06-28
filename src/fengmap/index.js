import { getCurrentPosition } from "../amap/utils/nav";
const fengmap = require("./lib/fengmap.core.min");
require("./lib/fengmap.navi.min");
require("./lib/fengmap.control.min");
require("./lib/fengmap.analyzer.min");
import {
  initFloorControl,
  addTxtControl
} from './utils/tools'
window.onload = async function () {
  // const options = {
  //   container: document.getElementById("container"),
  //   appName: "test",
  //   key: "164c72e9cf1a3612802eb070cf9a75f6",
  //   mapID: "1672189434932334594",
  //   level: 1,
  //   mapZoom: 19,
  // };
  const cords = document.getElementById("cords");
  const res = await getCurrentPosition(cords);
  const options = {
    container: document.getElementById("container"),
    appName: "tes",
    key: "2a63f2fe46b5606afec431d263fc484b",
    mapID: "1673491581458231298",
    themeID: "1673511068110753793",
    mapZoom: 19,
  };
  const simulateOptions = {
    lineStyle: {
      // 导航线样式
      lineType: fengmap.FMLineType.FMARROW,
      // 设置线的宽度
      lineWidth: 6,
    },
    // 模拟导肮相关参数
    //导航中路径规划模式, 支持最短路径、最优路径两种。默认为MODULE_SHORTEST, 最短路径。
    naviMode: fengmap.FMNaviMode.MODULE_SHORTEST,
    //导航中的路线规划梯类优先级, 默认为PRIORITY_DEFAULT, 详情参考FMNaviPriority。
    naviPriority: fengmap.FMNaviPriority.PRIORITY_DEFAULT,
    speed: 7, // 模拟导航定位图标行进的速度, 单位m/s。默认7m/s。
    followPosition: true, // 模拟导航中在位置发生变化时, 地图是否跟随位置居中显示。默认true。
    followAngle: false, // 模拟导航中在方向发生变化时, 地图是否跟随方向变化, 保持路线朝向屏幕上方。 默认false。
    changeTiltAngle: true, // 模拟导航中楼层发生变化时是否改变地图的倾斜角度, 并执行动画。默认为true。
    zoom: 21, // 模拟导航开始时地图的显示缩放级别, 默认值为21, 表示1:282的地图比例尺。
    maxZoom: 22, // 模拟导航开始时地图的显示最大缩放级别, 默认值为22, 表示1:141的地图比例尺。防止视角过近。
  };

  const targetOrgin = {
    x: 13380302.92444209,
    y: 3529653.7946467614,
  };
  const map = new fengmap.FMMap(options);
  var lat={
    x: 113.36397527358434,
    y: 22.91600484817306
  }
  // const latlngToMap = fengmap.FMCalculator.latlngToMapCoordinate({
  //   x: res.longitude,
  //   y: res.latitude,
  // });
  // const distanceGap = {
  //   x: latlngToMap.x - targetOrgin.x,
  //   y: latlngToMap.y - targetOrgin.y,
  // };
  map.openMapById(options.mapID, function (error) {
    //打印错误信息
    console.log(error);
  });
  //地图加载完成事件
  map.on("loadComplete", function () {
    //加载楼层切换控件
    initFloorControl(map);
  });
  let start = {
      level: 1,
      url: "https://developer.fengmap.com/fmAPI/images/start.png",
      size: 32,
      height: 0.5,
    },
    dest = {
      level: 1,
      url: "https://developer.fengmap.com/fmAPI/images/end.png",
      size: 32,
      height: 0.5,
    };
  let clickCount = 0;
  map.on("mapClickNode", function (e) {
    clickCount++;
    const { mapCoord, target } = e;
    if (clickCount % 2 !== 0) {
      Object.assign(start, mapCoord, { groupID: target.groupID });
      addTxtControl(map,mapCoord, '起点')
    } else {
      Object.assign(dest, mapCoord, { groupID: target.groupID });
      addTxtControl(map,mapCoord, '终点')
    }
  });
  window.addEventListener("click", (e) => {
    const { target } = e;
    if (target.nodeName === "BUTTON") {
      // 画出导航线
      const navi = new fengmap.FMNavigation({ map: map, ...simulateOptions });
      navi.setStartPoint(start);
      navi.setEndPoint(dest);
      navi.drawNaviLine();
      navi.simulate();
      // 设置导航事件
      navi.on('walking', function (data) {
          console.log(data);
          navi.naviDescriptions[data.index];
      });
      
    }
  });
};
