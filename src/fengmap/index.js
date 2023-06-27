window.onload = function () {
  const options = {
    container: document.getElementById("container"),
    appName: "test",
    key: "164c72e9cf1a3612802eb070cf9a75f6",
    mapID: "1672189434932334594",
    level: 1,
    mapZoom: 19,
  };
  // const options = {
  //   container: document.getElementById("container"),
  //   appName: "tes",
  //   key: "2a63f2fe46b5606afec431d263fc484b",
  //   mapID: "1673491581458231298",
  //   level: 1,
  //   mapZoom: 19,
  // };
  const simulateOptions = {
    // 模拟导肮相关参数
    speed: 7, // 模拟导航定位图标行进的速度, 单位m/s。默认7m/s。
    followPosition: true, // 模拟导航中在位置发生变化时, 地图是否跟随位置居中显示。默认true。
    followAngle: false, // 模拟导航中在方向发生变化时, 地图是否跟随方向变化, 保持路线朝向屏幕上方。 默认false。
    changeTiltAngle: true, // 模拟导航中楼层发生变化时是否改变地图的倾斜角度, 并执行动画。默认为true。
    zoom: 21, // 模拟导航开始时地图的显示缩放级别, 默认值为21, 表示1:282的地图比例尺。
    maxZoom: 22, // 模拟导航开始时地图的显示最大缩放级别, 默认值为22, 表示1:141的地图比例尺。防止视角过近。
  };
  const map = new fengmap.FMMap(options);
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
  map.on("click", function (e) {
    clickCount++;
    console.log(e);
    const { coords } = e;
    if (clickCount % 2 !== 0) {
      Object.assign(start, coords);
    } else {
      Object.assign(dest, coords);
    }
  });
  window.addEventListener("click", (e) => {
    const { target } = e;
    if (target.nodeName === "BUTTON") {
      const analyser = new fengmap.FMNaviWalkAnalyser(
        { map: map },
        function () {
          const navi = new fengmap.FMNavigationWalk({
            map: map,
            analyser: analyser,
            locationMarkerUrl:
              "https://developer.fengmap.com/fmAPI/images/bluedot-arrow.png",
            locationMarkerSize: 48,
            lineMarkerHeight: 0.5,
            locationMarkerHeight: 0.5,
          });
          // 设置起终点
          navi.setStartPoint(start);
          navi.setDestPoint(dest);
          // 导航分析
          navi.route(
            {
              mode: fengmap.FMNaviMode.MODULE_BEST,
              priority: fengmap.FMNaviPriority.PRIORITY_DEFAULT,
            },
            function (result) {
              // 导航分析成功回调
              var line = navi.drawNaviLine();
              // 自适应路线全览
              navi.overview(
                {
                  ratio: 1.5,
                },
                function () {
                  console.log("自适应全览动画结束回调");
                }
              );
            },
            function (result) {
              // 导航分析失败回调
              console.log("failed", result);
            }
          );
          navi.simulate(simulateOptions);
          navi.on("walking", function (info) {
            /* 在导航过程中，通过 walking 的回调参数中的 info.index 参数来判断当前行进中的路段，从 FMNavigation 中的  naviResult.subs 中获取当前路段的文字指引 */
            console.log("路线总距离", navi);
          });
        }
      );
    }
  });
};
