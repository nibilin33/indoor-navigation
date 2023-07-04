/**
 * 加载楼层切换控件
 * */
export function initFloorControl(map) {
  //楼层控制控件配置参数
  const floorCtlOpt = {
    //默认在左下角
    position: fengmap.FMControlPosition.LEFT_TOP,
    //初始楼层按钮显示个数配置。默认显示5层,其他的隐藏，可滚动查看
    showBtnCount: 1,
    //设置x,y的位置偏移量
    offset: {
      x: 120,
      y: 120,
    },
  };
  new fengmap.FMButtonGroupsControl(map, floorCtlOpt);
}
export function addTxtControl(map, gpos, txt) {
  const groupLayer = map.getFMGroup(map.focusGroupID); //获取当前楼层
  //返回当前层中第一个textMarkerLayer,如果没有，则自动创建
  const layer = groupLayer.getOrCreateLayer("textMarker");
  const tm = new fengmap.FMTextMarker({
    //标注x坐标点
    x: gpos?.x || 0,
    //标注y坐标点
    y: gpos?.y || 0,
    //标注值
    name: txt,
    //文本标注填充色
    fillcolor: "255,0,0",
    //文本标注字体大小
    fontsize: 20,
    //文本标注边线颜色
    strokecolor: "255,255,0",
    //文本标注透明度
    alpha: 0.5,
    //textMarker加载完回调函数
    callback: function () {
      // 在marker载入完成后，设置 "一直可见"，不被其他层遮挡
      tm.alwaysShow();
    },
  });
  //文本标注层添加文本Marker
  layer.addMarker(tm);
}
/**
 * 距离、时间信息展示
 * */
export function setNaviDescriptions(navi, data) {
  //距终点的距离
  let distance = data.remain;
  //路线提示信息
  let prompt = navi.naviDescriptions[data.index];
  //距离终点的最大距离，结束导航 单位：米
  const maxEndDistance = 2;
  if (distance < maxEndDistance) {
    let descriptionDom = document.getElementById("description");
    descriptionDom.innerHTML = "导航结束!";
    return;
  }
  //普通人每分钟走80米。
  let time = distance / 80;
  let m = parseInt(time);
  let s = Math.floor((time % 1) * 60);

  //距离终点距离、时间信息展示
  let descriptionDom = document.getElementById("description");
  descriptionDom.innerHTML =
    "<p>距终点：" +
    distance.toFixed(1) +
    " 米</p><p>大约需要：  " +
    m +
    "  分钟   " +
    s +
    "   秒</p><p>路线提示：" +
    prompt +
    " </p>";
  descriptionDom.style.display = "block";
}
export function addMovingEvent(navi) {
  // setInterval(async ()=>{
  //   const res = await getCurrentPosition(cords);
  //   console.log(res);
  //   let latlngToMap = fengmap.FMCalculator.WGS84ToWebMercator({
  //     x: res.longitude,
  //     y: res.latitude,
  //   });
  //   setLocationMakerPosition(Object.assign(latlngToMap,{groupID:map.focusGroupID}), 0);
  // }, 1000)
  const description = document.getElementById('description');
  description.innerHTML = `监听设备运动`
  if (window.DeviceOrientationEvent) {
    window.addEventListener("devicemotion", (event)=>{
      const x = event.accelerationIncludingGravity.x;
      const y = event.accelerationIncludingGravity.y;
      const z = event.accelerationIncludingGravity.z;
      description.innerHTML = `devicemotion: ${x} : ${y} : ${z}`
    }, true);
    // 浏览器支持DeviceOrientation事件
    window.addEventListener("deviceorientation", (event) => {
      console.log(`${event.alpha} : ${event.beta} : ${event.gamma}`);
      description.innerHTML = `deviceorientation: ${event.alpha} : ${event.beta} : ${event.gamma}`
    });
  } else {
    // 浏览器不支持DeviceOrientation事件
    description.innerHTML = `not support DeviceOrientationEvent`
  }
  if(!window.DeviceMotionEventAcceleration) {
    description.innerHTML = description.innerHTML + `;not support DeviceMotionEventAcceleration`
  }
  // navi.dispatchEvent({
  //   type: 'walking',
  //   angle: 1,
  //   point: {
  //     x: 11,
  //     y: 22
  //   }
  // })
}
