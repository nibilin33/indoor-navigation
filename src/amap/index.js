import Loader from "@amap/amap-jsapi-loader";
 import {
  getCurrentPosition
 } from './utils/nav';
// 加载高德地图JSAPI
Loader.load({
  key: "2867cc38b67bdc7b831002d63464ba2c",
  version: "2.0",
  plugins: ["AMap.Geocoder", "AMap.IndoorMap", "AMap.IndoorPath","AMap.TileLayer"],
}).then((AMap) => {
 // 获取当前经纬度
  const cords = document.getElementById('cords')
  getCurrentPosition(cords);
  const buildingId = "B0FFG97JK0"; // 金沙印象城，无室内地图
  const geocoder = new AMap.Geocoder({
    city: '杭州市'
  });
  const indoorMap = new AMap.IndoorMap({alwaysShow:true});
  const map = new AMap.Map("container", {
      zoom: 18,
      resizeEnable: true,
      showIndoorMap:false,//隐藏地图自带的室内地图图层
      layers:[indoorMap,new AMap.TileLayer()]
  });
  // 开发的几个数据 B00190BPMZ, B000A856LJ，B0FFF3Z0H7-龙湖杭州金沙天街，B0FFHSBX71-来福士,B023B0A4ZD-万象城,B0H1267LGW-龙湖杭州滨江天街店
  indoorMap.showIndoorMap('B023B0A4ZD');
  geocoder.getLocation('杭州市钱塘区金沙大道97号杭州金沙印象城B1层',function(status, result){
    if (result.info === 'OK') {
        console.log(status)
        const location = result.geocodes[0].location; // 获取地理编码的经纬度
        //map.setCenter(location); // 将地图中心设置为地理编码的位置
    }
  })

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
