import Loader from "@amap/amap-jsapi-loader";
// 加载高德地图JSAPI
Loader.load({
  key: "2867cc38b67bdc7b831002d63464ba2c",
  version: "2.0",
  plugins: ["AMap.Geocoder", "AMap.IndoorMap", "AMap.IndoorPath"],
}).then((AMap) => {
  // todo: Geocoder 方法查不出
  const lng = 120.3362163838562,
    lat = 30.308641096219432;
  // 创建地图实例
  const map = new AMap.Map("container", {
    center: [lng, lat],
    zoom: 18,
  });
  const buildingId = "B0G26SKCJP";
  const floorIds = "B1";
  const indoorMapLayer = new AMap.IndoorMap(map);
  // 室内地图无效
  indoorMapLayer.showIndoorMap(buildingId, floorIds);
  const clickResult = [];
  map.on("click", (e) => {
    const lnglat = e.lnglat; // 获取点击位置的经纬度
    // const infoWindow = new AMap.InfoWindow({
    // content: `<div>经度: ${lnglat.lng}</div><div>纬度: ${lnglat.lat}</div>`, // 弹窗内容
    // position: lnglat, // 弹窗位置
    // });
    // infoWindow.open(map);
    clickResult.push(...[lnglat.lng, lnglat.lat]);
    const marker = new AMap.Marker({
      position: [lnglat.lng, lnglat.lat],
    });
    map.add(marker);
  });
});
