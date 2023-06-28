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
    x: gpos.x,
    //标注y坐标点
    y: gpos.y,
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
      tm.alwaysShow()
    },
  });
  //文本标注层添加文本Marker
  layer.addMarker(tm);
}
