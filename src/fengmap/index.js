import { getCurrentPosition } from "../amap/utils/nav";
const fengmap = require("./lib/fengmap.core.min");
require("./lib/fengmap.navi.min");
require("./lib/fengmap.control.min");
require("./lib/fengmap.analyzer.min");
import * as config from './config'

import {
  initFloorControl,
  addTxtControl,
  setNaviDescriptions,
} from "./utils/tools";
// fetch('https://restapi.amap.com/v3/assistant/coordinate/convert?key=d0e232c5ac6dd7ee32104f6c6d353da3&locations=104.195397,35.86166&coordsys=gps')
// .then(async (res)=>{
//   console.log(await res.json());
// })
window.onload = async function () {
  const cords = document.getElementById("cords");
  await getCurrentPosition(cords);
  let locationMarker  = null;
  const options = {
    container: document.getElementById("container"),
    ...config.tesOptions
  };
  const simulateOptions = {
    lineStyle: {
      // 导航线样式
      lineType: fengmap.FMLineType.FMARROW,
      // 设置线的宽度
      lineWidth: 6,
    },
    // locationMarkerUrl: "https://developer.fengmap.com/fmAPI/images/pointer.png",
    // 模拟导肮相关参数
    //导航中路径规划模式, 支持最短路径、最优路径两种。默认为MODULE_SHORTEST, 最短路径。
    naviMode: fengmap.FMNaviMode.MODULE_SHORTEST,
    //导航中的路线规划梯类优先级, 默认为PRIORITY_DEFAULT, 详情参考FMNaviPriority。
    naviPriority: fengmap.FMNaviPriority.PRIORITY_DEFAULT,
    speed: 7, // 模拟导航定位图标行进的速度, 单位m/s。默认7m/s。
    followPosition: false, // 模拟导航中在位置发生变化时, 地图是否跟随位置居中显示。默认true。
    followAngle: false, // 模拟导航中在方向发生变化时, 地图是否跟随方向变化, 保持路线朝向屏幕上方。 默认false。
    changeTiltAngle: false, // 模拟导航中楼层发生变化时是否改变地图的倾斜角度, 并执行动画。默认为true。
    zoom: 21, // 模拟导航开始时地图的显示缩放级别, 默认值为21, 表示1:282的地图比例尺。
    maxZoom: 22, // 模拟导航开始时地图的显示最大缩放级别, 默认值为22, 表示1:141的地图比例尺。防止视角过近。
  };

  const targetOrgin = {
    x: 13380302.92444209,
    y: 3529653.7946467614,
  };
  const map = new fengmap.FMMap(options);
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
    console.log(mapCoord);
    if (clickCount % 2 !== 0) {
      Object.assign(start, mapCoord, { groupID: target.groupID });
      addTxtControl(map, mapCoord, "起点");
    } else {
      Object.assign(dest, mapCoord, { groupID: target.groupID });
      addTxtControl(map, mapCoord, "终点");
    }
  });
  /**
   * 设置定位标注点位置信息
   * */
  function setLocationMakerPosition(coord, angle) {
    //设置定位图标旋转角度
    if (angle) {
      //定位点方向始终与路径线保持平行
      locationMarker.rotateTo({
        to: -angle,
        duration: 0.5,
      });
      //第一人称需旋转地图角度
      map.rotateTo({
        to: angle,
        time: 0.5,
      });
    }
    //不同楼层
    const currentGid = map.focusGroupID;
    if (currentGid !== coord.groupID) {
      //重新设置聚焦楼层
      floorControl.changeFocusGroup(coord.groupID, false);
      //设置locationMarker的位置
      locationMarker.setPosition({
        //设置定位点的x坐标
        x: coord.x,
        //设置定位点的y坐标
        y: coord.y,
        //设置定位点所在楼层
        groupID: coord.groupID,
      });
    }

    //移动locationMarker
    const data = {
      //设置定位点的x坐标
      x: coord.x,
      //设置定位点的y坐标
      y: coord.y,
      //设置定位点所在楼层
      groupID: coord.groupID,
      time: 0.5,
    };

    //移动地图
    map.moveTo({
      x: coord.x,
      y: coord.y,
      groupID: coord.groupID,
      time: 1,
    });
    //移动locationMarker
    locationMarker.moveTo(data);
  }
  const clickMap = {
    'setStart': async ()=>{
      console.log('setStart')
      const res = await getCurrentPosition(cords);
      const latlngToMap = fengmap.FMCalculator.WGS84ToWebMercator({x:res.longitude,y:res.latitude})
      document.getElementById('transformer').innerHTML = `${JSON.stringify(latlngToMap)}`
      const coordsTransformer = fengmap.FMCalculator.CoordTransform({
        origon: [targetOrgin],
        target: [{x:res.longitude,y:res.latitude}]
      })
      locationMarker = new fengmap.FMLocationMarker({
        //x坐标值
        x: latlngToMap.x,
        //y坐标值
        y: latlngToMap.y,
        //图片地址
        url: "./person_first.png",
        //楼层id
        groupID: map.focusGroupID,
        //图片尺寸
        size: 48,
        //marker标注高度
        height: 3,
        callback: function () {
          //回调函数
          console.log("定位点marker加载完成！");
        },
      });
      //添加定位点marker
      map.addLocationMarker(locationMarker);
      //map.relo(targetOrgin);
    },
    'navigate': ()=>{
      const navi = new fengmap.FMNavigation({ map: map, ...simulateOptions });
      navi.setStartPoint(start);
      navi.setEndPoint(dest);
      navi.drawNaviLine();
      // navi.simulate();
      // 设置导航事件
      navi.on("walking", function (data) {
        console.log(data);
        setNaviDescriptions(navi, data);
        setLocationMakerPosition(data.point, data.angle);
      });
    }
  }
  window.addEventListener("click", (e) => {
    const { target } = e;
    if (target.nodeName === "BUTTON") {
      const {
        dataset
      } = target;
      if(dataset.type) {
        clickMap[dataset.type]?.();
      }
    }
  });
};
